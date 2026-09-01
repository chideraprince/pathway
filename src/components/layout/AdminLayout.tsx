import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Briefcase, Map, BookOpen, Rocket, ArrowLeft } from "lucide-react";
import { Logo } from "./Logo";
import { Toaster } from "@/components/ui/Toaster";
import { cn } from "@/lib/cn";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/careers", label: "Careers", icon: Briefcase },
  { to: "/admin/pathways", label: "Pathways", icon: Map },
  { to: "/admin/resources", label: "Resources", icon: BookOpen },
  { to: "/admin/opportunities", label: "Opportunities", icon: Rocket },
];

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-ink-200 px-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                )
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink-200 p-3">
          <Link to="/" className="focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink-50">
            <ArrowLeft className="h-4 w-4" />
            Back to Pathway
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-5 lg:hidden">
          <Logo />
          <Link to="/" className="focus-ring rounded-lg px-2 py-1 text-sm font-medium text-ink-500">Exit admin</Link>
        </header>
        <div className="border-b border-ink-200 bg-white px-5 py-2 lg:hidden">
          <nav className="flex gap-1 overflow-x-auto scrollbar-none">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn("focus-ring whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium", isActive ? "bg-brand-50 text-brand-700" : "text-ink-500")
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
