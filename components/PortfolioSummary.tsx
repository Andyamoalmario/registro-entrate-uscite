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
    <div className="scallop-edge bg-ink text-paper-raised rounded-2xl px-7 py-6 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1.5 font-medium">
          Valore portafoglio
        </p>
        <p
          className="font-display italic text-5xl sm:text-6xl font-semibold leading-none"
          style={{ color: "#F0D46B" }}
        >
          {formatEuro(current)}
        </p>
      </div>
      <div className="flex gap-8">
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
            style={{ color: positive ? "#8FD1AC" : "#F0A8C0" }}
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
