import { Link } from "react-router-dom";
import { Bookmark, TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import type { Career } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { demandLabel, demandTone, formatSalary } from "@/lib/format";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { skillById } from "@/data/skills";
import { cn } from "@/lib/cn";

export function CareerCard({ career, compact }: { career: Career; compact?: boolean }) {
  const { isSaved, toggleSavedCareer } = useAppStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const push = useToastStore((s) => s.push);
  const saved = isSaved(career.id);

  const onSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedCareer(career.id);
    push(
      saved ? `Removed ${career.title} from saved careers` : `Saved ${career.title}${!isAuthenticated ? " — log in to keep it across devices" : ""}`,
      "success"
    );
  };

  return (
    <Card hoverable className={cn("group relative flex flex-col p-5", compact && "p-4")}>
      <Link to={`/careers/${career.slug}`} className="focus-ring absolute inset-0 rounded-2xl" aria-label={career.title} />
      <div className="flex items-start justify-between gap-2">
        <Badge tone="ink">{career.category}</Badge>
        <button
          onClick={onSave}
          className="focus-ring relative z-10 -m-1.5 rounded-lg p-2.5 text-ink-400 transition-transform duration-150 hover:bg-ink-100 hover:text-ink-700 active:scale-90"
          aria-label={saved ? "Unsave career" : "Save career"}
        >
          <Bookmark className={cn("h-4 w-4 transition-transform duration-150", saved && "fill-brand-600 text-brand-600 scale-110")} />
        </button>
      </div>

      <h3 className="mt-3 text-base font-semibold text-ink-900 group-hover:text-brand-700">{career.title}</h3>
      {!compact && <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{career.shortDescription}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone={demandTone[career.demand]}>{demandLabel[career.demand]}</Badge>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-500">
          <TrendingUp className="h-3.5 w-3.5" /> {formatSalary(career.salaryRange)}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-500">
          <Clock className="h-3.5 w-3.5" /> {career.timeToSkill}
        </span>
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {career.skills.slice(0, 3).map((s) => (
            <span key={s.skillId} className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">
              {skillLabel(s.skillId)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-1.5">
        View career <ArrowUpRight className="h-3.5 w-3.5 transition-all" />
      </div>
    </Card>
  );
}

function skillLabel(id: string) {
  return skillById(id)?.name ?? id;
}
