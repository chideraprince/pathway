import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssessmentAnswers, AssessmentResult, UserProgress } from "@/types";
import { careerById } from "@/data/careers";
import { pathwayByCareerId } from "@/data/pathways";
import { computeSkillGap, recommendedStartStepId } from "@/lib/personalization";

interface AppState {
  savedCareerIds: string[];
  toggleSavedCareer: (id: string) => void;
  isSaved: (id: string) => boolean;

  comparisonIds: string[];
  toggleComparison: (id: string) => boolean; // returns whether add succeeded
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;

  assessmentAnswers: Partial<AssessmentAnswers>;
  setAssessmentAnswer: <K extends keyof AssessmentAnswers>(key: K, value: AssessmentAnswers[K]) => void;
  resetAssessment: () => void;
  assessmentResult: AssessmentResult | null;
  submitAssessment: (targetCareerId: string) => AssessmentResult;

  activePathwayId: string | null;
  setActivePathwayByCareer: (careerId: string) => void;

  progress: Record<string, UserProgress>;
  toggleStepComplete: (pathwayId: string, stepId: string) => void;
  toggleResourceComplete: (pathwayId: string, resourceId: string) => void;
  getProgress: (pathwayId: string) => UserProgress;
}

const emptyProgress = (pathwayId: string): UserProgress => ({
  pathwayId,
  completedStepIds: [],
  completedResourceIds: [],
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedCareerIds: [],
      toggleSavedCareer: (id) =>
        set((state) => ({
          savedCareerIds: state.savedCareerIds.includes(id)
            ? state.savedCareerIds.filter((c) => c !== id)
            : [...state.savedCareerIds, id],
        })),
      isSaved: (id) => get().savedCareerIds.includes(id),

      comparisonIds: [],
      toggleComparison: (id) => {
        const current = get().comparisonIds;
        if (current.includes(id)) {
          set({ comparisonIds: current.filter((c) => c !== id) });
          return true;
        }
        if (current.length >= 3) return false;
        set({ comparisonIds: [...current, id] });
        return true;
      },
      removeFromComparison: (id) =>
        set((state) => ({ comparisonIds: state.comparisonIds.filter((c) => c !== id) })),
      clearComparison: () => set({ comparisonIds: [] }),

      assessmentAnswers: {},
      setAssessmentAnswer: (key, value) =>
        set((state) => ({ assessmentAnswers: { ...state.assessmentAnswers, [key]: value } })),
      resetAssessment: () => set({ assessmentAnswers: {}, assessmentResult: null }),
      assessmentResult: null,
      submitAssessment: (targetCareerId) => {
        const answers = get().assessmentAnswers;
        const career = careerById(targetCareerId);
        const pathway = pathwayByCareerId(targetCareerId);
        const existingSkillIds = answers.existingSkillIds ?? [];
        const gap = career ? computeSkillGap(career, existingSkillIds) : { matchPercentage: 0, haveSkillIds: [], needSkillIds: [] };
        const startStepId = pathway ? recommendedStartStepId(pathway, gap.needSkillIds) : "";
        const result: AssessmentResult = {
          targetCareerId,
          matchPercentage: gap.matchPercentage,
          haveSkillIds: gap.haveSkillIds,
          needSkillIds: gap.needSkillIds,
          recommendedStartStepId: startStepId,
          completedAt: new Date().toISOString(),
        };
        set({ assessmentResult: result, assessmentAnswers: { ...answers, targetCareerId } });
        return result;
      },

      activePathwayId: null,
      setActivePathwayByCareer: (careerId) => {
        const pathway = pathwayByCareerId(careerId);
        if (!pathway) return;
        set((state) => ({
          activePathwayId: pathway.id,
          progress: state.progress[pathway.id] ? state.progress : { ...state.progress, [pathway.id]: emptyProgress(pathway.id) },
        }));
      },

      progress: {},
      toggleStepComplete: (pathwayId, stepId) =>
        set((state) => {
          const current = state.progress[pathwayId] ?? emptyProgress(pathwayId);
          const completed = current.completedStepIds.includes(stepId)
            ? current.completedStepIds.filter((s) => s !== stepId)
            : [...current.completedStepIds, stepId];
          return { progress: { ...state.progress, [pathwayId]: { ...current, completedStepIds: completed } } };
        }),
      toggleResourceComplete: (pathwayId, resourceId) =>
        set((state) => {
          const current = state.progress[pathwayId] ?? emptyProgress(pathwayId);
          const completed = current.completedResourceIds.includes(resourceId)
            ? current.completedResourceIds.filter((s) => s !== resourceId)
            : [...current.completedResourceIds, resourceId];
          return { progress: { ...state.progress, [pathwayId]: { ...current, completedResourceIds: completed } } };
        }),
      getProgress: (pathwayId) => get().progress[pathwayId] ?? emptyProgress(pathwayId),
    }),
    { name: "pathway-app" }
  )
);
