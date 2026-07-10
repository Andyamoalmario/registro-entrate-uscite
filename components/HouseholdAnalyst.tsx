"use client";

import { HouseholdSalaries } from "@/lib/types";
import { formatEuro, householdSettlement } from "@/lib/format";
import { HouseholdExpense } from "@/lib/types";

export default function HouseholdAnalyst({
  salaries,
  expenses,
}: {
  salaries: HouseholdSalaries;
  expenses: HouseholdExpense[];
}) {
  const { total, split, paid1, paid2, balance } = householdSettlement(
    expenses,
    salaries
  );

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

  const settled = Math.abs(balance) < 0.5;

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-4">
        Analista fondo casa
      </p>
      <p className="text-sm text-ink-soft mb-4">
        Per coprire {formatEuro(total)} di spese fisse al mese, versate entrambi lo
        stesso{" "}
        <span className="tabular font-semibold text-ink">
          {split.sharedPct.toFixed(1)}%
        </span>{" "}
        del vostro stipendio netto nel fondo comune.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl p-4" style={{ background: "var(--accent-soft)" }}>
          <p className="text-sm font-medium text-ink">{salaries.person1Name}</p>
          <p className="tabular text-2xl font-semibold text-ink mt-1">
            {formatEuro(split.amount1)}
          </p>
          <p className="text-xs text-ink-soft mt-1">
            {split.sharedPct.toFixed(1)}% di {formatEuro(salaries.person1Salary)}
          </p>
          <p className="text-xs text-ink-soft mt-2 pt-2 border-t border-rule-soft">
            Ha pagato finora:{" "}
            <span className="tabular font-medium">{formatEuro(paid1)}</span>
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--invest-soft)" }}>
          <p className="text-sm font-medium text-ink">{salaries.person2Name}</p>
          <p className="tabular text-2xl font-semibold text-ink mt-1">
            {formatEuro(split.amount2)}
          </p>
          <p className="text-xs text-ink-soft mt-1">
            {split.sharedPct.toFixed(1)}% di {formatEuro(salaries.person2Salary)}
          </p>
          <p className="text-xs text-ink-soft mt-2 pt-2 border-t border-rule-soft">
            Ha pagato finora:{" "}
            <span className="tabular font-medium">{formatEuro(paid2)}</span>
          </p>
        </div>
      </div>

      <div
        className="rounded-xl p-4 text-sm"
        style={{
          background: settled ? "var(--income-soft)" : "var(--expense-soft)",
          color: settled ? "var(--income)" : "var(--expense)",
        }}
      >
        {settled ? (
          <span>I conti sono in pari — nessuno deve nulla all&rsquo;altro.</span>
        ) : balance > 0 ? (
          <span>
            <strong>{salaries.person2Name}</strong> deve dare{" "}
            <strong className="tabular">{formatEuro(balance)}</strong> a{" "}
            <strong>{salaries.person1Name}</strong> per pareggiare le quote.
          </span>
        ) : (
          <span>
            <strong>{salaries.person1Name}</strong> deve dare{" "}
            <strong className="tabular">{formatEuro(-balance)}</strong> a{" "}
            <strong>{salaries.person2Name}</strong> per pareggiare le quote.
          </span>
        )}
      </div>
    </div>
  );
}
