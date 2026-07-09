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
    <div className="torn-edge bg-ink text-paper-raised rounded-sm px-6 py-5 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-paper-raised/60 mb-1">
          Valore portafoglio
        </p>
        <p className="tabular text-4xl sm:text-5xl font-semibold" style={{ color: "#E8D89A" }}>
          {formatEuro(current)}
        </p>
      </div>
      <div className="flex gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-paper-raised/60 mb-1">
            Capitale investito
          </p>
          <p className="tabular text-lg font-medium text-paper-raised/90">
            {formatEuro(invested)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-paper-raised/60 mb-1">
            Guadagno/Perdita
          </p>
          <p
            className="tabular text-lg font-medium"
            style={{ color: positive ? "#8FBF9F" : "#E4998A" }}
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
