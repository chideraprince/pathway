import { useMemo, useState } from "react";
import { Briefcase, Sparkles } from "lucide-react";
import { SearchInput } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { OpportunityCard } from "@/components/feature/OpportunityCard";
import { opportunities } from "@/data/opportunities";
import { careerById } from "@/data/careers";
import { pathwayById } from "@/data/pathways";
import { recommendedOpportunities } from "@/lib/personalization";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import type { OpportunityType } from "@/types";

const types: OpportunityType[] = ["Internship", "Scholarship", "Fellowship", "Graduate Role", "Competition", "Bootcamp/Program"];

export default function Opportunities() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<OpportunityType | null>(null);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const { activePathwayId, savedCareerIds } = useAppStore();
  const { user } = useAuthStore();

  const activePathway = activePathwayId ? pathwayById(activePathwayId) : undefined;
  const activeCareer = activePathway ? careerById(activePathway.careerId) : undefined;
  const recommended = activeCareer ? recommendedOpportunities(activeCareer.id, user?.skills ?? [], 3) : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities.filter((o) => {
      if (o.status !== "published") return false;
      if (type && o.type !== type) return false;
      if (remoteOnly && !o.remote) return false;
      if (q) {
        const haystack = `${o.title} ${o.organisation} ${o.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, type, remoteOnly]);

  return (
    <div className="container-page py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">Opportunities</h1>
      <p className="mt-2 max-w-2xl text-ink-600">Internships, scholarships, fellowships, graduate roles, competitions and programs — curated for students and early-career professionals.</p>

      {activeCareer && recommended.length > 0 && (
        <section className="mt-8 rounded-2xl border border-brand-200 bg-brand-50/40 p-5">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            <Sparkles className="h-4 w-4" /> Recommended for your {activeCareer.title} pathway
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {recommended.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 space-y-4">
        <SearchInput placeholder="Search opportunities…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-md" />
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={type === null} onClick={() => setType(null)}>All types</Chip>
          {types.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(type === t ? null : t)}>{t}</Chip>
          ))}
          <span className="mx-1 h-4 w-px bg-ink-200" />
          <Chip active={remoteOnly} onClick={() => setRemoteOnly((v) => !v)}>Remote only</Chip>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-500">{filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"}</p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No opportunities match your filters"
          description="Try a different search term, or clear your filters to see everything again."
          className="mt-4"
          action={
            <button
              onClick={() => {
                setQuery("");
                setType(null);
                setRemoteOnly(false);
              }}
              className="focus-ring text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Clear all filters
            </button>
          }
        />
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} />
          ))}
        </div>
      )}
      {savedCareerIds.length === 0 && !activeCareer && (
        <p className="mt-8 text-sm text-ink-400">Tip: build a pathway to see opportunities recommended specifically for your career.</p>
      )}
    </div>
  );
}
