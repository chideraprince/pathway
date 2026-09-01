import { useState } from "react";
import { Plus, Pencil, EyeOff, Eye, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { opportunities as seedOpportunities } from "@/data/opportunities";
import { formatDeadline } from "@/lib/format";
import { useToastStore } from "@/store/toastStore";
import type { Opportunity } from "@/types";

const statusTone: Record<Opportunity["status"], "emerald" | "ink" | "rose"> = {
  published: "emerald",
  draft: "ink",
  expired: "rose",
};

export default function AdminOpportunities() {
  const [items, setItems] = useState(seedOpportunities);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const push = useToastStore((s) => s.push);

  const filtered = items.filter((o) => `${o.title} ${o.organisation}`.toLowerCase().includes(query.toLowerCase()));

  const cycleStatus = (o: Opportunity) => {
    const next: Opportunity["status"] = o.status === "published" ? "draft" : o.status === "draft" ? "published" : "draft";
    setItems((prev) => prev.map((item) => (item.id === o.id ? { ...item, status: next } : item)));
    push(`${o.title} marked as ${next}`, "info");
  };

  const expire = (o: Opportunity) => {
    setItems((prev) => prev.map((item) => (item.id === o.id ? { ...item, status: "expired" } : item)));
    push(`${o.title} expired`, "info");
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "");
    const organisation = String(form.get("organisation") ?? "");
    const type = String(form.get("type") ?? "Internship") as Opportunity["type"];
    const deadline = String(form.get("deadline") ?? "2026-12-31");

    if (editing) {
      setItems((prev) => prev.map((o) => (o.id === editing.id ? { ...o, title, organisation, type, deadline } : o)));
      push(`${title} updated`, "success");
    } else {
      const newOpp: Opportunity = {
        id: `draft-${Date.now()}`,
        title,
        organisation,
        type,
        location: "Remote (Global)",
        remote: true,
        deadline,
        description: "Draft opportunity — add a full description before publishing.",
        eligibility: "TBD",
        careerTags: [],
        skillTags: [],
        url: "https://example.com",
        status: "draft",
      };
      setItems((prev) => [newOpp, ...prev]);
      push(`${title} created as a draft`, "success");
    }
    setModalOpen(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Opportunities"
        description="Create and manage internships, scholarships, fellowships and graduate roles."
        action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> New Opportunity</Button>}
      />

      <SearchInput placeholder="Search opportunities…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />

      <Card className="mt-5 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Organisation</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Deadline</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-800">{o.title}</td>
                  <td className="px-5 py-3 text-ink-500">{o.organisation}</td>
                  <td className="px-5 py-3 text-ink-500">{o.type}</td>
                  <td className="px-5 py-3 text-ink-500">{formatDeadline(o.deadline)}</td>
                  <td className="px-5 py-3"><Badge tone={statusTone[o.status]}>{o.status}</Badge></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setEditing(o); setModalOpen(true); }} className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => cycleStatus(o)} className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Toggle publish state">
                        {o.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {o.status !== "expired" && (
                        <button onClick={() => expire(o)} className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-rose-600" aria-label="Expire">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${editing.title}` : "New opportunity"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={editing?.title} />
          </div>
          <div>
            <Label htmlFor="organisation">Organisation</Label>
            <Input id="organisation" name="organisation" required defaultValue={editing?.organisation} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select id="type" name="type" defaultValue={editing?.type ?? "Internship"}>
                <option>Internship</option>
                <option>Scholarship</option>
                <option>Fellowship</option>
                <option>Graduate Role</option>
                <option>Competition</option>
                <option>Bootcamp/Program</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="date" defaultValue={editing?.deadline ?? "2026-12-31"} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? "Save changes" : "Create opportunity"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
