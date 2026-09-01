import { useState } from "react";
import { Plus, Pencil, Archive, ArchiveRestore } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { careers as seedCareers, careerCategories } from "@/data/careers";
import { demandLabel, demandTone, formatSalary } from "@/lib/format";
import { useToastStore } from "@/store/toastStore";
import type { Career } from "@/types";

export default function AdminCareers() {
  const [items, setItems] = useState(seedCareers);
  const [archived, setArchived] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Career | null>(null);
  const push = useToastStore((s) => s.push);

  const filtered = items.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (c: Career) => {
    setEditing(c);
    setModalOpen(true);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "");
    const category = String(form.get("category") ?? "Technology") as Career["category"];
    const shortDescription = String(form.get("shortDescription") ?? "");

    if (editing) {
      setItems((prev) => prev.map((c) => (c.id === editing.id ? { ...c, title, category, shortDescription } : c)));
      push(`${title} updated`, "success");
    } else {
      const id = `draft-${Date.now()}`;
      const newCareer: Career = {
        id,
        slug: id,
        title,
        category,
        shortDescription,
        longDescription: shortDescription,
        demand: "emerging",
        growth: "growing",
        salaryRange: { min: 40000, max: 90000, currency: "USD" },
        entrySalary: { min: 35000, max: 50000, currency: "USD" },
        timeToSkill: "6 months",
        remoteFriendly: "medium",
        skills: [],
        entryPaths: [],
        relatedCareerIds: [],
        projection: [
          { year: 2026, demandIndex: 50 },
          { year: 2028, demandIndex: 55 },
          { year: 2030, demandIndex: 60 },
          { year: 2035, demandIndex: 68 },
        ],
        dataSources: [{ source: "Admin draft", dateUpdated: new Date().toISOString().slice(0, 10), dataType: "demand", notes: "Newly created — pending review." }],
        pathwayId: `pw-${id}`,
      } as Career;
      setItems((prev) => [newCareer, ...prev]);
      push(`${title} created as a draft`, "success");
    }
    setModalOpen(false);
  };

  const toggleArchive = (c: Career) => {
    setArchived((prev) => {
      const next = new Set(prev);
      if (next.has(c.id)) {
        next.delete(c.id);
        push(`${c.title} restored`, "info");
      } else {
        next.add(c.id);
        push(`${c.title} archived`, "info");
      }
      return next;
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Careers"
        description="Create, edit and archive career profiles, and update projection, salary and skills data."
        action={<Button onClick={openNew}><Plus className="h-4 w-4" /> New Career</Button>}
      />

      <SearchInput placeholder="Search careers…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />

      <Card className="mt-5 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Demand</th>
                <th className="px-5 py-3">Salary range</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-800">{c.title}</td>
                  <td className="px-5 py-3 text-ink-500">{c.category}</td>
                  <td className="px-5 py-3"><Badge tone={demandTone[c.demand]}>{demandLabel[c.demand]}</Badge></td>
                  <td className="px-5 py-3 text-ink-500">{formatSalary(c.salaryRange)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={archived.has(c.id) ? "ink" : "emerald"}>{archived.has(c.id) ? "Archived" : "Published"}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => toggleArchive(c)} className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Archive">
                        {archived.has(c.id) ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${editing.title}` : "New career"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={editing?.title} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" name="category" defaultValue={editing?.category ?? "Technology"}>
              {careerCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="shortDescription">Short description</Label>
            <Input id="shortDescription" name="shortDescription" required defaultValue={editing?.shortDescription} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? "Save changes" : "Create career"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
