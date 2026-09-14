import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
  onChange: (l: Lang) => void;
}

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "हिं" },
  { value: "pa", label: "ਪੰਜ" },
];

export function LanguageToggle({ lang, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
      <Languages className="ml-2 h-4 w-4 text-muted-foreground" aria-hidden />
      {OPTIONS.map((o) => (
        <Button
          key={o.value}
          type="button"
          size="sm"
          variant={lang === o.value ? "default" : "ghost"}
          onClick={() => onChange(o.value)}
          className="h-8 rounded-full px-3 text-xs font-semibold"
          aria-pressed={lang === o.value}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}
