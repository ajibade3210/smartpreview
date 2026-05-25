"use client";

import { Code2, Columns2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "edit" | "both" | "view";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  const modes: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    { value: "edit", label: "Edit", icon: <Code2 className="h-4 w-4" /> },
    { value: "both", label: "Split", icon: <Columns2 className="h-4 w-4" /> },
    { value: "view", label: "View", icon: <Eye className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onViewModeChange(mode.value)}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            viewMode === mode.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {mode.icon}
          <span className="hidden sm:inline">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
