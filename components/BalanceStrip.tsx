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
    <div className="scallop-edge bg-ink text-paper-raised rounded-2xl px-5 sm:px-7 py-5 sm:py-6 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1.5 font-medium">
          Saldo · {monthLabel}
        </p>
        <p
          className="font-display italic text-3xl sm:text-5xl md:text-6xl font-semibold leading-none"
          style={{ color: positive ? "var(--income-bright)" : "var(--expense-bright)" }}
        >
          {positive ? "+" : ""}
          {formatEuro(saldo)}
        </p>
      </div>
      <div className="flex gap-4 sm:gap-8 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1 font-medium">
            Entrate
          </p>
          <p className="tabular text-lg" style={{ color: "var(--income-bright)" }}>
            {formatEuro(entrate)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1 font-medium">
            Uscite
          </p>
          <p className="tabular text-lg" style={{ color: "var(--expense-bright)" }}>
            {formatEuro(uscite)}
          </p>
        </div>
      </div>
    </div>
  );
}
