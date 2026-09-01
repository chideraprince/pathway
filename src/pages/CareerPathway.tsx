import { useParams, Navigate } from "react-router-dom";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { PathwayStageAccordion } from "@/components/feature/PathwayStageAccordion";
import { careerBySlug } from "@/data/careers";
import { pathwayByCareerId, pathwayTotalSteps } from "@/data/pathways";
import { pathwayProgressPercentage } from "@/lib/personalization";
import { useAppStore } from "@/store/appStore";
import { useToastStore } from "@/store/toastStore";

export default function CareerPathway() {
  const { slug } = useParams();
  const career = slug ? careerBySlug(slug) : undefined;
  const { getProgress, toggleStepComplete, toggleResourceComplete, activePathwayId, setActivePathwayByCareer, assessmentResult } = useAppStore();
  const push = useToastStore((s) => s.push);

  if (!career) return <Navigate to="/careers" replace />;
  const pathway = pathwayByCareerId(career.id);
  if (!pathway) return <Navigate to={`/careers/${career.slug}`} replace />;

  const progress = getProgress(pathway.id);
  const pct = pathwayProgressPercentage(pathway, progress);
  const totalSteps = pathwayTotalSteps(pathway);
  const isActive = activePathwayId === pathway.id;
  const highlightStepId = assessmentResult?.targetCareerId === career.id ? assessmentResult.recommendedStartStepId : undefined;

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Explore Careers", to: "/careers" }, { label: career.title, to: `/careers/${career.slug}` }, { label: "Pathway" }]} />

      <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{pathway.title}</h1>
          <p className="mt-2 text-ink-600">
            {pathway.stages.length} stages · {totalSteps} steps · roughly {pathway.estimatedDurationMonths} months at a steady pace.
          </p>
          {highlightStepId && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
              <Sparkles className="h-4 w-4" /> Based on your assessment, we've highlighted your recommended next step below.
            </p>
          )}
        </div>
        <Card className="flex shrink-0 items-center gap-4 p-4">
          <ProgressRing value={pct} />
          <div>
            <p className="text-sm font-semibold text-ink-900">{pct}% complete</p>
            <p className="text-xs text-ink-500">
              {progress.completedStepIds.length} of {totalSteps} steps
            </p>
            {isActive ? (
              <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Your active pathway
              </span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setActivePathwayByCareer(career.id);
                  push(`${career.title} set as your active pathway`, "success");
                }}
              >
                Set as My Pathway
              </Button>
            )}
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
