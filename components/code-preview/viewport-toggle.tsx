"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewportSize = "desktop" | "tablet" | "mobile";

interface ViewportToggleProps {
  viewport: ViewportSize;
  onViewportChange: (viewport: ViewportSize) => void;
}

const viewports: { value: ViewportSize; icon: React.ElementType; label: string; width: number }[] = [
  { value: "desktop", icon: Monitor, label: "Desktop (100%)", width: 0 },
  { value: "tablet", icon: Tablet, label: "Tablet (768px)", width: 768 },
  { value: "mobile", icon: Smartphone, label: "Mobile (375px)", width: 375 },
];

export function ViewportToggle({ viewport, onViewportChange }: ViewportToggleProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
        {viewports.map(({ value, icon: Icon, label }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  viewport === value && "bg-background shadow-sm"
                )}
                onClick={() => onViewportChange(value)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

export function getViewportWidth(viewport: ViewportSize): number {
  const found = viewports.find((v) => v.value === viewport);
  return found?.width || 0;
}
