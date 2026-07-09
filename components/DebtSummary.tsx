"use client";

import { formatEuro } from "@/lib/format";

export default function DebtSummary({
  outstanding,
  paid,
}: {
  outstanding: number;
  paid: number;
}) {
  return (
    <div className="scallop-edge bg-ink text-paper-raised rounded-2xl px-5 sm:px-7 py-5 sm:py-6 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1.5 font-medium">
          Ancora da restituire
        </p>
        <p
          className="font-display italic text-3xl sm:text-5xl md:text-6xl font-semibold leading-none"
          style={{ color: "#F0A8C0" }}
        >
          {formatEuro(outstanding)}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1 font-medium">
          Già restituiti
        </p>
        <p className="tabular text-lg" style={{ color: "#8FD1AC" }}>
          {formatEuro(paid)}
        </p>
      </div>
    </div>
  );
}
