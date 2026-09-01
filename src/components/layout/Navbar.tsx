import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LayoutDashboard, User, LogOut, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/careers", label: "Explore Careers" },
  { to: "/my-pathway", label: "My Pathway" },
  { to: "/opportunities", label: "Opportunities" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "focus-ring rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/compare" className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900">
            Compare
          </Link>
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="focus-ring flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2.5 hover:bg-ink-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-ink-800">{user.name.split(" ")[0]}</span>
                <ChevronDown className="h-4 w-4 text-ink-400" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-ink-200 bg-white p-1.5 shadow-[var(--shadow-pop)]">
                    <MenuLink to="/dashboard" icon={LayoutDashboard} onClick={() => setMenuOpen(false)}>Dashboard</MenuLink>
                    <MenuLink to="/profile" icon={User} onClick={() => setMenuOpen(false)}>Profile</MenuLink>
                    <MenuLink to="/admin" icon={Shield} onClick={() => setMenuOpen(false)}>Admin</MenuLink>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                      className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900">
                Log in
              </Link>
              <Button size="sm" onClick={() => navigate("/signup")}>Sign up</Button>
            </>
          )}
        </div>

        <button className="focus-ring rounded-lg p-2 text-ink-700 hover:bg-ink-100 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-200 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {[...links, { to: "/compare", label: "Compare", end: false }].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn("focus-ring rounded-lg px-3 py-2.5 text-sm font-medium", isActive ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-50")
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-ink-100 pt-3">
              {isAuthenticated && user ? (
                <>
                  <NavLink to="/dashboard" onClick={() => setOpen(false)} className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">Dashboard</NavLink>
                  <NavLink to="/profile" onClick={() => setOpen(false)} className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">Profile</NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate("/");
                    }}
                    className="focus-ring rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">Log in</Link>
                  <Button onClick={() => { setOpen(false); navigate("/signup"); }}>Sign up</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuLink({ to, icon: Icon, children, onClick }: { to: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; onClick: () => void }) {
  return (
    <NavLink to={to} onClick={onClick} className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
      <Icon className="h-4 w-4 text-ink-400" />
      {children}
    </NavLink>
  );
}
