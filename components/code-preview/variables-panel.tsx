"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronDown, ChevronUp, Braces, FileCode2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Variable {
  key: string;
  value: string;
}

interface VariablesPanelProps {
  variables: Variable[];
  onVariablesChange: (variables: Variable[]) => void;
}

export function VariablesPanel({
  variables,
  onVariablesChange,
}: VariablesPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const addVariable = () => {
    onVariablesChange([...variables, { key: "", value: "" }]);
  };

  const updateVariable = (index: number, field: "key" | "value", value: string) => {
    const newVariables = [...variables];
    newVariables[index] = { ...newVariables[index], [field]: value };
    onVariablesChange(newVariables);
  };

  const removeVariable = (index: number) => {
    onVariablesChange(variables.filter((_, i) => i !== index));
  };

  return (
    <div className="border-b border-border bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/50"
      >
        <div className="flex items-center gap-2">
          <Braces className="h-4 w-4" />
          <span>Variables</span>
          {variables.length > 0 && (
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
              {variables.filter((v) => v.key).length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      <div
        className={cn(
          "overflow-visible transition-all duration-200",
          isExpanded ? "max-h-screen" : "max-h-0"
        )}
      >
        <div className="space-y-2 p-3">
          {variables.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground">
              No variables defined. Add one to use in your template.
            </p>
          ) : (
            <div className="max-h-screen space-y-2 overflow-y-auto">
              {variables.map((variable, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="key"
                    value={variable.key}
                    onChange={(e) => updateVariable(index, "key", e.target.value)}
                    className="h-8 flex-1 bg-input text-xs font-mono"
                  />
                  <span className="text-muted-foreground">=</span>
                  <Input
                    placeholder="value"
                    value={variable.value}
                    onChange={(e) => updateVariable(index, "value", e.target.value)}
                    className="h-8 flex-1 bg-input text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeVariable(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs mt-2"
            onClick={addVariable}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Variable
          </Button>
          

          
          {variables.length > 0 && (
            <div className="rounded-md bg-secondary/30 p-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Usage:</span>{" "}
                <code className="rounded bg-secondary px-1">{"{{key}}"}</code> in HTML/HBS,{" "}
                <code className="rounded bg-secondary px-1">{"#{key}"}</code> in Pug,{" "}
                <code className="rounded bg-secondary px-1">{"props.key"}</code> in JSX
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
