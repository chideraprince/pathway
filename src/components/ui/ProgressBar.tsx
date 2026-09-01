import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName,
  size = "md",
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  size?: "sm" | "md";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-ink-100", size === "sm" ? "h-1.5" : "h-2.5", trackClassName, className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full bg-brand-600 transition-[width] duration-500 ease-out", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
