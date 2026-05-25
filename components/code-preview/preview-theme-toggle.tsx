"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PreviewTheme = "light" | "dark";

interface PreviewThemeToggleProps {
  theme: PreviewTheme;
  onThemeChange: (theme: PreviewTheme) => void;
}

export function PreviewThemeToggle({ theme, onThemeChange }: PreviewThemeToggleProps) {
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    onThemeChange(next);
  };

  const Icon = theme === "light" ? Moon : Sun;
  const tooltipLabel = theme === "light" ? "Switch to Dark Background" : "Switch to Light Background";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-7 w-7", "bg-background shadow-sm")}
              onClick={toggleTheme}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipLabel}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
