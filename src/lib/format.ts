import type { BadgeTone } from "@/components/ui/Badge";
import type { Demand, Growth, OpportunityType } from "@/types";

// None of these use "brand" — the accent is reserved for actions/selection,
// and a type badge like this repeats on every card in a results grid, which
// would blow the accent budget fast if it carried the one loaded color.
export const opportunityTypeTone: Record<OpportunityType, BadgeTone> = {
  Internship: "ink",
  Scholarship: "emerald",
  Fellowship: "amber",
  "Graduate Role": "ink",
  Competition: "rose",
  "Bootcamp/Program": "ink",
};

export const demandLabel: Record<Demand, string> = {
  emerging: "Emerging",
  growing: "Growing",
  stable: "Stable",
  "high-demand": "High demand",
  competitive: "Competitive",
};

// Same rule as opportunityTypeTone: "high-demand" is the most common value
// in the dataset, so it can't carry the accent without the accent stopping
// to mean anything — it shares emerald's "good news" family instead.
export const demandTone: Record<Demand, BadgeTone> = {
  emerging: "amber",
  growing: "emerald",
  stable: "ink",
  "high-demand": "emerald",
  competitive: "rose",
};

export const growthLabel: Record<Growth, string> = {
  declining: "Declining",
  stable: "Stable",
  growing: "Growing",
  "fast-growing": "Fast-growing",
};

export function formatSalary(range: { min: number; max: number; currency: string }): string {
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  return `${fmt(range.min)}–${fmt(range.max)}`;
}

export function formatDeadline(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysUntil(iso: string): number {
  const now = new Date("2026-09-01T00:00:00Z").getTime();
  const target = new Date(iso).getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function formatSkillCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
