// Rule-based personalization engine.
// Deterministic by design so results are explainable and reproducible in the
// prototype — the interfaces here are shaped so a real recommendation model
// could be swapped in without changing callers.
import type { AssessmentAnswers, Career, Opportunity, Pathway, UserProgress } from "@/types";
import { careers } from "@/data/careers";
import { opportunities } from "@/data/opportunities";

export interface SkillGap {
  matchPercentage: number;
  haveSkillIds: string[];
  needSkillIds: string[];
}

export function computeSkillGap(career: Career, existingSkillIds: string[]): SkillGap {
  const requiredIds = career.skills.map((s) => s.skillId);
  const have = requiredIds.filter((id) => existingSkillIds.includes(id));
  const need = requiredIds.filter((id) => !existingSkillIds.includes(id));
  const matchPercentage = requiredIds.length === 0 ? 0 : Math.round((have.length / requiredIds.length) * 100);
  return { matchPercentage, haveSkillIds: have, needSkillIds: need };
}

export function recommendedStartStepId(pathway: Pathway, needSkillIds: string[]): string {
  const orderedSteps = pathway.stages
    .sort((a, b) => a.order - b.order)
    .flatMap((stage) => stage.steps.sort((a, b) => a.order - b.order));
  const match = orderedSteps.find((step) => step.skillIds.some((id) => needSkillIds.includes(id)));
  return (match ?? orderedSteps[0])?.id ?? "";
}

/** Score & rank careers against an in-progress or completed assessment. */
export function recommendCareers(answers: Partial<AssessmentAnswers>, limit = 4): Career[] {
  const existingSkillIds = answers.existingSkillIds ?? [];
  const scored = careers.map((career) => {
    const { matchPercentage } = computeSkillGap(career, existingSkillIds);
    const categoryBonus = answers.interestCategory && career.category === answers.interestCategory ? 25 : 0;
    const demandBonus = career.demand === "high-demand" ? 6 : career.demand === "growing" ? 3 : 0;
    return { career, score: matchPercentage + categoryBonus + demandBonus };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.career);
}

export function recommendCareersFromSkills(skillIds: string[], limit = 4): Career[] {
  const scored = careers.map((career) => ({
    career,
    score: computeSkillGap(career, skillIds).matchPercentage,
  }));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.career);
}

export function nextIncompleteStep(pathway: Pathway, progress: UserProgress | undefined) {
  const orderedSteps = pathway.stages
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap((stage) => stage.steps.slice().sort((a, b) => a.order - b.order));
  return orderedSteps.find((step) => !progress?.completedStepIds.includes(step.id));
}

export function pathwayProgressPercentage(pathway: Pathway, progress: UserProgress | undefined): number {
  const totalSteps = pathway.stages.reduce((sum, s) => sum + s.steps.length, 0);
  if (totalSteps === 0) return 0;
  const completed = progress?.completedStepIds.length ?? 0;
  return Math.round((completed / totalSteps) * 100);
}

export function stageProgressPercentage(stepIds: string[], progress: UserProgress | undefined): number {
  if (stepIds.length === 0) return 0;
  const completed = stepIds.filter((id) => progress?.completedStepIds.includes(id)).length;
  return Math.round((completed / stepIds.length) * 100);
}

export function recommendedOpportunities(targetCareerId: string | null, skillIds: string[], limit = 6): Opportunity[] {
  const published = opportunities.filter((o) => o.status === "published");
  const scored = published.map((o) => {
    let score = 0;
    if (targetCareerId && o.careerTags.includes(targetCareerId)) score += 10;
    score += o.skillTags.filter((id) => skillIds.includes(id)).length * 2;
    return { o, score };
  });
  return scored
    .sort((a, b) => b.score - a.score || new Date(a.o.deadline).getTime() - new Date(b.o.deadline).getTime())
    .slice(0, limit)
    .map((s) => s.o);
}
