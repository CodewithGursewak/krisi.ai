import { Activity, Leaf, ShieldCheck } from "lucide-react";
import type { DiseaseResult } from "@/lib/krishi-api";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface Props {
  data: DiseaseResult;
  imageUrl?: string;
  lang: Lang;
}

const severityColor: Record<DiseaseResult["severity"], string> = {
  low: "bg-success/15 text-success border-success/30",
  medium: "bg-warning/15 text-accent-foreground border-warning/40",
  high: "bg-destructive/15 text-destructive border-destructive/30",
};

export function DiseaseCard({ data, imageUrl, lang }: Props) {
  const labels = t[lang];
  const conf = Math.round(data.confidence);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft animate-fade-up">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={data.disease}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Leaf className="h-3.5 w-3.5" />
              {labels.crop}: <span className="font-medium text-foreground">{data.crop}</span>
            </div>
            <h3 className="mt-1 text-lg font-display font-bold leading-tight">{data.disease}</h3>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${severityColor[data.severity]}`}
          >
            {labels.severity}: {data.severity}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" /> {labels.confidence}
            </span>
            <span className="font-semibold text-foreground">{conf}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-700"
              style={{ width: `${conf}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-foreground/90">{data.description}</p>

        <div>
          <div className="flex items-center gap-1.5 text-sm font-semibold mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {labels.treatment}
          </div>
          <ul className="space-y-1.5">
            {data.treatment.map((step, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
