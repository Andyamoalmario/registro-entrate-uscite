"use client";

import { HouseholdSalaries } from "@/lib/types";
import { formatEuro, householdSplit } from "@/lib/format";

export default function HouseholdAnalyst({
  salaries,
  totalExpenses,
}: {
  salaries: HouseholdSalaries;
  totalExpenses: number;
}) {
  const split = householdSplit(salaries, totalExpenses);

  if (!split) {
    return (
      <div className="bg-paper-raised border border-rule rounded-2xl p-5">
        <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-3">
          Analista fondo casa
        </p>
        <p className="text-sm text-ink-soft">
          Inserisci entrambi gli stipendi per calcolare quanto dovrebbe versare
          ciascuno, in proporzione a quanto guadagna.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-4">
        Analista fondo casa
      </p>
      <p className="text-sm text-ink-soft mb-4">
        Spese fisse totali: <span className="tabular font-medium text-ink">{formatEuro(totalExpenses)}</span>{" "}
        al mese, divise in proporzione allo stipendio di ciascuno.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--accent-soft)" }}>
          <p className="text-sm font-medium text-ink">{salaries.person1Name}</p>
          <p className="tabular text-2xl font-semibold text-ink mt-1">
            {formatEuro(split.amount1)}
          </p>
          <p className="text-xs text-ink-soft mt-1">
            {split.pct1.toFixed(0)}% del reddito familiare
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--accent-soft)" }}>
          <p className="text-sm font-medium text-ink">{salaries.person2Name}</p>
          <p className="tabular text-2xl font-semibold text-ink mt-1">
            {formatEuro(split.amount2)}
          </p>
          <p className="text-xs text-ink-soft mt-1">
            {split.pct2.toFixed(0)}% del reddito familiare
          </p>
        </div>
      </div>
    </div>
  );
}
