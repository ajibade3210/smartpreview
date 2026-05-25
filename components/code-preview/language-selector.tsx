"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Language = "html" | "pug" | "handlebars" | "jsx";

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({
  language,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <Select value={language} onValueChange={(v) => onLanguageChange(v as Language)}>
      <SelectTrigger className="w-[140px] bg-secondary border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="html">HTML</SelectItem>
        <SelectItem value="jsx">JSX / React</SelectItem>
        <SelectItem value="pug">Pug</SelectItem>
        <SelectItem value="handlebars">Handlebars</SelectItem>
      </SelectContent>
    </Select>
  );
}
