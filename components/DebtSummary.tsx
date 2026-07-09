"use client";

import { formatEuro } from "@/lib/format";

export default function DebtSummary({
  owedByMe,
  owedToMe,
}: {
  owedByMe: number;
  owedToMe: number;
}) {
  return (
    <div className="scallop-edge bg-ink text-paper-raised rounded-2xl px-5 sm:px-7 py-5 sm:py-6 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1.5 font-medium">
          Devi in totale
        </p>
        <p
          className="font-display italic text-3xl sm:text-5xl md:text-6xl font-semibold leading-none"
          style={{ color: "#F0A8C0" }}
        >
          {formatEuro(owedByMe)}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1 font-medium">
          Ti devono in totale
        </p>
        <p className="tabular text-lg" style={{ color: "#8FD1AC" }}>
          {formatEuro(owedToMe)}
        </p>
      </div>
    </div>
  );
}
