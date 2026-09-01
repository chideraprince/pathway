import { NavLink } from "react-router-dom";
import { Home, Compass, Map, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/authStore";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/careers", label: "Explore", icon: Compass },
  { to: "/my-pathway", label: "Pathway", icon: Map },
  { to: "/opportunities", label: "Roles", icon: Briefcase },
];

export function MobileTabBar() {
  const { isAuthenticated } = useAuthStore();
  const profileTab = { to: isAuthenticated ? "/profile" : "/login", label: "Profile", icon: User, end: false };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink-200 bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden">
      {[...tabs, profileTab].map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            cn(
              "focus-ring flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
              isActive ? "text-brand-600" : "text-ink-400"
            )
          }
        >
          <t.icon className="h-5 w-5" strokeWidth={2} />
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
