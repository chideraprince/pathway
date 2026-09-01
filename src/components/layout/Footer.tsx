import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-500">
            Career projection and roadmap planning for students and early-career professionals.
          </p>
        </div>
        <FooterCol title="Product" links={[
          { to: "/careers", label: "Explore Careers" },
          { to: "/assessment", label: "Skill Assessment" },
          { to: "/compare", label: "Compare Careers" },
          { to: "/opportunities", label: "Opportunities" },
        ]} />
        <FooterCol title="Account" links={[
          { to: "/dashboard", label: "Dashboard" },
          { to: "/login", label: "Log in" },
          { to: "/signup", label: "Sign up" },
          { to: "/admin", label: "Admin" },
        ]} />
        <div>
          <h4 className="text-sm font-semibold text-ink-900">Data & trust</h4>
          <p className="mt-3 max-w-xs text-sm text-ink-500">
            Projection and salary data in this prototype is illustrative, aggregated from public labour-market patterns. It is not a guarantee of outcomes.
          </p>
        </div>
      </div>
      <div className="border-t border-ink-100 py-5 text-center text-xs text-ink-400">
        © 2026 Pathway. Built as a product prototype.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink-900">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="focus-ring rounded text-sm text-ink-500 hover:text-ink-800">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
