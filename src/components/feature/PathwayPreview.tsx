import { cn } from "@/lib/cn";

export function PathwayPreview({ stageTitles, className }: { stageTitles: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {stageTitles.map((title, i) => (
        <div key={title} className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-800">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-semibold text-white">{i + 1}</span>
            {title}
          </div>
          {i < stageTitles.length - 1 && <span className="text-ink-300">→</span>}
        </div>
      ))}
    </div>
  );
}
