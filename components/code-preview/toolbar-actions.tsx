"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Copy,
  Download,
  Check,
  FileArchive,
  LayoutTemplate,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Language } from "./language-selector";
import type { Variable } from "./variables-panel";

interface ToolbarActionsProps {
  code: string;
  compiledHtml: string;
  language: Language;
  variables: Variable[];
  onOpenTemplates: () => void;
}

export function ToolbarActions({
  code,
  compiledHtml,
  language,
  variables,
  onOpenTemplates,
}: ToolbarActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };



  const handleDownloadHtml = () => {
    const blob = new Blob([compiledHtml], { type: "text/html" });
    saveAs(blob, "preview.html");
  };

  const handleExportZip = async () => {
    const zip = new JSZip();

    // Get file extension based on language
    const extensions: Record<Language, string> = {
      html: "html",
      pug: "pug",
      handlebars: "hbs",
      jsx: "jsx",
    };

    const sourceFileName = `source.${extensions[language]}`;

    // Add source file
    zip.file(sourceFileName, code);

    // Add compiled HTML
    zip.file("compiled.html", compiledHtml);

    // Add variables as JSON
    if (variables.length > 0) {
      const varsObj = variables.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );
      zip.file("variables.json", JSON.stringify(varsObj, null, 2));
    }

    // Add a readme
    const readme = `# SmartPreview Export

## Files
- \`${sourceFileName}\` - Your source template
- \`compiled.html\` - The compiled HTML output
${variables.length > 0 ? "- `variables.json` - Template variables used" : ""}

## Language
${language.toUpperCase()}

## Generated
${new Date().toISOString()}
`;
    zip.file("README.md", readme);

    // Generate and download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `smartpreview-export-${Date.now()}.zip`);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onOpenTemplates}
            >
              <LayoutTemplate className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Templates</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopyCode}
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy Code"}</p>
          </TooltipContent>
        </Tooltip>


        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDownloadHtml}
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download HTML</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleExportZip}
            >
              <FileArchive className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export as ZIP</p>
          </TooltipContent>
        </Tooltip>

      </div>
    </TooltipProvider>
  );
}
