import { CheckCircle2, Circle, ExternalLink, Award } from "lucide-react";
import type { Resource } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

const typeLabel: Record<Resource["type"], string> = {
  course: "Course",
  certification: "Certification",
  bootcamp: "Bootcamp",
  book: "Book",
  project: "Project",
  guide: "Guide",
};

const costLabel: Record<Resource["cost"], string> = {
  free: "Free",
  paid: "Paid",
  freemium: "Freemium",
};

export function ResourceCard({
  resource,
  completed,
  onToggleComplete,
}: {
  resource: Resource;
  completed?: boolean;
  onToggleComplete?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white p-3.5">
      {onToggleComplete && (
        <button onClick={onToggleComplete} className="focus-ring mt-0.5 shrink-0 text-ink-300 hover:text-brand-600" aria-label="Mark resource complete">
          {completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}
        </button>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="ink">{typeLabel[resource.type]}</Badge>
          <Badge tone={resource.cost === "free" ? "emerald" : "amber"}>{costLabel[resource.cost]}{resource.priceNote ? ` · ${resource.priceNote}` : ""}</Badge>
          {resource.certification && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600">
              <Award className="h-3.5 w-3.5" /> Certificate
            </span>
          )}
        </div>
        <p className={cn("mt-1.5 text-sm font-semibold text-ink-900", completed && "text-ink-400 line-through")}>{resource.title}</p>
        <p className="text-xs text-ink-500">{resource.provider} · {resource.level} · {resource.duration}</p>
        <p className="mt-1.5 text-xs text-ink-500">{resource.whyRecommended}</p>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View Resource <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
