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
    <div className="scallop-edge bg-ink text-paper-raised rounded-2xl px-7 py-6 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1.5 font-medium">
          Saldo · {monthLabel}
        </p>
        <p
          className="font-display italic text-5xl sm:text-6xl font-semibold leading-none"
          style={{ color: positive ? "#8FD1AC" : "#F0A8C0" }}
        >
          {positive ? "+" : ""}
          {formatEuro(saldo)}
        </p>
      </div>
      <div className="flex gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1 font-medium">
            Entrate
          </p>
          <p className="tabular text-lg" style={{ color: "#8FD1AC" }}>
            {formatEuro(entrate)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1 font-medium">
            Uscite
          </p>
          <p className="tabular text-lg" style={{ color: "#F0A8C0" }}>
            {formatEuro(uscite)}
          </p>
        </div>
      </div>
    </div>
  );
}
