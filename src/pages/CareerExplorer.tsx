import { useMemo, useState } from "react";
import { Compass } from "lucide-react";
import { SearchInput } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { CareerCard } from "@/components/feature/CareerCard";
import { careers, careerCategories } from "@/data/careers";
import { skills } from "@/data/skills";
import type { SkillCategory } from "@/types";

const skillAreaOptions: { key: SkillCategory; label: string }[] = [
  { key: "technical", label: "Technical" },
  { key: "tools", label: "Tools" },
  { key: "soft", label: "Soft skills" },
  { key: "advanced", label: "Advanced" },
];

export default function CareerExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [skillArea, setSkillArea] = useState<SkillCategory | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return careers.filter((c) => {
      if (category && c.category !== category) return false;
      if (featuredOnly && !c.featured) return false;
      if (skillArea && !c.skills.some((s) => s.group === skillArea)) return false;
      if (q) {
        const haystack = [c.title, c.shortDescription, c.category, ...c.skills.map((s) => skills.find((sk) => sk.id === s.skillId)?.name ?? "")]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, category, skillArea, featuredOnly]);

  return (
    <div className="container-page py-10 sm:py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Explore Careers</h1>
        <p className="mt-2 text-ink-600">Browse {careers.length} realistic career profiles across technology, business, creative and emerging fields. Search, filter, and open any profile to see the full picture.</p>
      </div>

      <div className="mt-8 space-y-4">
        <SearchInput
          placeholder="Search careers, skills, or categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Chip active={category === null} onClick={() => setCategory(null)}>All categories</Chip>
          {careerCategories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>{c}</Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">Skill area</span>
          {skillAreaOptions.map((s) => (
            <Chip key={s.key} active={skillArea === s.key} onClick={() => setSkillArea(skillArea === s.key ? null : s.key)}>{s.label}</Chip>
          ))}
          <span className="mx-1 h-4 w-px bg-ink-200" />
          <Chip active={featuredOnly} onClick={() => setFeaturedOnly((v) => !v)}>Featured only</Chip>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-ink-500">{filtered.length} career{filtered.length === 1 ? "" : "s"}</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No careers match your filters"
          description="Try a different search term or clear a filter to see more results."
          className="mt-6"
          action={
            <button
              onClick={() => {
                setQuery("");
                setCategory(null);
                setSkillArea(null);
                setFeaturedOnly(false);
              }}
              className="focus-ring text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Clear all filters
            </button>
          }
        />
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CareerCard key={c.id} career={c} />
          ))}
        </div>
      )}
    </div>
  );
}
