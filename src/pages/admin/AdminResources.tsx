import { useState } from "react";
import { Plus, Pencil, Award } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { resources as seedResources } from "@/data/resources";
import { skillById } from "@/data/skills";
import { useToastStore } from "@/store/toastStore";
import type { Resource } from "@/types";

export default function AdminResources() {
  const [items, setItems] = useState(seedResources);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const push = useToastStore((s) => s.push);

  const filtered = items.filter((r) => `${r.title} ${r.provider}`.toLowerCase().includes(query.toLowerCase()));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "");
    const provider = String(form.get("provider") ?? "");
    const cost = String(form.get("cost") ?? "free") as Resource["cost"];
    const level = String(form.get("level") ?? "beginner") as Resource["level"];

    if (editing) {
      setItems((prev) => prev.map((r) => (r.id === editing.id ? { ...r, title, provider, cost, level } : r)));
      push(`${title} updated`, "success");
    } else {
      const newResource: Resource = {
        id: `draft-${Date.now()}`,
        title,
        provider,
        type: "course",
        level,
        duration: "TBD",
        cost,
        certification: false,
        url: "https://example.com",
        skillIds: [],
        whyRecommended: "Added by admin — link to a skill to surface it on a pathway step.",
      };
      setItems((prev) => [newResource, ...prev]);
      push(`${title} added`, "success");
    }
    setModalOpen(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Resources"
        description="Add and edit courses, certifications and projects, and link them to skills and pathway steps."
        action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> New Resource</Button>}
      />

      <SearchInput placeholder="Search resources…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />

      <Card className="mt-5 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Provider</th>
                <th className="px-5 py-3">Level</th>
                <th className="px-5 py-3">Cost</th>
                <th className="px-5 py-3">Linked skills</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((r) => (
                <tr key={r.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-800">
                    <span className="flex items-center gap-1.5">
                      {r.title}
                      {r.certification && <Award className="h-3.5 w-3.5 text-brand-500" />}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-500">{r.provider}</td>
                  <td className="px-5 py-3 text-ink-500 capitalize">{r.level}</td>
                  <td className="px-5 py-3"><Badge tone={r.cost === "free" ? "emerald" : "amber"}>{r.cost}</Badge></td>
                  <td className="px-5 py-3 text-ink-500">{r.skillIds.map((id) => skillById(id)?.name).filter(Boolean).join(", ") || "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button onClick={() => { setEditing(r); setModalOpen(true); }} className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-ink-100 px-5 py-3 text-xs text-ink-400">Showing {Math.min(20, filtered.length)} of {filtered.length} resources.</p>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${editing.title}` : "New resource"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={editing?.title} />
          </div>
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Input id="provider" name="provider" required defaultValue={editing?.provider} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="level">Level</Label>
              <Select id="level" name="level" defaultValue={editing?.level ?? "beginner"}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="cost">Cost</Label>
              <Select id="cost" name="cost" defaultValue={editing?.cost ?? "free"}>
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? "Save changes" : "Add resource"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
