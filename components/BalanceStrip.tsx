"use client";

import { formatEuro } from "@/lib/format";

export default function BalanceStrip({
  entrate,
  uscite,
  saldo,
  monthLabel,
}: {
  entrate: number;
  uscite: number;
  saldo: number;
  monthLabel: string;
}) {
  const positive = saldo >= 0;
  return (
    <div className="torn-edge bg-ink text-paper-raised rounded-sm px-6 py-5 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-paper-raised/60 mb-1">
          Saldo · {monthLabel}
        </p>
        <p
          className={`tabular text-4xl sm:text-5xl font-semibold ${
            positive ? "text-income" : "text-expense"
          }`}
          style={{
            color: positive ? "#8FBF9F" : "#E4998A",
          }}
        >
          {positive ? "+" : ""}
          {formatEuro(saldo)}
        </p>
      </div>
      <div className="flex gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-paper-raised/60 mb-1">
            Entrate
          </p>
          <p className="tabular text-lg font-medium" style={{ color: "#8FBF9F" }}>
            {formatEuro(entrate)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-paper-raised/60 mb-1">
            Uscite
          </p>
          <p className="tabular text-lg font-medium" style={{ color: "#E4998A" }}>
            {formatEuro(uscite)}
          </p>
        </div>
      </div>
    </div>
  );
}
