import { Navigate, Link } from "react-router-dom";
import { ArrowRight, Bookmark, Sparkles, Briefcase, CheckCircle2, Circle, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { CareerCard } from "@/components/feature/CareerCard";
import { OpportunityCard } from "@/components/feature/OpportunityCard";
import { careerById, careersByIds } from "@/data/careers";
import { pathwayById, pathwayTotalSteps } from "@/data/pathways";
import { pathwayProgressPercentage, nextIncompleteStep, recommendedOpportunities, recommendCareersFromSkills } from "@/lib/personalization";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const { activePathwayId, getProgress, savedCareerIds } = useAppStore();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const pathway = activePathwayId ? pathwayById(activePathwayId) : undefined;
  const career = pathway ? careerById(pathway.careerId) : undefined;
  const progress = pathway ? getProgress(pathway.id) : undefined;
  const pct = pathway ? pathwayProgressPercentage(pathway, progress) : 0;
  const nextStep = pathway ? nextIncompleteStep(pathway, progress) : undefined;
  const totalSteps = pathway ? pathwayTotalSteps(pathway) : 0;

  const skillState = career
    ? (() => {
        const completedStepSkillIds = new Set(
          pathway!.stages
            .flatMap((s) => s.steps)
            .filter((s) => progress?.completedStepIds.includes(s.id))
            .flatMap((s) => s.skillIds)
        );
        const total = career.skills.length;
        const completed = career.skills.filter((s) => completedStepSkillIds.has(s.skillId)).length;
        return { total, completed, remaining: total - completed };
      })()
    : null;

  const savedCareers = careersByIds(savedCareerIds);
  const recommended = recommendCareersFromSkills(user.skills, 4).filter((c) => c.id !== career?.id);
  const opportunities = recommendedOpportunities(career?.id ?? null, user.skills, 3);

  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{greeting()}, {user.name.split(" ")[0]}</h1>
      <p className="mt-1 text-ink-500">Here's where you stand today.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Current pathway */}
        <Card className="p-6 lg:col-span-2">
          {pathway && career ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Current pathway</p>
                  <h2 className="mt-1 text-xl font-bold text-ink-900">{career.title}</h2>
                </div>
                <ProgressRing value={pct} size={56} strokeWidth={5} />
              </div>
              <p className="mt-1 text-sm font-medium text-emerald-600">{pct}% complete</p>
              <ProgressBar value={pct} className="mt-2" />
              <p className="mt-1.5 text-xs text-ink-500">{progress?.completedStepIds.length ?? 0} of {totalSteps} steps completed</p>

              {nextStep ? (
                <div className="mt-5 rounded-xl bg-brand-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Next up</p>
                  <p className="mt-1 font-semibold text-ink-900">{nextStep.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-500">
                    <Clock className="h-3.5 w-3.5" /> Estimated {nextStep.durationWeeks} week{nextStep.durationWeeks !== 1 ? "s" : ""}
                  </p>
                  <LinkButton to={`/careers/${career.slug}/pathway`} size="sm" className="mt-3">
                    Continue <ArrowRight className="h-3.5 w-3.5" />
                  </LinkButton>
                </div>
              ) : (
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" /> You've completed every step in this pathway. Nice work.
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="You don't have an active pathway yet"
              description="Take the skill assessment or open a career profile and tap 'Build My Pathway' to get started."
              action={<LinkButton to="/assessment">Take the assessment</LinkButton>}
            />
          )}
        </Card>

        {/* Skill progress */}
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Skill progress</p>
          {skillState ? (
            <div className="mt-4 space-y-3">
              <StatRow icon={CheckCircle2} tone="text-emerald-500" label="Completed" value={skillState.completed} />
              <StatRow icon={Circle} tone="text-ink-300" label="Remaining" value={skillState.remaining} />
              <ProgressBar value={(skillState.completed / Math.max(1, skillState.total)) * 100} className="mt-1" />
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-500">Build a pathway to start tracking skill progress.</p>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Opportunities */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Opportunities for you</h2>
            <Link to="/opportunities" className="focus-ring flex items-center gap-1 text-sm font-medium text-brand-600">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {opportunities.length === 0 ? (
            <EmptyState icon={Briefcase} title="No opportunities yet" description="Build a pathway to see opportunities matched to your career." className="mt-4" />
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {opportunities.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} />
              ))}
            </div>
          )}
        </div>

        {/* Saved careers */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Saved careers</h2>
          </div>
          {savedCareers.length === 0 ? (
            <EmptyState icon={Bookmark} title="No saved careers" description="Tap the bookmark icon on any career to save it here." className="mt-4" />
          ) : (
            <div className="mt-4 space-y-3">
              {savedCareers.slice(0, 3).map((c) => (
                <CareerCard key={c.id} career={c} compact />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended careers */}
      {recommended.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink-900">Recommended for you</h2>
          <p className="mt-1 text-sm text-ink-500">Based on your profile and skills.</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((c) => (
              <CareerCard key={c.id} career={c} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatRow({ icon: Icon, tone, label, value }: { icon: React.ComponentType<{ className?: string }>; tone: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-ink-600">
        <Icon className={`h-4 w-4 ${tone}`} /> {label}
      </span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}
