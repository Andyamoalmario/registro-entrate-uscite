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
    <div className="bg-paper-raised border border-rule rounded-sm p-5">
      <p className="text-xs uppercase tracking-widest text-ink-soft mb-4">
        Entrate vs uscite — ultimi mesi
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} stroke="#DCD6C3" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#4A5568", fontSize: 12 }}
            axisLine={{ stroke: "#C9C2AC" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#4A5568", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value) => formatEuro(Number(value))}
            contentStyle={{
              background: "#F6F3E9",
              border: "1px solid #C9C2AC",
              borderRadius: 2,
              fontSize: 13,
            }}
          />
          <Bar dataKey="entrate" fill="#3F6B4F" radius={[2, 2, 0, 0]} />
          <Bar dataKey="uscite" fill="#A6432E" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
