"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatEuro, householdSettlement } from "@/lib/format";
import { HouseholdExpense, HouseholdSalaries } from "@/lib/types";

export default function HouseholdChart({
  expenses,
  salaries,
}: {
  expenses: HouseholdExpense[];
  salaries: HouseholdSalaries;
}) {
  const { split, paid1, paid2 } = householdSettlement(expenses, salaries);

  if (!split) return null;

  const data = [
    {
      name: salaries.person1Name,
      Dovuto: Math.round(split.amount1 * 100) / 100,
      Pagato: Math.round(paid1 * 100) / 100,
    },
    {
      name: salaries.person2Name,
      Dovuto: Math.round(split.amount2 * 100) / 100,
      Pagato: Math.round(paid2 * 100) / 100,
    },
  ];

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-4">
        Quota dovuta vs pagato
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} stroke="var(--rule-soft)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--ink-soft)", fontSize: 12 }}
            axisLine={{ stroke: "var(--rule)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--ink-soft)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value) => formatEuro(Number(value))}
            contentStyle={{
              background: "var(--paper-raised)",
              border: "1px solid var(--rule)",
              borderRadius: 10,
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Dovuto" fill="var(--accent-soft)" stroke="var(--ink)" strokeWidth={1} radius={[6, 6, 0, 0]} />
          <Bar dataKey="Pagato" fill="var(--invest)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
