import { Info } from "lucide-react";
import type { DataSource } from "@/types";

// Multiple dataSources entries (e.g. one per data type) often cite the same
// underlying source/date — collapse those before rendering so the trust
// note doesn't repeat itself verbatim.
function uniqueSources(sources: DataSource[]): DataSource[] {
  const seen = new Set<string>();
  return sources.filter((s) => {
    const key = `${s.source}__${s.dateUpdated}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function DataTrustNote({ sources, note }: { sources?: DataSource[]; note?: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-ink-50 px-3.5 py-3 text-xs text-ink-500">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />
      <div className="space-y-1">
        <p>{note ?? "Projection data is indicative and based on aggregated industry and labour-market patterns. It is not a guarantee of future outcomes."}</p>
        {sources && sources.length > 0 && (
          <p className="text-ink-400">
            {uniqueSources(sources).map((s, i) => (
              <span key={i}>
                {i > 0 && " · "}
                {s.source} · updated {new Date(s.dateUpdated).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
