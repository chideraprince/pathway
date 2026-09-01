import { cn } from "@/lib/cn";
import { Check, Circle } from "lucide-react";

export function SkillBadge({
  name,
  state,
  className,
}: {
  name: string;
  state?: "have" | "need" | "neutral";
  className?: string;
}) {
  if (state === "have") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100", className)}>
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        {name}
      </span>
    );
  }
  if (state === "need") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 text-sm font-medium text-ink-600 ring-1 ring-inset ring-ink-200", className)}>
        <Circle className="h-3 w-3" strokeWidth={2.5} />
        {name}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center rounded-full bg-ink-100 px-3 py-1.5 text-sm font-medium text-ink-700", className)}>
      {name}
    </span>
  );
}
