"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatEuro } from "@/lib/format";

interface Point {
  key: string;
  label: string;
  entrate: number;
  uscite: number;
}

export default function MonthlyBarChart({ data }: { data: Point[] }) {
  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-widest text-ink-soft mb-4">
        Entrate vs uscite — ultimi mesi
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} stroke="#EAF4F8" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#6E8A99", fontSize: 12 }}
            axisLine={{ stroke: "#D9EAF1" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6E8A99", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value) => formatEuro(Number(value))}
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid #D9EAF1",
              borderRadius: 10,
              fontSize: 13,
            }}
          />
          <Bar dataKey="entrate" fill="#5FA97F" radius={[6, 6, 0, 0]} />
          <Bar dataKey="uscite" fill="#D9789A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
