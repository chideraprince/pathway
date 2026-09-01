import { useParams, Navigate } from "react-router-dom";
import { MapPin, CalendarClock, ExternalLink, Users, Tag } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CareerCard } from "@/components/feature/CareerCard";
import { opportunityById } from "@/data/opportunities";
import { careersByIds } from "@/data/careers";
import { skillById } from "@/data/skills";
import { formatDeadline, daysUntil } from "@/lib/format";

export default function OpportunityDetail() {
  const { id } = useParams();
  const opportunity = id ? opportunityById(id) : undefined;
  if (!opportunity) return <Navigate to="/opportunities" replace />;

  const days = daysUntil(opportunity.deadline);
  const relatedCareers = careersByIds(opportunity.careerTags);

  return (
    <div className="container-page max-w-3xl py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Opportunities", to: "/opportunities" }, { label: opportunity.title }]} />

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{opportunity.type}</Badge>
          {days > 0 && days <= 14 && <Badge tone="rose">Closing in {days} day{days === 1 ? "" : "s"}</Badge>}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">{opportunity.title}</h1>
        <p className="mt-1.5 text-lg text-ink-600">{opportunity.organisation}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoTile icon={MapPin} label="Location" value={opportunity.location} />
        <InfoTile icon={CalendarClock} label="Deadline" value={formatDeadline(opportunity.deadline)} />
        <InfoTile icon={Users} label="Eligibility" value={opportunity.eligibility} />
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-lg font-semibold text-ink-900">About this opportunity</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{opportunity.description}</p>

        {(opportunity.careerTags.length > 0 || opportunity.skillTags.length > 0) && (
          <div className="mt-5 space-y-3 border-t border-ink-100 pt-5">
            {opportunity.careerTags.length > 0 && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <Tag className="h-3.5 w-3.5" /> Related careers
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {relatedCareers.map((c) => (
                    <span key={c.id} className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">{c.title}</span>
                  ))}
                </div>
              </div>
            )}
            {opportunity.skillTags.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">Relevant skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {opportunity.skillTags.map((id) => (
                    <span key={id} className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">{skillById(id)?.name ?? id}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <a href={opportunity.url} target="_blank" rel="noreferrer">
          <Button className="mt-6 w-full sm:w-auto">
            Apply externally <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      </Card>

      {relatedCareers.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink-900">Explore related careers</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {relatedCareers.map((c) => (
              <CareerCard key={c.id} career={c} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-ink-400">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-1.5 text-sm font-medium text-ink-900">{value}</p>
    </Card>
  );
}
