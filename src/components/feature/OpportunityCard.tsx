import { Link } from "react-router-dom";
import { MapPin, CalendarClock, ArrowUpRight } from "lucide-react";
import type { Opportunity } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDeadline, daysUntil } from "@/lib/format";
import { cn } from "@/lib/cn";

const typeTone: Record<Opportunity["type"], "brand" | "amber" | "emerald" | "rose" | "ink"> = {
  Internship: "brand",
  Scholarship: "emerald",
  Fellowship: "amber",
  "Graduate Role": "ink",
  Competition: "rose",
  "Bootcamp/Program": "brand",
};

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const days = daysUntil(opportunity.deadline);
  return (
    <Card hoverable className="relative flex flex-col p-5">
      <Link to={`/opportunities/${opportunity.id}`} className="focus-ring absolute inset-0 rounded-2xl" aria-label={opportunity.title} />
      <div className="flex items-start justify-between gap-2">
        <Badge tone={typeTone[opportunity.type]}>{opportunity.type}</Badge>
        {days > 0 && days <= 14 && <Badge tone="rose">Closing soon</Badge>}
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug text-ink-900">{opportunity.title}</h3>
      <p className="mt-1 text-sm font-medium text-ink-500">{opportunity.organisation}</p>
      <p className="mt-3 line-clamp-2 text-sm text-ink-500">{opportunity.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {opportunity.location}</span>
        <span className={cn("inline-flex items-center gap-1", days <= 14 && days > 0 && "font-medium text-rose-600")}>
          <CalendarClock className="h-3.5 w-3.5" /> Due {formatDeadline(opportunity.deadline)}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600">
        View opportunity <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </Card>
  );
}
