import { useState } from "react";
import { ChevronDown, CheckCircle2, Circle, Clock, Lock, Sparkles } from "lucide-react";
import type { Pathway, UserProgress } from "@/types";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { skillById } from "@/data/skills";
import { resourcesByIds } from "@/data/resources";
import { stageProgressPercentage } from "@/lib/personalization";
import { ResourceCard } from "./ResourceCard";
import { cn } from "@/lib/cn";

const actionTone: Record<string, "brand" | "amber" | "emerald" | "ink"> = {
  Learn: "brand",
  Practice: "amber",
  Build: "emerald",
  Complete: "ink",
};

export function PathwayStageAccordion({
  pathway,
  progress,
  onToggleStep,
  onToggleResource,
  highlightStepId,
}: {
  pathway: Pathway;
  progress: UserProgress;
  onToggleStep: (stepId: string) => void;
  onToggleResource: (resourceId: string) => void;
  highlightStepId?: string;
}) {
  const sortedStages = [...pathway.stages].sort((a, b) => a.order - b.order);
  const [openStageId, setOpenStageId] = useState<string | null>(
    sortedStages.find((s) => s.steps.some((st) => st.id === highlightStepId))?.id ?? sortedStages[0]?.id ?? null
  );

  return (
    <div className="space-y-4">
      {sortedStages.map((stage, index) => {
        const stepIds = stage.steps.map((s) => s.id);
        const pct = stageProgressPercentage(stepIds, progress);
        const prevStage = sortedStages[index - 1];
        const prevPct = prevStage ? stageProgressPercentage(prevStage.steps.map((s) => s.id), progress) : 100;
        const isOpen = openStageId === stage.id;

        return (
          <Card key={stage.id} className="overflow-hidden p-0">
            <button
              onClick={() => setOpenStageId(isOpen ? null : stage.id)}
              className="focus-ring flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  pct === 100 ? "bg-emerald-100 text-emerald-700" : "bg-brand-50 text-brand-700"
                )}
              >
                {pct === 100 ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink-900">{stage.title}</h3>
                  {index > 0 && prevPct < 100 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-400">
                      <Lock className="h-3 w-3" /> unlocks after {prevStage.title}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-500">{stage.description}</p>
              </div>
              <div className="hidden w-32 shrink-0 sm:block">
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span>{pct}%</span>
                  <span>{stepIds.filter((id) => progress.completedStepIds.includes(id)).length}/{stepIds.length}</span>
                </div>
                <ProgressBar value={pct} size="sm" className="mt-1" />
              </div>
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-ink-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
              <div className="space-y-3 border-t border-ink-100 px-5 py-4">
                {stage.steps
                  .sort((a, b) => a.order - b.order)
                  .map((step) => {
                    const done = progress.completedStepIds.includes(step.id);
                    const resources = resourcesByIds(step.resourceIds);
                    const isHighlighted = step.id === highlightStepId;
                    return (
                      <div
                        key={step.id}
                        className={cn(
                          "rounded-xl border p-4",
                          isHighlighted ? "border-brand-300 bg-brand-50/40" : "border-ink-100 bg-ink-50/40"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => onToggleStep(step.id)}
                            className="focus-ring mt-0.5 shrink-0 text-ink-300 hover:text-brand-600"
                            aria-label="Mark step complete"
                          >
                            {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge tone={actionTone[step.action]}>{step.action}</Badge>
                              {isHighlighted && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                                  <Sparkles className="h-3 w-3" /> Recommended next step
                                </span>
                              )}
                              <span className="ml-auto inline-flex items-center gap-1 text-xs text-ink-400">
                                <Clock className="h-3 w-3" /> {step.durationWeeks} wk{step.durationWeeks !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <p className={cn("mt-1.5 font-medium text-ink-900", done && "text-ink-400 line-through")}>{step.title}</p>
                            <p className="mt-0.5 text-sm text-ink-500">{step.description}</p>
                            {step.skillIds.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {step.skillIds.map((id) => (
                                  <span key={id} className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
                                    {skillById(id)?.name ?? id}
                                  </span>
                                ))}
                              </div>
                            )}
                            {resources.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {resources.map((r) => (
                                  <ResourceCard
                                    key={r.id}
                                    resource={r}
                                    completed={progress.completedResourceIds.includes(r.id)}
                                    onToggleComplete={() => onToggleResource(r.id)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
