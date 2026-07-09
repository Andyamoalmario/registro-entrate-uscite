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
          <CartesianGrid vertical={false} stroke="#EEE2DB" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#7C6B79", fontSize: 12 }}
            axisLine={{ stroke: "#E3D3CE" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#7C6B79", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value) => formatEuro(Number(value))}
            contentStyle={{
              background: "#FFFBF5",
              border: "1px solid #E3D3CE",
              borderRadius: 10,
              fontSize: 13,
            }}
          />
          <Bar dataKey="entrate" fill="#74886A" radius={[6, 6, 0, 0]} />
          <Bar dataKey="uscite" fill="#B5715F" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
