"use client";

import { useState, useCallback, useEffect } from "react";
import { CodeEditor } from "./code-editor";
import { PreviewPanel } from "./preview-panel";
import { ViewToggle, type ViewMode } from "./view-toggle";
import { LanguageSelector, type Language } from "./language-selector";
import { VariablesPanel, type Variable } from "./variables-panel";
import { ToolbarActions } from "./toolbar-actions";
import { TemplateGallery, type Template } from "./template-gallery";
import { ViewportToggle, type ViewportSize } from "./viewport-toggle";
import { PreviewThemeToggle, type PreviewTheme } from "./preview-theme-toggle";
import { ConsolePanel, type ConsoleMessage } from "./console-panel";
import { cn } from "@/lib/utils";
import { FileCode2, Terminal, Code2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      max-width: 400px;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 12px;
      background: linear-gradient(90deg, #4ade80, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, {{name}}!</h1>
    <p>Welcome to {{app}}. Start editing to see live changes.</p>
  </div>
</body>
</html>`;

const DEFAULT_PUG = `doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    style.
      body {
        font-family: system-ui, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #1a1a2e;
        color: white;
      }
      .card {
        background: rgba(255,255,255,0.1);
        padding: 40px;
        border-radius: 16px;
        text-align: center;
      }
      h1 { color: #4ade80; }
  body
    .card
      h1 Hello, #{name}!
      p Welcome to #{app}. Edit this template to see live changes.`;

const DEFAULT_HBS = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #1a1a2e;
      color: white;
    }
    .card {
      background: rgba(255,255,255,0.1);
      padding: 40px;
      border-radius: 16px;
      text-align: center;
    }
    h1 { color: #4ade80; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, {{name}}!</h1>
    <p>Welcome to {{app}}. Edit this template to see live changes.</p>
  </div>
</body>
</html>`;

const DEFAULT_JSX = `function App(props) {
  const [count, setCount] = React.useState(0);
  const { name = "World", app = "SmartPreview" } = props;

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px',
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '12px',
          background: 'linear-gradient(90deg, #4ade80, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Hello, {name}!
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px' }}>
          Welcome to {app}. Click the button to see state updates.
        </p>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{
            background: 'linear-gradient(90deg, #4ade80, #22d3ee)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1a1a2e',
            cursor: 'pointer',
          }}
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}`;

const DEFAULT_VARIABLES: Variable[] = [
  { key: "name", value: "World" },
  { key: "app", value: "SmartPreview" },
];

export function SmartPreviewApp() {
  const [code, setCode] = useState(DEFAULT_HTML);
  const [language, setLanguage] = useState<Language>("html");
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [variables, setVariables] = useState<Variable[]>(DEFAULT_VARIABLES);
  const [compiledHtml, setCompiledHtml] = useState("");
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [editorPanelSize, setEditorPanelSize] = useState(50);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>("light");
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    switch (newLanguage) {
      case "pug":
        setCode(DEFAULT_PUG);
        break;
      case "handlebars":
        setCode(DEFAULT_HBS);
        break;
      case "jsx":
        setCode(DEFAULT_JSX);
        break;
      default:
        setCode(DEFAULT_HTML);
    }
  }, []);

  const handleSelectTemplate = useCallback((template: Template) => {
    setCode(template.code);
    setLanguage(template.language);
    setVariables(template.variables);
  }, []);

  const handleConsoleMessage = useCallback((message: ConsoleMessage) => {
    setConsoleMessages(prev => [...prev, message]);
  }, []);

  const handleConsoleClear = useCallback(() => {
    setConsoleMessages([]);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileCode2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              SmartPreview
            </span>
          </Link>
          <div className="hidden h-6 w-px bg-border sm:block" />
          <LanguageSelector
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <div className="h-6 w-px bg-border" />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Mobile layout (< 640px): single panel + bottom tab bar ── */}
      {isMobile === null ? (
        <div className="flex-1 bg-background" />
      ) : isMobile ? (
        <>
          <div className="relative flex flex-1 flex-col overflow-hidden">
            {/* Mobile Editor */}
            {mobileView === "edit" && (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <div className="h-3 w-3 rounded-full bg-primary/70" />
                    <span className="ml-2 text-xs text-muted-foreground">
                      {language === "html" && "index.html"}
                      {language === "pug" && "template.pug"}
                      {language === "handlebars" && "template.hbs"}
                      {language === "jsx" && "App.jsx"}
                    </span>
                  </div>
                  <ToolbarActions
                    code={code}
                    compiledHtml={compiledHtml}
                    language={language}
                    variables={variables}
                    onOpenTemplates={() => setTemplateGalleryOpen(true)}
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    code={code}
                    language={language}
                    onChange={setCode}
                  />
                </div>
                <VariablesPanel
                  variables={variables}
                  onVariablesChange={setVariables}
                />
              </div>
            )}

            {/* Mobile Preview */}
            {mobileView === "preview" && (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Preview
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PreviewThemeToggle
                      theme={previewTheme}
                      onThemeChange={setPreviewTheme}
                    />
                    <Button
                      variant={showConsole ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8"
                      onClick={() => setShowConsole(!showConsole)}
                    >
                      <Terminal className="mr-1 h-4 w-4" />
                      <span className="text-xs">Console</span>
                      {consoleMessages.length > 0 && (
                        <span className="ml-1 rounded-full bg-primary/20 px-1.5 text-xs">
                          {consoleMessages.length}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex-1 overflow-hidden",
                    showConsole && "h-[60%]",
                  )}
                >
                  <PreviewPanel
                    code={code}
                    language={language}
                    variables={variables}
                    viewport={viewport}
                    previewTheme={previewTheme}
                    onHtmlChange={setCompiledHtml}
                    onConsoleMessage={handleConsoleMessage}
                  />
                </div>
                {showConsole && (
                  <div className="h-[40%] max-h-64">
                    <ConsolePanel
                      messages={consoleMessages}
                      onClear={handleConsoleClear}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile bottom tab bar */}
          <nav className="flex border-t border-border bg-card">
            <button
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs transition-colors",
                mobileView === "edit"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMobileView("edit")}
            >
              <Code2 className="h-5 w-5" />
              <span>Editor</span>
            </button>
            <button
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs transition-colors",
                mobileView === "preview"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMobileView("preview")}
            >
              <Eye className="h-5 w-5" />
              <span>Preview</span>
            </button>
          </nav>
        </>
      ) : (
        /* ── Desktop layout (≥ 640px): split-pane or single-panel ── */
        <main className="relative flex flex-1 overflow-hidden">
          {viewMode === "both" ? (
            <PanelGroup
              direction="horizontal"
              className="flex flex-1 w-full h-full"
            >
              {/* Left Column: Code Editor & Variables Panel */}
              <Panel
                defaultSize={50}
                minSize={20}
                className="h-full flex flex-col"
                onResize={setEditorPanelSize}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-destructive/70" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                      <div className="h-3 w-3 rounded-full bg-primary/70" />
                      <span className="ml-2 text-xs text-muted-foreground">
                        {language === "html" && "index.html"}
                        {language === "pug" && "template.pug"}
                        {language === "handlebars" && "template.hbs"}
                        {language === "jsx" && "App.jsx"}
                      </span>
                    </div>
                    {editorPanelSize >= 35 && (
                      <ToolbarActions
                        code={code}
                        compiledHtml={compiledHtml}
                        language={language}
                        variables={variables}
                        onOpenTemplates={() => setTemplateGalleryOpen(true)}
                      />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor
                      code={code}
                      language={language}
                      onChange={setCode}
                    />
                  </div>
                  <VariablesPanel
                    variables={variables}
                    onVariablesChange={setVariables}
                  />
                </div>
              </Panel>

              {/* Interactive Resizing Divider */}
              <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/60 hover:w-2 active:bg-primary/80 transition-all cursor-col-resize relative z-20 flex items-center justify-center group">
                <div className="h-8 w-1 rounded bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
              </PanelResizeHandle>

              {/* Right Column: Live Output & Console */}
              <Panel
                defaultSize={50}
                minSize={20}
                className="h-full flex flex-col"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        Preview
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground">
                          Live
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ViewportToggle
                        viewport={viewport}
                        onViewportChange={setViewport}
                      />
                      <PreviewThemeToggle
                        theme={previewTheme}
                        onThemeChange={setPreviewTheme}
                      />
                      <Button
                        variant={showConsole ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8"
                        onClick={() => setShowConsole(!showConsole)}
                      >
                        <Terminal className="mr-1 h-4 w-4" />
                        <span className="text-xs">Console</span>
                        {consoleMessages.length > 0 && (
                          <span className="ml-1 rounded-full bg-primary/20 px-1.5 text-xs">
                            {consoleMessages.length}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex-1 overflow-hidden",
                      showConsole && "h-[60%]",
                    )}
                  >
                    <PreviewPanel
                      code={code}
                      language={language}
                      variables={variables}
                      viewport={viewport}
                      previewTheme={previewTheme}
                      onHtmlChange={setCompiledHtml}
                      onConsoleMessage={handleConsoleMessage}
                    />
                  </div>
                  {showConsole && (
                    <div className="h-[40%] max-h-64">
                      <ConsolePanel
                        messages={consoleMessages}
                        onClear={handleConsoleClear}
                      />
                    </div>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          ) : (
            <>
              {/* Editor Panel */}
              <div
                className={cn(
                  "h-full w-full transition-all duration-300 ease-in-out",
                  viewMode === "view" && "w-0 overflow-hidden",
                )}
              >
                {viewMode === "edit" && (
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-destructive/70" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                        <div className="h-3 w-3 rounded-full bg-primary/70" />
                        <span className="ml-2 text-xs text-muted-foreground">
                          {language === "html" && "index.html"}
                          {language === "pug" && "template.pug"}
                          {language === "handlebars" && "template.hbs"}
                          {language === "jsx" && "App.jsx"}
                        </span>
                      </div>
                      <ToolbarActions
                        code={code}
                        compiledHtml={compiledHtml}
                        language={language}
                        variables={variables}
                        onOpenTemplates={() => setTemplateGalleryOpen(true)}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor
                        code={code}
                        language={language}
                        onChange={setCode}
                      />
                    </div>
                    <VariablesPanel
                      variables={variables}
                      onVariablesChange={setVariables}
                    />
                  </div>
                )}
              </div>

              {/* Preview Panel */}
              <div
                className={cn(
                  "flex h-full w-full flex-col transition-all duration-300 ease-in-out",
                  viewMode === "edit" && "w-0 overflow-hidden",
                )}
              >
                {viewMode === "view" && (
                  <>
                    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          Preview
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                          <span className="text-xs text-muted-foreground">
                            Live
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ViewportToggle
                          viewport={viewport}
                          onViewportChange={setViewport}
                        />
                        <PreviewThemeToggle
                          theme={previewTheme}
                          onThemeChange={setPreviewTheme}
                        />
                        <Button
                          variant={showConsole ? "secondary" : "ghost"}
                          size="sm"
                          className="h-8"
                          onClick={() => setShowConsole(!showConsole)}
                        >
                          <Terminal className="mr-1 h-4 w-4" />
                          <span className="text-xs">Console</span>
                          {consoleMessages.length > 0 && (
                            <span className="ml-1 rounded-full bg-primary/20 px-1.5 text-xs">
                              {consoleMessages.length}
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex-1 overflow-hidden",
                        showConsole && "h-[60%]",
                      )}
                    >
                      <PreviewPanel
                        code={code}
                        language={language}
                        variables={variables}
                        viewport={viewport}
                        previewTheme={previewTheme}
                        onHtmlChange={setCompiledHtml}
                        onConsoleMessage={handleConsoleMessage}
                      />
                    </div>
                    {showConsole && (
                      <div className="h-[40%] max-h-64">
                        <ConsolePanel
                          messages={consoleMessages}
                          onClear={handleConsoleClear}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </main>
      )}

      {/* Template Gallery Modal */}
      <TemplateGallery
        open={templateGalleryOpen}
        onOpenChange={setTemplateGalleryOpen}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
