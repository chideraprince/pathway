import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { careers, careerBySlug, careerCategories } from "@/data/careers";
import { skills } from "@/data/skills";
import { useAppStore } from "@/store/appStore";
import { recommendCareers } from "@/lib/personalization";
import { demandLabel, demandTone } from "@/lib/format";
import type { EducationInfo, CareerCategory } from "@/types";
import { cn } from "@/lib/cn";

const educationOptions: { value: EducationInfo["level"]; label: string }[] = [
  { value: "high-school", label: "High school" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "self-taught", label: "Self-taught" },
];

const statusOptions = ["Student", "Recent graduate", "Working professional", "Career switcher"];
const experienceOptions = [
  { value: 0, label: "No experience yet" },
  { value: 1, label: "1-2 years" },
  { value: 3, label: "3-5 years" },
  { value: 6, label: "5+ years" },
];
const timeOptions = [
  { value: 3, label: "~3 hrs/week" },
  { value: 7, label: "~7 hrs/week" },
  { value: 12, label: "~12 hrs/week" },
  { value: 20, label: "20+ hrs/week" },
];

const commonSkillIds = [
  "communication", "problem-solving", "critical-thinking", "collaboration", "time-management",
  "figma", "adobe-cc", "design-principles", "user-research",
  "html-css", "javascript", "git", "sql", "python", "excel-bi",
  "statistics", "data-visualization", "market-research", "business-analysis", "agile-scrum",
  "content-strategy", "copywriting", "seo", "social-media",
];

const TOTAL_STEPS = 8;

export default function Assessment() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { assessmentAnswers, setAssessmentAnswer, submitAssessment } = useAppStore();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const careerParam = params.get("career");
    if (careerParam) {
      const preset = careerBySlug(careerParam);
      if (preset) setAssessmentAnswer("targetCareerId", preset.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recommended = useMemo(() => recommendCareers(assessmentAnswers, 6), [assessmentAnswers]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return Boolean(assessmentAnswers.fieldOfStudy?.trim());
      case 1: return Boolean(assessmentAnswers.educationLevel);
      case 2: return Boolean(assessmentAnswers.currentStatus);
      case 3: return true; // skills optional
      case 4: return assessmentAnswers.yearsExperience !== undefined;
      case 5: return Boolean(assessmentAnswers.interestCategory);
      case 6: return Boolean(assessmentAnswers.targetCareerId);
      case 7: return assessmentAnswers.weeklyTimeCommitment !== undefined;
      default: return false;
    }
  }, [step, assessmentAnswers]);

  const onNext = () => {
    if (step === TOTAL_STEPS - 1) {
      const result = submitAssessment(assessmentAnswers.targetCareerId!);
      navigate("/assessment/results", { state: { resultAt: result.completedAt } });
      return;
    }
    setStep((s) => s + 1);
  };

  const existingSkillIds = assessmentAnswers.existingSkillIds ?? [];
  const toggleSkill = (id: string) => {
    setAssessmentAnswer("existingSkillIds", existingSkillIds.includes(id) ? existingSkillIds.filter((s) => s !== id) : [...existingSkillIds, id]);
  };

  return (
    <div className="container-page max-w-3xl py-10 sm:py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-ink-500">
          <span>Question {step + 1} of {TOTAL_STEPS}</span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <ProgressBar value={((step + 1) / TOTAL_STEPS) * 100} className="mt-2" />
      </div>

      <Card className="p-6 sm:p-8">
        {step === 0 && (
          <Question title="What's your field of study?" description="Doesn't need to be exact — pick the closest fit.">
            <Input
              autoFocus
              placeholder="e.g. Computer Science, Business, Graphic Design, Psychology…"
              value={assessmentAnswers.fieldOfStudy ?? ""}
              onChange={(e) => setAssessmentAnswer("fieldOfStudy", e.target.value)}
            />
          </Question>
        )}

        {step === 1 && (
          <Question title="What's your education level?">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {educationOptions.map((o) => (
                <OptionTile key={o.value} active={assessmentAnswers.educationLevel === o.value} onClick={() => setAssessmentAnswer("educationLevel", o.value)}>
                  {o.label}
                </OptionTile>
              ))}
            </div>
          </Question>
        )}

        {step === 2 && (
          <Question title="Which best describes you right now?">
            <div className="grid grid-cols-2 gap-2.5">
              {statusOptions.map((o) => (
                <OptionTile key={o} active={assessmentAnswers.currentStatus === o} onClick={() => setAssessmentAnswer("currentStatus", o)}>
                  {o}
                </OptionTile>
              ))}
            </div>
          </Question>
        )}

        {step === 3 && (
          <Question title="Which of these skills do you already have?" description="Select any that apply — it's fine if this is short.">
            <div className="flex flex-wrap gap-2">
              {commonSkillIds.map((id) => {
                const skill = skills.find((s) => s.id === id);
                if (!skill) return null;
                return (
                  <Chip key={id} active={existingSkillIds.includes(id)} onClick={() => toggleSkill(id)}>
                    {existingSkillIds.includes(id) && <Check className="h-3 w-3" />}
                    {skill.name}
                  </Chip>
                );
              })}
            </div>
          </Question>
        )}

        {step === 4 && (
          <Question title="How many years of professional experience do you have?">
            <div className="grid grid-cols-2 gap-2.5">
              {experienceOptions.map((o) => (
                <OptionTile key={o.value} active={assessmentAnswers.yearsExperience === o.value} onClick={() => setAssessmentAnswer("yearsExperience", o.value)}>
                  {o.label}
                </OptionTile>
              ))}
            </div>
          </Question>
        )}

        {step === 5 && (
          <Question title="Which area interests you most?">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {careerCategories.map((c) => (
                <OptionTile key={c} active={assessmentAnswers.interestCategory === c} onClick={() => setAssessmentAnswer("interestCategory", c as CareerCategory)}>
                  {c}
                </OptionTile>
              ))}
            </div>
          </Question>
        )}

        {step === 6 && (
          <Question title="Based on your answers, here are careers worth considering" description="Pick the one you'd like to build a pathway for.">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {recommended.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setAssessmentAnswer("targetCareerId", c.id)}
                  className={cn(
                    "focus-ring rounded-xl border p-4 text-left transition-colors",
                    assessmentAnswers.targetCareerId === c.id ? "border-brand-600 bg-brand-50/60 ring-1 ring-brand-600" : "border-ink-200 hover:border-ink-300"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink-900">{c.title}</p>
                    <Badge tone={demandTone[c.demand]}>{demandLabel[c.demand]}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">{c.category}</p>
                </button>
              ))}
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-brand-600">Browse all careers instead</summary>
              <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
                {careers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setAssessmentAnswer("targetCareerId", c.id)}
                    className={cn(
                      "focus-ring rounded-lg border px-3 py-2 text-left text-sm",
                      assessmentAnswers.targetCareerId === c.id ? "border-brand-600 bg-brand-50/60" : "border-ink-200 hover:border-ink-300"
                    )}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </details>
          </Question>
        )}

        {step === 7 && (
          <Question title="How much time can you commit each week?">
            <div className="grid grid-cols-2 gap-2.5">
              {timeOptions.map((o) => (
                <OptionTile key={o.value} active={assessmentAnswers.weeklyTimeCommitment === o.value} onClick={() => setAssessmentAnswer("weeklyTimeCommitment", o.value)}>
                  {o.label}
                </OptionTile>
              ))}
            </div>
          </Question>
        )}
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          {step === TOTAL_STEPS - 1 ? "See my results" : "Next"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Question({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-ink-900">{title}</h2>
      {description && <p className="mt-1.5 text-sm text-ink-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function OptionTile({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "focus-ring flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
        active ? "border-brand-600 bg-brand-50/60 text-brand-700 ring-1 ring-brand-600" : "border-ink-200 text-ink-700 hover:border-ink-300"
      )}
    >
      {children}
      {active && <Check className="h-4 w-4 text-brand-600" />}
    </button>
  );
}
