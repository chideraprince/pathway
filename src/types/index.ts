// Core domain types for Pathway.
// Shaped so a real backend/database can be swapped in without touching UI code.

export type Demand = "emerging" | "growing" | "stable" | "high-demand" | "competitive";
export type Growth = "declining" | "stable" | "growing" | "fast-growing";

export type CareerCategory =
  | "Technology"
  | "Business"
  | "Creative"
  | "Emerging & Cross-disciplinary";

export type SkillCategory = "core" | "technical" | "tools" | "soft" | "advanced";

export interface DataSource {
  source: string;
  dateUpdated: string; // ISO date
  dataType: "salary" | "demand" | "growth" | "projection";
  notes?: string;
}

export interface ProjectionPoint {
  year: number;
  demandIndex: number; // 0-100 illustrative index
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface CareerSkillRef {
  skillId: string;
  group: "core" | "technical" | "tools" | "soft" | "advanced";
}

export interface EntryPath {
  label: string;
  steps: string[];
}

export interface Career {
  id: string;
  slug: string;
  title: string;
  category: CareerCategory;
  shortDescription: string;
  longDescription: string;
  demand: Demand;
  growth: Growth;
  salaryRange: { min: number; max: number; currency: string };
  entrySalary: { min: number; max: number; currency: string };
  timeToSkill: string; // e.g. "6-9 months"
  remoteFriendly: "high" | "medium" | "low";
  featured?: boolean;
  skills: CareerSkillRef[];
  entryPaths: EntryPath[];
  relatedCareerIds: string[];
  projection: ProjectionPoint[];
  dataSources: DataSource[];
  pathwayId: string;
}

export type ResourceType = "course" | "certification" | "bootcamp" | "book" | "project" | "guide";
export type ResourceLevel = "beginner" | "intermediate" | "advanced";

export interface Resource {
  id: string;
  title: string;
  provider: string;
  type: ResourceType;
  level: ResourceLevel;
  duration: string;
  cost: "free" | "paid" | "freemium";
  priceNote?: string;
  certification: boolean;
  url: string;
  skillIds: string[];
  whyRecommended: string;
}

export interface PathwayStep {
  id: string;
  title: string;
  description: string;
  action: "Learn" | "Practice" | "Build" | "Complete";
  skillIds: string[];
  resourceIds: string[];
  durationWeeks: number;
  order: number;
}

export interface PathwayStage {
  id: string;
  title: string;
  description: string;
  order: number;
  steps: PathwayStep[];
}

export interface Pathway {
  id: string;
  careerId: string;
  title: string;
  estimatedDurationMonths: number;
  stages: PathwayStage[];
}

export type OpportunityType =
  | "Internship"
  | "Scholarship"
  | "Fellowship"
  | "Graduate Role"
  | "Competition"
  | "Bootcamp/Program";

export interface Opportunity {
  id: string;
  title: string;
  organisation: string;
  type: OpportunityType;
  location: string;
  remote: boolean;
  deadline: string; // ISO date
  description: string;
  eligibility: string;
  careerTags: string[]; // career ids
  skillTags: string[]; // skill ids
  url: string;
  status: "published" | "draft" | "expired";
}

export interface EducationInfo {
  level: "high-school" | "undergraduate" | "graduate" | "bootcamp" | "self-taught";
  fieldOfStudy: string;
}

export interface AssessmentAnswers {
  fieldOfStudy: string;
  educationLevel: EducationInfo["level"];
  currentStatus: string;
  existingSkillIds: string[];
  yearsExperience: number;
  interestCategory: CareerCategory;
  targetCareerId: string;
  weeklyTimeCommitment: number; // hours/week
}

export interface AssessmentResult {
  targetCareerId: string;
  matchPercentage: number;
  haveSkillIds: string[];
  needSkillIds: string[];
  recommendedStartStepId: string;
  completedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  education: EducationInfo;
  experienceYears: number;
  interests: string[];
  skills: string[]; // skill ids
  targetCareerId: string | null;
  createdAt: string;
}

export interface UserProgress {
  pathwayId: string;
  completedStepIds: string[];
  completedResourceIds: string[];
}
