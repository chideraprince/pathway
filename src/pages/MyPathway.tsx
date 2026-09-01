import { Navigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { PathwayStageAccordion } from "@/components/feature/PathwayStageAccordion";
import { careerById } from "@/data/careers";
import { pathwayById, pathwayTotalSteps } from "@/data/pathways";
import { pathwayProgressPercentage } from "@/lib/personalization";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

export default function MyPathway() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { activePathwayId, getProgress, toggleStepComplete, toggleResourceComplete, assessmentResult } = useAppStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const pathway = activePathwayId ? pathwayById(activePathwayId) : undefined;
  const career = pathway ? careerById(pathway.careerId) : undefined;

  if (!pathway || !career) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={Sparkles}
          title="You haven't started a pathway yet"
          description="Take the skill assessment or explore careers to build your personalized pathway."
          action={
            <div className="flex gap-3">
              <LinkButton to="/assessment">Take the assessment</LinkButton>
              <LinkButton to="/careers" variant="outline">Explore careers</LinkButton>
            </div>
          }
        />
      </div>
    );
  }

  const progress = getProgress(pathway.id);
  const pct = pathwayProgressPercentage(pathway, progress);
  const totalSteps = pathwayTotalSteps(pathway);
  const highlightStepId = assessmentResult?.targetCareerId === career.id ? assessmentResult.recommendedStartStepId : undefined;

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">My Pathway</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink-900">{career.title}</h1>
          <p className="mt-2 text-ink-600">{pathway.stages.length} stages · {totalSteps} steps · roughly {pathway.estimatedDurationMonths} months at a steady pace.</p>
        </div>
        <Card className="flex shrink-0 items-center gap-4 p-4">
          <ProgressRing value={pct} />
          <div>
            <p className="text-sm font-semibold text-ink-900">{pct}% complete</p>
            <p className="text-xs text-ink-500">{progress.completedStepIds.length} of {totalSteps} steps</p>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <PathwayStageAccordion
          pathway={pathway}
          progress={progress}
          onToggleStep={(id) => toggleStepComplete(pathway.id, id)}
          onToggleResource={(id) => toggleResourceComplete(pathway.id, id)}
          highlightStepId={highlightStepId}
        />
      </div>
    </div>
  );
}
