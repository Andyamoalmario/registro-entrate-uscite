"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatEuro } from "@/lib/format";

const PALETTE = [
  "#D9789A", // rosa
  "#7FB6D9", // azzurro
  "#5FA97F", // verde
  "#D1A63C", // giallo
  "#A78FD1", // lilla
  "#E8A87C", // pesca
  "#6E8A99", // grigio-azzurro
];

export default function CategoryDonut({
  data,
}: {
  data: { category: string; total: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="bg-paper-raised border border-rule rounded-2xl p-5">
        <p className="text-xs uppercase tracking-widest text-ink-soft mb-4">
          Uscite per categoria
        </p>
        <p className="text-sm text-ink-soft py-8 text-center">
          Nessuna uscita registrata questo mese.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-widest text-ink-soft mb-4">
        Uscite per categoria
      </p>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatEuro(Number(value))}
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #D9EAF1",
                borderRadius: 10,
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex-1 space-y-1.5 text-sm">
          {data.slice(0, 6).map((d, i) => (
            <li key={d.category} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: PALETTE[i % PALETTE.length] }}
              />
              <span className="text-ink-soft truncate">{d.category}</span>
              <span className="tabular ml-auto text-xs">
                {formatEuro(d.total)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
