import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ProjectionPoint } from "@/types";

export function describeTrend(data: ProjectionPoint[]): string {
  if (data.length < 2) return "Demand data is limited for this career.";
  const first = data[0].demandIndex;
  const last = data[data.length - 1].demandIndex;
  const delta = last - first;
  const years = `${data[0].year}–${data[data.length - 1].year}`;
  if (delta >= 15) return `Demand is projected to climb steadily through ${years}.`;
  if (delta >= 5) return `Demand is projected to grow modestly through ${years}.`;
  if (delta > -5) return `Demand is projected to hold steady through ${years}.`;
  return `Demand is projected to soften through ${years}.`;
}

export function ProjectionChart({ data }: { data: ProjectionPoint[] }) {
  const last = data[data.length - 1];
  return (
    <div className="relative h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 34, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#96601f" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#96601f" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e6e0d4" strokeOpacity={0.7} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7d7362" }} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            cursor={{ stroke: "#e8c88e", strokeWidth: 1 }}
            contentStyle={{ borderRadius: 10, border: "1px solid #e6e0d4", fontSize: 13, boxShadow: "0 4px 12px -2px rgb(20 17 13 / 0.12)" }}
            formatter={(value) => [`${value} / 100`, "Demand index"]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Area
            type="monotone"
            dataKey="demandIndex"
            stroke="#7a4c18"
            strokeWidth={2.5}
            fill="url(#demandFill)"
            dot={{ r: 3, fill: "#7a4c18", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#7a4c18", stroke: "#fbf3e7", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Direct label on the endpoint the claim is about — matches its position via the chart's own margins */}
      <div className="pointer-events-none absolute right-0 top-2 rounded-md bg-brand-700 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">
        {last.demandIndex}
      </div>
    </div>
  );
}
