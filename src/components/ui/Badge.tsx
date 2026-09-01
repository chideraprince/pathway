import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "brand" | "amber" | "emerald" | "rose" | "ink";

const toneClasses: Record<BadgeTone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200",
  amber: "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-300/70",
  emerald: "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
  rose: "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100",
  ink: "bg-ink-100 text-ink-700 ring-1 ring-inset ring-ink-200",
};

export function Badge({ tone = "ink", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", toneClasses[tone], className)}>
      {children}
    </span>
  );
}
