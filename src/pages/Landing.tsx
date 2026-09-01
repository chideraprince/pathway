import { Compass, TrendingUp, Search, ClipboardCheck, Route, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CareerCard } from "@/components/feature/CareerCard";
import { OpportunityCard } from "@/components/feature/OpportunityCard";
import { ProjectionChart } from "@/components/feature/ProjectionChart";
import { PathwayPreview } from "@/components/feature/PathwayPreview";
import { careers, careerById } from "@/data/careers";
import { opportunities } from "@/data/opportunities";
import { pathwayByCareerId } from "@/data/pathways";
import { demandLabel, formatSalary } from "@/lib/format";

const featured = careers.filter((c) => c.featured).slice(0, 4);
const exampleCareer = careerById("product-designer")!;
const examplePathway = pathwayByCareerId("product-designer")!;
const spotlightOpportunities = opportunities.slice(0, 3);

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200 bg-gradient-to-b from-brand-50/70 to-ink-50">
        <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <Badge tone="brand">Career projection & roadmap platform</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Know where you're going.
              <br />
              Know how to get there.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-600">
              Explore careers, see where they're headed, discover the skills you need, and build a personalized pathway to get there.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton size="lg" to="/careers">
                Explore Careers <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton size="lg" variant="outline" to="/assessment">Build My Pathway</LinkButton>
            </div>
            <p className="mt-4 text-sm text-ink-500">No account needed to explore. Free to get started.</p>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-[var(--shadow-pop)] sm:pb-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Career snapshot</p>
                  <h3 className="mt-0.5 text-lg font-semibold text-ink-900">{exampleCareer.title}</h3>
                </div>
                <Badge tone="brand">{demandLabel[exampleCareer.demand]}</Badge>
              </div>
              <ProjectionChart data={exampleCareer.projection} />
              <div className="grid grid-cols-2 gap-3 border-t border-ink-100 pt-4">
                <div>
                  <p className="text-xs text-ink-500">Salary range</p>
                  <p className="text-sm font-semibold text-ink-900">{formatSalary(exampleCareer.salaryRange)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-500">Time to skill</p>
                  <p className="text-sm font-semibold text-ink-900">{exampleCareer.timeToSkill}</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-[var(--shadow-pop)] sm:block">
              <p className="text-xs text-ink-500">Your pathway</p>
              <p className="text-sm font-semibold text-emerald-600">42% complete</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">How Pathway works</h2>
          <p className="mt-3 text-ink-600">From vague ambition to concrete next step, in four parts.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Search, title: "Explore careers", desc: "Browse realistic career profiles with clear demand and growth outlooks." },
            { icon: ClipboardCheck, title: "Assess your skills", desc: "A short assessment shows what you already have and what's missing." },
            { icon: Route, title: "Build a pathway", desc: "Get a personalized, staged roadmap from foundations to job-ready." },
            { icon: Rocket, title: "Track & discover", desc: "Track progress, follow curated resources, and find relevant opportunities." },
          ].map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-ink-200 bg-white p-6">
              <span className="absolute right-5 top-5 text-xs font-semibold text-ink-300">0{i + 1}</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Career exploration */}
      <section className="border-t border-ink-200 bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="brand">Career exploration</Badge>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Careers worth knowing about</h2>
              <p className="mt-2 max-w-xl text-ink-600">17 curated career profiles across technology, business, creative and emerging fields.</p>
            </div>
            <LinkButton variant="outline" to="/careers">Browse all careers <ArrowRight className="h-4 w-4" /></LinkButton>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((c) => (
              <CareerCard key={c.id} career={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Projections */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge tone="brand">Career projections</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">See where a career is headed, not just where it stands today</h2>
            <p className="mt-4 text-ink-600">
              Every career profile includes an indicative demand outlook from 2026 through 2035, alongside salary ranges and remote-work
              potential — so you can weigh a decision against the future, not just the present.
            </p>
            <ul className="mt-6 space-y-3">
              {["Demand trend across the next decade", "Salary range and typical entry-level pay", "Clear labels: growing, stable, emerging, competitive"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-ink-400">
              Projection data is indicative and based on aggregated industry and labour-market sources. It is not a guarantee of outcomes.
            </p>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink-900">AI/ML Engineer — demand outlook</h3>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <ProjectionChart data={careerById("ai-ml-engineer")!.projection} />
          </div>
        </div>
      </section>

      {/* Personalized pathways + example */}
      <section className="border-t border-ink-200 bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="brand">Personalized pathways</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">A guided journey, not a static checklist</h2>
            <p className="mt-3 text-ink-600">Every career comes with a staged roadmap from foundations to job-ready — here's what it looks like for a Product Designer.</p>
          </div>
          <div className="mt-10 overflow-x-auto pb-2">
            <div className="flex justify-center">
              <PathwayPreview stageTitles={examplePathway.stages.map((s) => s.title)} />
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <LinkButton variant="outline" to={`/careers/${exampleCareer.slug}/pathway`}>See Full Pathway <ArrowRight className="h-4 w-4" /></LinkButton>
          </div>
        </div>
      </section>

      {/* Skill gap */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 rounded-2xl border border-ink-200 bg-white p-6 shadow-[var(--shadow-card)] lg:order-1">
            <p className="text-sm font-medium text-ink-500">Your Path to Product Design</p>
            <h3 className="mt-1 text-2xl font-bold text-ink-900">You're 42% of the way there.</h3>
            <div className="mt-5 space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">You already have</p>
                <div className="flex flex-wrap gap-2">
                  {["Visual design", "Branding", "Adobe Creative Suite"].map((s) => (
                    <span key={s} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">✓ {s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">You need to develop</p>
                <div className="flex flex-wrap gap-2">
                  {["User research", "Interaction design", "Product thinking", "Design systems"].map((s) => (
                    <span key={s} className="rounded-full bg-ink-50 px-3 py-1.5 text-xs font-medium text-ink-600 ring-1 ring-inset ring-ink-200">○ {s}</span>
                  ))}
                </div>
              </div>
            </div>
            <LinkButton className="mt-6 w-full" to="/assessment">Start My Pathway</LinkButton>
          </div>
          <div className="order-1 lg:order-2">
            <Badge tone="brand">Skill gap assessment</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Understand your gap before you spend months closing it</h2>
            <p className="mt-4 text-ink-600">
              A short, 5-8 question assessment compares your current skills against a career's requirements — then shows you exactly where
              to start, not just what's missing.
            </p>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="border-t border-ink-200 bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="brand">Opportunities</Badge>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Turn your pathway into next steps</h2>
              <p className="mt-2 max-w-xl text-ink-600">Internships, scholarships, fellowships and graduate roles, filtered against your pathway.</p>
            </div>
            <LinkButton variant="outline" to="/opportunities">View all opportunities <ArrowRight className="h-4 w-4" /></LinkButton>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {spotlightOpportunities.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-14 text-center sm:px-16">
          <div className="mx-auto flex max-w-xl flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white">Stop guessing. Start building your pathway.</h2>
            <p className="mt-3 text-ink-300">Explore 17 careers, see where they're heading, and get a personalized roadmap — free, no account required.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LinkButton size="lg" to="/careers">Explore Careers <ArrowRight className="h-4 w-4" /></LinkButton>
              <LinkButton size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" to="/assessment">Build My Pathway</LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
