import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("focus-ring flex items-center gap-2 rounded-lg", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Compass className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="text-lg font-bold tracking-tight text-ink-900">Pathway</span>
    </Link>
  );
}
