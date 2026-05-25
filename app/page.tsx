"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  FileCode2,
  ArrowRight,
  Sparkles,
  Cpu,
  Layout,
  Terminal,
  CheckCircle2,
  HelpCircle,
  Code2,
  Plus,
  Copy,
  Check,
} from "lucide-react";

function highlightCode(code: string, lang: "html" | "pug" | "jsx"): string {
  // Escape HTML tags to prevent execution in custom pre tags
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "html") {
    // Double curly brace variables: {{variable}}
    html = html.replace(
      /\{\{[^}]+\}\}/g,
      '<span class="text-pink-400 font-semibold bg-pink-500/20 px-1.5 py-0.5 rounded transition-all">$&</span>',
    );
    // HTML Comments: <!-- comment -->
    html = html.replace(
      /(&lt;!--.*?--&gt;)/g,
      '<span class="text-slate-500 italic">$1</span>',
    );
    // HTML Tag open/close name match (e.g. div, h1, p)
    html = html.replace(
      /&lt;(\/?[a-zA-Z0-9]+)/g,
      '&lt;<span class="text-sky-400 font-medium">$1</span>',
    );
    // HTML Tag closing bracket
    html = html.replace(
      /(&gt;)/g,
      '<span class="text-sky-400 font-medium">$1</span>',
    );
    // HTML class attribute and its value
    html = html.replace(
      /(class=)&quot;([^&]*)&quot;/g,
      '<span class="text-indigo-300">$1</span><span class="text-emerald-400">&quot;$2&quot;</span>',
    );
    return html;
  }

  if (lang === "pug") {
    // Pug Comments: //- comment
    html = html.replace(
      /(\/\/-.*)/g,
      '<span class="text-slate-500 italic">$1</span>',
    );
    // Pug Hash Interpolation: #{variable}
    html = html.replace(
      /#\{[^}]+\}/g,
      '<span class="text-pink-400 font-semibold bg-pink-500/20 px-1.5 py-0.5 rounded transition-all">$&</span>',
    );
    // Pug Class selectors (e.g. .card)
    html = html.replace(
      /(\.card)/g,
      '<span class="text-indigo-300 font-medium">$1</span>',
    );
    // Pug standard HTML tags (e.g. h1, p)
    html = html.replace(
      /\b(h1|p)\b/g,
      '<span class="text-sky-400 font-medium">$1</span>',
    );
    return html;
  }

  if (lang === "jsx") {
    // JSX JS Single-line comments: // comment
    html = html.replace(
      /(\/\/.*)/g,
      '<span class="text-slate-500 italic">$1</span>',
    );
    // JS keywords: function, return
    html = html.replace(
      /\b(function|return)\b/g,
      '<span class="text-purple-400 font-semibold">$1</span>',
    );
    // React JSX Props evaluation: {props.variable}
    html = html.replace(
      /\{props\.[^}]+\}/g,
      '<span class="text-pink-400 font-semibold bg-pink-500/20 px-1.5 py-0.5 rounded transition-all">$&</span>',
    );
    // React className attributes
    html = html.replace(
      /(className=)&quot;([^&]*)&quot;/g,
      '<span class="text-indigo-300">$1</span><span class="text-emerald-400">&quot;$2&quot;</span>',
    );
    // JSX Tag names
    html = html.replace(
      /&lt;(\/?[a-zA-Z0-9]+)/g,
      '&lt;<span class="text-sky-400 font-medium">$1</span>',
    );
    // JSX closing brackets
    html = html.replace(
      /(&gt;)/g,
      '<span class="text-sky-400 font-medium">$1</span>',
    );
    return html;
  }

  return html;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"html" | "pug" | "jsx">("html");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syntaxExamples = {
    html: {
      code: `<!-- Reference name & app variables -->\n<div class="card">\n  <h1>Hello, {{name}}!</h1>\n  <p>Welcome to {{app}}.</p>\n</div>`,
      label: "HTML / Handlebars Syntax",
      badge: "Double Curly Brackets",
    },
    pug: {
      code: `//- Reference name & app variables\n.card\n  h1 Hello, #{name}!\n  p Welcome to #{app}.`,
      label: "Pug Syntax",
      badge: "Hash Interpolation",
    },
    jsx: {
      code: `// Reference variables from props\nfunction App(props) {\n  return (\n    <div className="card">\n      <h1>Hello, {props.name}!</h1>\n      <p>Welcome to {props.app}.</p>\n    </div>\n  );\n}`,
      label: "React JSX Syntax",
      badge: "Props Access",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <FileCode2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              SmartPreview
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a href="#docs" className="hover:text-foreground transition-colors">
              Variables Guide
            </a>
            <a
              href="#examples"
              className="hover:text-foreground transition-colors"
            >
              Quick Reference
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/preview">
              <Button
                size="sm"
                className="rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all font-semibold group gap-1 cursor-pointer"
              >
                Launch Editor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden px-6">
        <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl opacity-50" />
        <div className="mx-auto max-w-5xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Introducing Dynamic Context Injections</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] max-w-4xl">
            Develop, preview, and share templates{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              instantly.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A real-time sandbox supporting HTML, Pug, Handlebars, and React JSX.
            Inject variables reactive-style, test responsive views, and inspect
            outputs side-by-side with zero latency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/preview">
              <Button
                size="lg"
                className="rounded-full h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-base font-semibold cursor-pointer"
              >
                Open Workspace
              </Button>
            </Link>
            <a href="#docs">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-8 text-base font-semibold cursor-pointer bg-card hover:bg-muted/40 border-border"
              >
                Learn Variables
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section
        id="features"
        className="py-20 bg-secondary/10 border-y border-border px-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Engineered for Rapid Template Design
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to compile, review, and fine-tune your mockups
              with modern engineering tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Zero-Latency Compilation
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pug, Handlebars, JSX, and HTML code re-render on every keystroke
                in our isolated sandboxed iframe.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Dynamic Injections
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Declare key-value variables dynamically at the bottom panel and
                watch them instantly resolve inside the compiler context.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layout className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Responsive Testing
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Simulate device resolutions with desktop, tablet, and mobile
                triggers. Verify content flow effortlessly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Sandbox Console
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Capture logs, errors, and warning statements flowing from inside
                your templates in a dedicated live output window.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Variables Section & Mock Window Screenshot */}
      <section id="docs" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left side: Guide & Timeline */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4">
                <HelpCircle className="h-4 w-4" />
                <span>DYNAMIC VARIABLES GUIDE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
                Empower templates with dynamic properties.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Inject custom values dynamically into markup without hardcoding
                content. Define variables, update them on the fly, and see
                immediate rendering.
              </p>

              {/* Steps timeline */}
              <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                {/* Step 1 */}
                <div className="flex gap-4 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-4 ring-background z-10">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">
                      Open the Variables Panel
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Expand the collapsible **Variables** drawer located at the
                      bottom-left corner of the editor view.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-4 ring-background z-10">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">
                      Declare Names & Values
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Click the{" "}
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-muted text-xs font-medium">
                        <Plus className="h-3 w-3" /> Add Variable
                      </span>{" "}
                      row. Fill in the key (e.g. `name`) and the desired value
                      (e.g. `World`).
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 relative">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-4 ring-background z-10">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">
                      Interpolate in the Markup
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Use template-specific tags matching your engine. Double
                      brackets for HTML/HBS, interpolation for Pug, or props
                      fields for JSX.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Mock Macbook Window Frame with Screenshot */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-primary/5 group">
                {/* Mockup Top Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
                  {/* Mock Dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F56] inline-block shadow-sm" />
                    <span className="h-3 w-3 rounded-full bg-[#FFBD2E] inline-block shadow-sm" />
                    <span className="h-3 w-3 rounded-full bg-[#27C93F] inline-block shadow-sm" />
                  </div>
                  {/* Mock URL bar */}
                  <div className="w-1/2 md:w-2/3 bg-background border border-border text-[11px] text-muted-foreground text-center py-1 rounded-md flex items-center justify-center gap-1 select-none">
                    <span className="text-emerald-500 font-bold select-none">
                      🔒
                    </span>{" "}
                    SmartPreview.app/editor
                  </div>
                  <div className="w-8" />
                </div>
                {/* Inner image */}
                <div className="relative p-2 bg-editor-bg flex items-center justify-center">
                  <img
                    src="/variables-screenshot.png"
                    alt="Variable panel configuration showing Name and App properties being modified"
                    className="w-full h-auto rounded-lg shadow-inner group-hover:scale-[1.005] transition-transform duration-500"
                  />
                  <div className="absolute bottom-20 left-16 inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce select-none">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Interactive Context Variables
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center italic">
                Screenshot: Variables panel with "+ Add Variable" button
                highlighted showing real-time bindings.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Syntax Quick Reference Card */}
      <section
        id="examples"
        className="py-24 bg-gradient-to-b from-background via-secondary/5 to-background border-t border-border px-6 relative overflow-hidden"
      >
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
              <Code2 className="h-3.5 w-3.5" />
              <span>SYNTAX COMPARISON</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-foreground">
              Syntax Rules by Engine
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Quick comparison of how to fetch variables in each supported
              templating engine.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card/75 dark:bg-slate-900/60 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-primary/5">
            {/* Tabs Trigger */}
            <div className="flex border-b border-border bg-muted/30">
              <button
                onClick={() => setActiveTab("html")}
                className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "html"
                    ? "border-primary text-foreground bg-background/50"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
                }`}
              >
                HTML / Handlebars
              </button>
              <button
                onClick={() => setActiveTab("pug")}
                className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "pug"
                    ? "border-primary text-foreground bg-background/50"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
                }`}
              >
                Pug Language
              </button>
              <button
                onClick={() => setActiveTab("jsx")}
                className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "jsx"
                    ? "border-primary text-foreground bg-background/50"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
                }`}
              >
                React JSX
              </button>
            </div>

            {/* Tab Panel */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className="font-bold text-xl text-foreground mb-1">
                    {syntaxExamples[activeTab].label}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Seamless reactivity bindings in active scope
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/20 shadow-sm">
                  {syntaxExamples[activeTab].badge}
                </span>
              </div>

              {/* Code IDE Container */}
              <div className="relative rounded-xl border border-border/80 dark:border-white/5 bg-slate-950 shadow-inner overflow-hidden group">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70 inline-block" />
                    <span className="ml-2 font-mono text-[11px] text-slate-500">
                      template.{activeTab}
                    </span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(syntaxExamples[activeTab].code)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition-all text-[11px] font-medium border border-slate-700/50 cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Editor Area with Line Numbers and Highlighting */}
                <pre className="p-5 overflow-x-auto text-sm font-mono leading-relaxed text-slate-300 bg-slate-950/80">
                  <code className="block min-w-full">
                    {syntaxExamples[activeTab].code
                      .split("\n")
                      .map((line, idx) => (
                        <div
                          key={idx}
                          className="flex items-start py-0.5 hover:bg-slate-900/60 px-2 -mx-2 rounded transition-colors duration-150"
                        >
                          <span className="select-none text-slate-600 text-right w-6 pr-3 text-xs font-semibold select-none pt-0.5">
                            {idx + 1}
                          </span>
                          <span
                            className="flex-1 whitespace-pre"
                            dangerouslySetInnerHTML={{
                              __html: highlightCode(line, activeTab),
                            }}
                          />
                        </div>
                      ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileCode2 className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">SmartPreview</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-muted-foreground text-sm text-center">
              &copy; {new Date().getFullYear()} SmartPreview. A highly premium
              and state-of-the-art real-time compiler.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Created by</span>
              <a
                href="https://ajibadde.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
              >
                Olaoluwa Ajibade
              </a>
              <span className="text-border">|</span>
              <a
                href="mailto:Olaoluwaajibadee@gmail.com"
                className="hover:text-foreground transition-colors"
              >
                Olaoluwaajibadee@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a href="#docs" className="hover:text-foreground transition-colors">
              Guide
            </a>
            <a
              href="#examples"
              className="hover:text-foreground transition-colors"
            >
              Syntax
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
