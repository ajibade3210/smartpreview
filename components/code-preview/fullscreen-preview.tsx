"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Trash2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsoleMessage {
  id: number;
  type: "log" | "warn" | "error" | "info";
  content: string;
  timestamp: Date;
}

interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

export function ConsolePanel({ messages, onClear }: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col border-t border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Console</span>
          {messages.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {messages.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClear}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-2 font-mono text-xs">
          {messages.length === 0 ? (
            <p className="text-muted-foreground">No console output</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2 rounded px-2 py-1",
                  msg.type === "error" && "bg-destructive/10 text-destructive",
                  msg.type === "warn" && "bg-yellow-500/10 text-yellow-500",
                  msg.type === "info" && "text-blue-400",
                  msg.type === "log" && "text-foreground"
                )}
              >
                <span className="shrink-0 text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                <span className="break-all">{msg.content}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface FullscreenPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
  consoleMessages: ConsoleMessage[];
  onConsoleClear: () => void;
}

export function FullscreenPreview({
  open,
  onOpenChange,
  html,
  consoleMessages,
  onConsoleClear,
}: FullscreenPreviewProps) {
  const [showConsole, setShowConsole] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-[95vw] flex-col p-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3">
          <DialogTitle>Full-Screen Preview</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={showConsole ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowConsole(!showConsole)}
            >
              <Terminal className="mr-2 h-4 w-4" />
              Console
              {consoleMessages.length > 0 && (
                <span className="ml-2 rounded-full bg-primary/20 px-1.5 text-xs">
                  {consoleMessages.length}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          <div className={cn("flex-1", showConsole && "border-r border-border")}>
            <iframe
              srcDoc={html}
              title="Fullscreen Preview"
              className="h-full w-full border-0 bg-white"
              sandbox="allow-scripts"
            />
          </div>
          {showConsole && (
            <div className="w-80">
              <ConsolePanel
                messages={consoleMessages}
                onClear={onConsoleClear}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { ConsoleMessage };
