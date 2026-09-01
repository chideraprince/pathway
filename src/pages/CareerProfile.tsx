import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Bookmark, TrendingUp, DollarSign, Clock, Wifi, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton, Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { ProjectionChart, describeTrend } from "@/components/feature/ProjectionChart";
import { DataTrustNote } from "@/components/feature/DataTrustNote";
import { PathwayPreview } from "@/components/feature/PathwayPreview";
import { CareerCard } from "@/components/feature/CareerCard";
import { careerBySlug, careersByIds } from "@/data/careers";
import { pathwayByCareerId } from "@/data/pathways";
import { skillById } from "@/data/skills";
import { demandLabel, demandTone, growthLabel, formatSalary } from "@/lib/format";
import { useAppStore } from "@/store/appStore";
import { useToastStore } from "@/store/toastStore";
import type { SkillCategory } from "@/types";

const skillGroupLabels: Record<SkillCategory, string> = {
  core: "Core skills",
  technical: "Technical skills",
  tools: "Tools",
  soft: "Soft skills",
  advanced: "Optional / advanced",
};

export default function CareerProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const career = slug ? careerBySlug(slug) : undefined;
  const { isSaved, toggleSavedCareer, comparisonIds, toggleComparison, setActivePathwayByCareer } = useAppStore();
  const push = useToastStore((s) => s.push);

  if (!career) return <Navigate to="/careers" replace />;

  const pathway = pathwayByCareerId(career.id);
  const related = careersByIds(career.relatedCareerIds);
  const saved = isSaved(career.id);
  const inComparison = comparisonIds.includes(career.id);

  const groups: SkillCategory[] = ["core", "technical", "tools", "soft", "advanced"];

  const onBuildPathway = () => {
    setActivePathwayByCareer(career.id);
    push(`${career.title} set as your active pathway`, "success");
    navigate(`/careers/${career.slug}/pathway`);
  };

  const onCompare = () => {
    const added = toggleComparison(career.id);
    if (!added) {
      push("You can compare up to 3 careers at a time", "error");
    } else {
      push(inComparison ? `Removed ${career.title} from comparison` : `Added ${career.title} to comparison`, "success");
    }
  };

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Explore Careers", to: "/careers" }, { label: career.title }]} />

      {/* Header */}
      <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <Badge tone="ink">{career.category}</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{career.title}</h1>
          <p className="mt-3 text-lg text-ink-600">{career.shortDescription}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => { toggleSavedCareer(career.id); push(saved ? "Removed from saved careers" : "Saved to your careers", "success"); }}>
            <Bookmark className={saved ? "h-4 w-4 fill-brand-600 text-brand-600" : "h-4 w-4"} />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" onClick={onCompare}>
            <GitCompare className="h-4 w-4" />
            {inComparison ? "In comparison" : "Compare"}
          </Button>
          <Button onClick={onBuildPathway}>Build My Pathway</Button>
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-ink-600">{career.longDescription}</p>

      {/* Snapshot */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SnapshotStat icon={TrendingUp} label="Demand" value={demandLabel[career.demand]} tone={demandTone[career.demand]} />
        <SnapshotStat icon={TrendingUp} label="Growth outlook" value={growthLabel[career.growth]} />
        <SnapshotStat icon={DollarSign} label="Salary range" value={formatSalary(career.salaryRange)} sub={`Entry: ${formatSalary(career.entrySalary)}`} />
        <SnapshotStat icon={Clock} label="Time to skill" value={career.timeToSkill} sub={<span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" /> {career.remoteFriendly} remote potential</span>} />
      </div>

      {/* Projection */}
      <section className="mt-10">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-ink-900">{describeTrend(career.projection)}</h2>
            <span className="text-xs text-ink-400">2026 → 2035</span>
          </div>
          <ProjectionChart data={career.projection} />
          <DataTrustNote sources={career.dataSources} />
        </Card>
      </section>

      {/* Skills required */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Skills required</h2>
        <div className="mt-5 space-y-6">
          {groups.map((group) => {
            const groupSkills = career.skills.filter((s) => s.group === group);
            if (groupSkills.length === 0) return null;
            return (
              <div key={group}>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-400">{skillGroupLabels[group]}</p>
                <div className="flex flex-wrap gap-2">
                  {groupSkills.map((s) => {
                    const skill = skillById(s.skillId);
                    if (!skill) return null;
                    return <SkillBadge key={s.skillId} name={skill.name} state="neutral" />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Entry paths */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Typical entry paths</h2>
        <p className="mt-1.5 text-sm text-ink-500">There's more than one way in — here are common routes people take.</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {career.entryPaths.map((path) => (
            <Card key={path.label} className="p-5">
              <p className="text-sm font-semibold text-brand-700">{path.label}</p>
              <ol className="mt-3 space-y-2.5">
                {path.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[11px] font-semibold text-ink-600">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      {/* Pathway preview */}
      {pathway && (
        <section className="mt-10">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ink-900">Career pathway preview</h2>
                <p className="mt-1 text-sm text-ink-500">Estimated {pathway.estimatedDurationMonths} months, self-paced.</p>
              </div>
              <LinkButton to={`/careers/${career.slug}/pathway`} variant="outline">See Full Pathway</LinkButton>
            </div>
            <div className="mt-5 overflow-x-auto pb-1">
              <PathwayPreview stageTitles={pathway.stages.map((s) => s.title)} />
            </div>
          </Card>
        </section>
      )}

      {/* Related careers */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ink-900">Related careers</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c) => (
              <CareerCard key={c.id} career={c} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SnapshotStat({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: React.ReactNode;
  tone?: "brand" | "amber" | "emerald" | "rose" | "ink";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-ink-400">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      {tone ? (
        <div className="mt-2">
          <Badge tone={tone}>{value}</Badge>
        </div>
      ) : (
        <p className="mt-1.5 text-lg font-semibold text-ink-900">{value}</p>
      )}
      {sub && <p className="mt-1 text-xs text-ink-500">{sub}</p>}
    </Card>
  );
}
