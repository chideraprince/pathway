import { Link } from "react-router-dom";
import { Briefcase, Map, BookOpen, Rocket, Database } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { careers } from "@/data/careers";
import { pathways } from "@/data/pathways";
import { resources } from "@/data/resources";
import { opportunities } from "@/data/opportunities";

const dataSourceRows = careers.flatMap((c) => c.dataSources.map((ds) => ({ career: c.title, ...ds })));

export default function AdminOverview() {
  const publishedOpps = opportunities.filter((o) => o.status === "published").length;

  return (
    <div>
      <AdminPageHeader title="Admin Overview" description="Content management for Pathway's career, pathway, resource and opportunity data." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Careers" value={careers.length} to="/admin/careers" />
        <StatCard icon={Map} label="Pathways" value={pathways.length} to="/admin/pathways" />
        <StatCard icon={BookOpen} label="Resources" value={resources.length} to="/admin/resources" />
        <StatCard icon={Rocket} label="Opportunities" value={`${publishedOpps} / ${opportunities.length}`} sub="published" to="/admin/opportunities" />
      </div>

      <Card className="mt-8 p-6">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-ink-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Data sources</h2>
        </div>
        <p className="mt-1 text-sm text-ink-500">Every projection and salary dataset is tagged with its source, type and last-updated date, so verified data can later replace illustrative estimates without changing the UI.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="py-2 pr-4">Career</th>
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Updated</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {dataSourceRows.slice(0, 10).map((row, i) => (
                <tr key={i} className="border-b border-ink-100">
                  <td className="py-2.5 pr-4 font-medium text-ink-800">{row.career}</td>
                  <td className="py-2.5 pr-4 text-ink-600">{row.source}</td>
                  <td className="py-2.5 pr-4"><Badge tone="ink">{row.dataType}</Badge></td>
                  <td className="py-2.5 pr-4 text-ink-500">{new Date(row.dateUpdated).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
                  <td className="py-2.5 text-ink-500">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-400">Showing 10 of {dataSourceRows.length} data source records.</p>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, to }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sub?: string; to: string }) {
  return (
    <Link to={to} className="focus-ring block rounded-2xl border border-ink-200 bg-white p-5 transition-colors hover:border-ink-300">
      <div className="flex items-center gap-2 text-ink-400">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-ink-900">{value}</p>
      {sub && <p className="text-xs text-ink-400">{sub}</p>}
    </Link>
  );
}
