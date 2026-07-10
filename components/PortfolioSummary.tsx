"use client";

import { formatEuro } from "@/lib/format";

export default function PortfolioSummary({
  invested,
  current,
}: {
  invested: number;
  current: number;
}) {
  const gain = current - invested;
  const pct = invested > 0 ? (gain / invested) * 100 : 0;
  const positive = gain >= 0;

  return (
    <div className="scallop-edge bg-ink text-paper-raised rounded-2xl px-5 sm:px-7 py-5 sm:py-6 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1.5 font-medium">
          Valore portafoglio
        </p>
        <p
          className="font-display italic text-3xl sm:text-5xl md:text-6xl font-semibold leading-none"
          style={{ color: "var(--invest-bright)" }}
        >
          {formatEuro(current)}
        </p>
      </div>
      <div className="flex gap-4 sm:gap-8 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1 font-medium">
            Capitale investito
          </p>
          <p className="tabular text-lg text-paper-raised/90">
            {formatEuro(invested)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1 font-medium">
            Guadagno/Perdita
          </p>
          <p
            className="tabular text-lg"
            style={{ color: positive ? "var(--income-bright)" : "var(--expense-bright)" }}
          >
            {positive ? "+" : ""}
            {formatEuro(gain)} ({positive ? "+" : ""}
            {pct.toFixed(1)}%)
          </p>
        </div>
      </div>
    </div>
  );
}
