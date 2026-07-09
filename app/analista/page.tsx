"use client";

import { useEffect, useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { buildAdvice } from "@/lib/advisor";
import AdviceCard from "@/components/AdviceCard";
import {
  averageMonthlyExpense,
  averageSavingsRate,
  emergencyFundMonths,
  formatEuro,
} from "@/lib/format";

export default function AnalistaPage() {
  const [mounted, setMounted] = useState(false);
  const transactions = useLedgerStore((s) => s.transactions);
  const investments = useLedgerStore((s) => s.investments);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8" />;
  }

  const advice = buildAdvice(transactions, investments);
  const avgRate = averageSavingsRate(transactions, 3);
  const avgExpense = averageMonthlyExpense(transactions, 6);
  const fundMonths = emergencyFundMonths(transactions);

  return (
    <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="font-display italic text-3xl text-ink">
          Analista finanziario
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Consigli calcolati sui tuoi movimenti reali — nessun dato lascia il
          tuo browser.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-paper-raised border border-rule rounded-2xl p-4 text-center">
          <p className="text-xs text-ink-soft mb-1">Risparmio medio</p>
          <p className="tabular text-xl text-ink">
            {avgRate !== null ? `${avgRate.toFixed(0)}%` : "—"}
          </p>
        </div>
        <div className="bg-paper-raised border border-rule rounded-2xl p-4 text-center">
          <p className="text-xs text-ink-soft mb-1">Spesa media/mese</p>
          <p className="tabular text-xl text-ink">{formatEuro(avgExpense)}</p>
        </div>
        <div className="bg-paper-raised border border-rule rounded-2xl p-4 text-center">
          <p className="text-xs text-ink-soft mb-1">Fondo emergenza</p>
          <p className="tabular text-xl text-ink">
            {fundMonths !== null ? `${fundMonths.toFixed(1)} mesi` : "—"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {advice.map((a, i) => (
          <AdviceCard key={i} advice={a} />
        ))}
      </div>
    </main>
  );
}
