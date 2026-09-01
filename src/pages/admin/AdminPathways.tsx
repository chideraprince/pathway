import { useState } from "react";
import { ChevronDown, Clock, ListChecks, GripVertical } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/Input";
import { pathways } from "@/data/pathways";
import { careerById } from "@/data/careers";
import { cn } from "@/lib/cn";

export default function AdminPathways() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = pathways.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title="Pathways"
        description="Manage stages, skills, resources and durations for each career pathway."
      />

      <SearchInput placeholder="Search pathways…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />

      <div className="mt-5 space-y-3">
        {filtered.map((p) => {
          const career = careerById(p.careerId);
          const totalSteps = p.stages.reduce((sum, s) => sum + s.steps.length, 0);
          const isOpen = openId === p.id;
          return (
            <Card key={p.id} className="overflow-hidden p-0">
              <button onClick={() => setOpenId(isOpen ? null : p.id)} className="focus-ring flex w-full items-center gap-4 px-5 py-4 text-left">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink-900">{p.title}</p>
                  <p className="text-xs text-ink-500">{career?.category} · {p.stages.length} stages · {totalSteps} steps · ~{p.estimatedDurationMonths} months</p>
                </div>
                <Badge tone="ink">{p.careerId}</Badge>
                <ChevronDown className={cn("h-4 w-4 text-ink-400 transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="space-y-3 border-t border-ink-100 px-5 py-4">
                  {p.stages.map((stage, i) => (
                    <div key={stage.id} className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-ink-300" />
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">{i + 1}</span>
                        <p className="font-medium text-ink-900">{stage.title}</p>
                        <span className="ml-auto flex items-center gap-1 text-xs text-ink-400">
                          <ListChecks className="h-3.5 w-3.5" /> {stage.steps.length} steps
                        </span>
                      </div>
                      <div className="mt-3 space-y-1.5 pl-8">
                        {stage.steps.map((step) => (
                          <div key={step.id} className="flex items-center justify-between text-xs text-ink-600">
                            <span>{step.title}</span>
                            <span className="flex items-center gap-1 text-ink-400">
                              <Clock className="h-3 w-3" /> {step.durationWeeks}w · {step.resourceIds.length} resource{step.resourceIds.length === 1 ? "" : "s"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
