"use client";

import { useEffect, useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { HouseholdExpense } from "@/lib/types";
import HouseholdSalaries from "@/components/HouseholdSalaries";
import HouseholdExpenseList from "@/components/HouseholdExpenseList";
import HouseholdExpenseForm from "@/components/HouseholdExpenseForm";
import HouseholdAnalyst from "@/components/HouseholdAnalyst";
import { formatEuro } from "@/lib/format";

export default function FondoCasaPage() {
  const [mounted, setMounted] = useState(false);
  const householdExpenses = useLedgerStore((s) => s.householdExpenses);
  const householdSalaries = useLedgerStore((s) => s.householdSalaries);
  const [editing, setEditing] = useState<HouseholdExpense | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8" />;
  }

  const total = householdExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="font-display italic text-3xl text-ink">Fondo casa</h1>
        <p className="text-sm text-ink-soft mt-1">
          Spese fisse mensili e quanto versare a testa, in base agli stipendi.
        </p>
      </div>

      <div className="scallop-edge bg-ink text-paper-raised rounded-2xl px-5 sm:px-7 py-5 sm:py-6">
        <p className="text-xs uppercase tracking-[0.2em] text-paper-raised/55 mb-1.5 font-medium">
          Spese fisse totali al mese
        </p>
        <p className="font-display italic text-3xl sm:text-5xl md:text-6xl font-semibold leading-none">
          {formatEuro(total)}
        </p>
      </div>

      <HouseholdSalaries />

      <HouseholdAnalyst salaries={householdSalaries} totalExpenses={total} />

      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <HouseholdExpenseList expenses={householdExpenses} onEdit={setEditing} />
        <HouseholdExpenseForm
          key={editing?.id ?? "new"}
          editing={editing}
          onDone={() => setEditing(null)}
        />
      </div>
    </main>
  );
}
