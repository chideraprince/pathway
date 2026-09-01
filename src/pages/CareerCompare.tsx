import { useState } from "react";
import { X, GitCompare } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { careers, careerById } from "@/data/careers";
import { skillById } from "@/data/skills";
import { demandLabel, demandTone, growthLabel, formatSalary } from "@/lib/format";
import { useAppStore } from "@/store/appStore";

export default function CareerCompare() {
  const { comparisonIds, toggleComparison, removeFromComparison } = useAppStore();
  const [query, setQuery] = useState("");
  const selected = comparisonIds.map(careerById).filter((c): c is NonNullable<typeof c> => Boolean(c));

  const pickerResults = careers
    .filter((c) => !comparisonIds.includes(c.id))
    .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="container-page py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">Compare Careers</h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Compare up to 3 careers side by side. This is meant to help you weigh trade-offs — no career here is universally "better" than another.
      </p>

      {selected.length < 3 && (
        <div className="mt-6 max-w-sm">
          <SearchInput placeholder="Add a career to compare…" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && (
            <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-ink-200 bg-white shadow-[var(--shadow-card)]">
              {pickerResults.length === 0 ? (
                <p className="p-3 text-sm text-ink-400">No matches.</p>
              ) : (
                pickerResults.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      toggleComparison(c.id);
                      setQuery("");
                    }}
                    className="focus-ring flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm hover:bg-ink-50"
                  >
                    <span className="font-medium text-ink-800">{c.title}</span>
                    <span className="text-xs text-ink-400">{c.category}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {selected.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="No careers selected yet"
          description="Search above, or open any career profile and tap Compare to add it here."
          className="mt-10"
          action={<LinkButton to="/careers" variant="outline">Browse careers</LinkButton>}
        />
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40 text-left text-xs font-semibold uppercase tracking-wide text-ink-400"></th>
                {selected.map((c) => (
                  <th key={c.id} className="min-w-[220px] border-b border-ink-200 px-4 py-3 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-ink-900">{c.title}</p>
                      <button onClick={() => removeFromComparison(c.id)} className="focus-ring rounded p-1 text-ink-300 hover:bg-ink-100 hover:text-ink-600" aria-label={`Remove ${c.title}`}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-400">{c.category}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Demand" cells={selected.map((c) => <Badge tone={demandTone[c.demand]}>{demandLabel[c.demand]}</Badge>)} />
              <Row label="Growth" cells={selected.map((c) => <span className="text-sm text-ink-700">{growthLabel[c.growth]}</span>)} />
              <Row label="Salary range" cells={selected.map((c) => <span className="text-sm font-medium text-ink-900">{formatSalary(c.salaryRange)}</span>)} />
              <Row label="Time to skill" cells={selected.map((c) => <span className="text-sm text-ink-700">{c.timeToSkill}</span>)} />
              <Row
                label="Core skills"
                cells={selected.map((c) => (
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.filter((s) => s.group === "core").slice(0, 3).map((s) => (
                      <span key={s.skillId} className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
                        {skillById(s.skillId)?.name}
                      </span>
                    ))}
                  </div>
                ))}
              />
              <Row
                label="Typical entry route"
                cells={selected.map((c) => <span className="text-sm text-ink-700">{c.entryPaths[0]?.label}</span>)}
              />
              <Row
                label=""
                cells={selected.map((c) => <LinkButton to={`/careers/${c.slug}/pathway`} size="sm">Build pathway</LinkButton>)}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: React.ReactNode[] }) {
  return (
    <tr>
      <td className="border-b border-ink-100 py-4 pr-4 align-top text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</td>
      {cells.map((cell, i) => (
        <td key={i} className="border-b border-ink-100 px-4 py-4 align-top">
          {cell}
        </td>
      ))}
    </tr>
  );
}
