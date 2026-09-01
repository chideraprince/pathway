import type { BadgeTone } from "@/components/ui/Badge";
import type { Demand, Growth } from "@/types";

export const demandLabel: Record<Demand, string> = {
  emerging: "Emerging",
  growing: "Growing",
  stable: "Stable",
  "high-demand": "High demand",
  competitive: "Competitive",
};

export const demandTone: Record<Demand, BadgeTone> = {
  emerging: "amber",
  growing: "emerald",
  stable: "ink",
  "high-demand": "brand",
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
