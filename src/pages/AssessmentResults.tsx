import { Navigate, useNavigate } from "react-router-dom";
import { RotateCcw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { CareerCard } from "@/components/feature/CareerCard";
import { careerById } from "@/data/careers";
import { pathwayByCareerId, pathwayStepById } from "@/data/pathways";
import { skillById } from "@/data/skills";
import { recommendCareers } from "@/lib/personalization";
import { useAppStore } from "@/store/appStore";
import { useToastStore } from "@/store/toastStore";

export default function AssessmentResults() {
  const navigate = useNavigate();
  const { assessmentResult, assessmentAnswers, setActivePathwayByCareer } = useAppStore();
  const push = useToastStore((s) => s.push);

  if (!assessmentResult) return <Navigate to="/assessment" replace />;

  const career = careerById(assessmentResult.targetCareerId);
  if (!career) return <Navigate to="/assessment" replace />;

  const pathway = pathwayByCareerId(career.id);
  const startStep = pathway ? pathwayStepById(pathway, assessmentResult.recommendedStartStepId) : undefined;
  const alternates = recommendCareers(assessmentAnswers, 5).filter((c) => c.id !== career.id).slice(0, 3);

  const onStart = () => {
    setActivePathwayByCareer(career.id);
    push(`${career.title} set as your active pathway`, "success");
    navigate(`/careers/${career.slug}/pathway`);
  };

  return (
    <div className="container-page max-w-4xl py-10 sm:py-12">
      <p className="text-sm font-medium text-brand-600">Your Path to {career.title}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        You're {assessmentResult.matchPercentage}% of the way there.
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          <Card className="p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-600">You already have</p>
            {assessmentResult.haveSkillIds.length === 0 ? (
              <p className="text-sm text-ink-500">Nothing yet from this career's skill list — that's a completely normal place to start.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {assessmentResult.haveSkillIds.map((id) => (
                  <SkillBadge key={id} name={skillById(id)?.name ?? id} state="have" />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">You need to develop</p>
            <div className="flex flex-wrap gap-2">
              {assessmentResult.needSkillIds.map((id) => (
                <SkillBadge key={id} name={skillById(id)?.name ?? id} state="need" />
              ))}
            </div>
          </Card>

          {startStep && (
            <Card className="border-brand-200 bg-brand-50/40 p-6">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
                <Sparkles className="h-3.5 w-3.5" /> Recommended next step
              </p>
              <p className="mt-2 text-lg font-semibold text-ink-900">{startStep.title}</p>
              <p className="mt-1 text-sm text-ink-600">{startStep.description}</p>
            </Card>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onStart}>Start My Pathway</Button>
            <LinkButton size="lg" variant="ghost" to="/assessment">
              <RotateCcw className="h-4 w-4" /> Retake assessment
            </LinkButton>
          </div>
        </div>

        <Card className="flex flex-col items-center gap-3 p-6 text-center">
          <ProgressRing value={assessmentResult.matchPercentage} size={96} strokeWidth={8} />
          <p className="text-sm font-medium text-ink-900">Skill match for {career.title}</p>
          <p className="text-xs text-ink-500">
            {assessmentResult.haveSkillIds.length} of {assessmentResult.haveSkillIds.length + assessmentResult.needSkillIds.length} required skills
          </p>
        </Card>
      </div>

      {alternates.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-ink-900">Other careers worth a look</h2>
          <p className="mt-1 text-sm text-ink-500">Based on the same answers, these are also strong fits.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {alternates.map((c) => (
              <CareerCard key={c.id} career={c} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
