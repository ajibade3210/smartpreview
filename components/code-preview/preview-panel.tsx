"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import * as Babel from "@babel/standalone";
import type { Variable } from "./variables-panel";
import type { ViewportSize } from "./viewport-toggle";
import type { PreviewTheme } from "./preview-theme-toggle";
import type { ConsoleMessage } from "./console-panel";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  code: string;
  language: "html" | "pug" | "handlebars" | "jsx";
  variables: Variable[];
  viewport: ViewportSize;
  previewTheme: PreviewTheme;
  onHtmlChange?: (html: string) => void;
  onConsoleMessage?: (message: ConsoleMessage) => void;
}

function variablesToObject(variables: Variable[]): Record<string, string> {
  return variables.reduce((acc, { key, value }) => {
    if (key) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}

function replaceHTMLVariables(html: string, vars: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
    result = result.replace(regex, value);
  }
  return result;
}

function compileJSX(code: string): string {
  try {
    const result = Babel.transform(code, {
      presets: ["react"],
      filename: "App.jsx",
    });
    return result.code || "";
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "JSX compilation error");
  }
}

let consoleMessageId = 0;

function createReactHTML(compiledCode: string, vars: Record<string, string>): string {
  const propsJson = JSON.stringify(vars);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Override console methods to send messages to parent
    const originalConsole = { ...console };
    ['log', 'warn', 'error', 'info'].forEach(method => {
      console[method] = (...args) => {
        originalConsole[method](...args);
        window.parent.postMessage({
          type: 'console',
          method: method,
          content: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
        }, '*');
      };
    });

    try {
      const __props__ = ${propsJson};
      ${compiledCode}
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App, __props__));
    } catch (err) {
      console.error(err.message);
      document.getElementById('root').innerHTML = '<pre style="color: red; padding: 20px;">' + err.message + '</pre>';
    }
  </script>
</body>
</html>`;
}

function createHTMLWithConsole(html: string): string {
  // Inject console override into HTML
  const consoleScript = `<script>
    const originalConsole = { ...console };
    ['log', 'warn', 'error', 'info'].forEach(method => {
      console[method] = (...args) => {
        originalConsole[method](...args);
        window.parent.postMessage({
          type: 'console',
          method: method,
          content: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
        }, '*');
      };
    });
  </script>`;
  
  // Insert before closing body tag or at the end
  if (html.includes('</body>')) {
    return html.replace('</body>', `${consoleScript}</body>`);
  }
  return html + consoleScript;
}

const viewportWidths: Record<ViewportSize, number> = {
  desktop: 0,
  tablet: 768,
  mobile: 375,
};

export function PreviewPanel({ 
  code, 
  language, 
  variables, 
  viewport, 
  previewTheme,
  onHtmlChange,
  onConsoleMessage 
}: PreviewPanelProps) {
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const vars = useMemo(() => variablesToObject(variables), [variables]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console' && onConsoleMessage) {
        onConsoleMessage({
          id: ++consoleMessageId,
          type: event.data.method as ConsoleMessage['type'],
          content: event.data.content,
          timestamp: new Date(),
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleMessage]);

  // Memoize JSX compilation for better performance
  const jsxHtml = useMemo(() => {
    if (language !== "jsx") return null;
    try {
      const compiled = compileJSX(code);
      return createReactHTML(compiled, vars);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "JSX compilation error" };
    }
  }, [code, language, vars]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        let compiledHtml = "";
        
        // Handle HTML directly with variable replacement
        if (language === "html") {
          compiledHtml = createHTMLWithConsole(replaceHTMLVariables(code, vars));
          setHtml(compiledHtml);
          setError(null);
          onHtmlChange?.(compiledHtml);
          return;
        }

        // Handle JSX with Babel (client-side)
        if (language === "jsx") {
          if (jsxHtml && typeof jsxHtml === "object" && "error" in jsxHtml) {
            setError(jsxHtml.error);
            return;
          }
          compiledHtml = jsxHtml || "";
          setHtml(compiledHtml);
          setError(null);
          onHtmlChange?.(compiledHtml);
          return;
        }

        // Handle Pug/Handlebars via API with variables
        const response = await fetch("/api/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language, variables: vars }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Compilation error");
          return;
        }

        compiledHtml = createHTMLWithConsole(data.html);
        setHtml(compiledHtml);
        setError(null);
        onHtmlChange?.(compiledHtml);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Compilation error");
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [code, language, jsxHtml, vars, onHtmlChange]);

  const iframeWidth = viewportWidths[viewport] || "100%";
  const showViewportFrame = viewport !== "desktop";

  if (error) {
    return (
      <div className={cn(
        "flex h-full w-full items-center justify-center p-6",
        previewTheme === "dark" ? "bg-neutral-900" : "bg-white"
      )}>
        <div className="max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="font-mono text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex h-full w-full items-center justify-center overflow-auto",
      previewTheme === "dark" ? "bg-neutral-900" : "bg-neutral-100"
    )}>
      <div
        className={cn(
          "h-full transition-all duration-300",
          showViewportFrame && "rounded-lg border border-border shadow-2xl"
        )}
        style={{
          width: showViewportFrame ? iframeWidth : "100%",
          maxWidth: "100%",
        }}
      >
        <iframe
          srcDoc={html}
          title="Preview"
          className={cn(
            "h-full w-full border-0",
            showViewportFrame && "rounded-lg"
          )}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
