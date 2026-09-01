import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, hoverable, ...rest }: HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-200 bg-white shadow-[var(--shadow-card)]",
        hoverable && "transition-all duration-150 hover:shadow-[var(--shadow-card-hover)] hover:border-ink-300",
        className
      )}
      {...rest}
    />
  );
}
