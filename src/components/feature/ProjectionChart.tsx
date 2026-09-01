import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ProjectionPoint } from "@/types";

export function ProjectionChart({ data }: { data: ProjectionPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            cursor={{ stroke: "#c7d2fe", strokeWidth: 1 }}
            contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13, boxShadow: "0 4px 12px -2px rgb(17 24 39 / 0.1)" }}
            formatter={(value) => [`${value} / 100`, "Demand index"]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Area type="monotone" dataKey="demandIndex" stroke="#4338ca" strokeWidth={2.5} fill="url(#demandFill)" dot={{ r: 3, fill: "#4338ca" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
