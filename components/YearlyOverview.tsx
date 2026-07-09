"use client";

import { useState } from "react";
import { YearMonthSummary, formatEuro, yearlyOverview } from "@/lib/format";
import { Transaction } from "@/lib/types";

export default function YearlyOverview({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [year, setYear] = useState(new Date().getFullYear());
  const months: YearMonthSummary[] = yearlyOverview(transactions, year);

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">
          Panoramica annuale
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setYear((y) => y - 1)}
            aria-label="Anno precedente"
            className="text-ink-soft hover:text-ink px-1"
          >
            ‹
          </button>
          <span className="tabular text-sm text-ink">{year}</span>
          <button
            onClick={() => setYear((y) => y + 1)}
            aria-label="Anno successivo"
            className="text-ink-soft hover:text-ink px-1"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {months.map((m) => {
          const hasData = m.entrate > 0 || m.uscite > 0;
          const positive = m.saldo >= 0;
          return (
            <div
              key={m.key}
              className="rounded-xl p-3 border border-rule-soft"
              style={{
                background: !hasData
                  ? "var(--paper)"
                  : positive
                  ? "var(--income-soft)"
                  : "var(--expense-soft)",
              }}
            >
              <p className="text-xs text-ink-soft mb-1">{m.label}</p>
              <p
                className="tabular text-sm font-medium"
                style={{
                  color: !hasData
                    ? "var(--ink-soft)"
                    : positive
                    ? "var(--income)"
                    : "var(--expense)",
                }}
              >
                {hasData ? formatEuro(m.saldo) : "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
