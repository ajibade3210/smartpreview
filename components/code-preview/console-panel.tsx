"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConsoleMessage {
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
