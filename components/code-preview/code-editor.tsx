"use client";

import { useRef, useCallback } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  code: string;
  language: "html" | "pug" | "handlebars" | "jsx";
  onChange: (value: string) => void;
}

export function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { theme } = useTheme();

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;

      // Define custom dark theme
      monaco.editor.defineTheme("preview-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955" },
          { token: "keyword", foreground: "569CD6" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "tag", foreground: "569CD6" },
          { token: "attribute.name", foreground: "9CDCFE" },
          { token: "attribute.value", foreground: "CE9178" },
        ],
        colors: {
          "editor.background": "#141414",
          "editor.foreground": "#D4D4D4",
          "editor.lineHighlightBackground": "#1f1f1f",
          "editor.selectionBackground": "#264F78",
          "editorLineNumber.foreground": "#5A5A5A",
          "editorLineNumber.activeForeground": "#CCCCCC",
          "editorCursor.foreground": "#4ade80",
          "editor.selectionHighlightBackground": "#264F7855",
        },
      });

      // Define custom light theme
      monaco.editor.defineTheme("preview-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "008000" },
          { token: "keyword", foreground: "0000FF" },
          { token: "string", foreground: "A31515" },
          { token: "number", foreground: "098658" },
          { token: "tag", foreground: "800000" },
          { token: "attribute.name", foreground: "0451A5" },
          { token: "attribute.value", foreground: "0000FF" },
        ],
        colors: {
          "editor.background": "#f8fafc",
          "editor.foreground": "#1e293b",
          "editor.lineHighlightBackground": "#f1f5f9",
          "editor.selectionBackground": "#cbd5e1",
          "editorLineNumber.foreground": "#94a3b8",
          "editorLineNumber.activeForeground": "#475569",
          "editorCursor.foreground": "#16a34a",
          "editor.selectionHighlightBackground": "#cbd5e155",
        },
      });

      monaco.editor.setTheme(theme === "light" ? "preview-light" : "preview-dark");
    },
    [theme]
  );

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case "pug":
        return "pug";
      case "handlebars":
        return "handlebars";
      case "jsx":
        return "javascript";
      default:
        return "html";
    }
  };

  return (
    <div className="h-full w-full bg-editor-bg">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        theme={theme === "light" ? "preview-light" : "preview-dark"}
        options={{
          fontSize: 14,
          fontFamily: "Geist Mono, monospace",
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "line",
          folding: true,
          bracketPairColorization: { enabled: true },
        }}
        loading={
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
