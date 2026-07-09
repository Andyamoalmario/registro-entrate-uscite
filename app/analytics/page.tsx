"use client";

import { useEffect, useState } from "react";
import { useLedgerStore } from "@/lib/store";
import {
  allTimeCategoryBreakdown,
  averageMonthlyExpense,
  categoryTrends,
  compareToLastMonth,
  formatEuro,
  largestExpense,
} from "@/lib/format";

const CHIP_COLORS = ["#E08FA0", "#7FB6D9", "#6FB88F", "#E0B84A", "#A78FD1", "#E8A87C"];

function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-3">{label}</p>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const transactions = useLedgerStore((s) => s.transactions);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8" />;
  }

  if (transactions.length === 0) {
    return (
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="font-display italic text-3xl text-ink mb-4">Analytics</h1>
        <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
          Aggiungi qualche movimento nel Registro per iniziare a vedere le
          analisi qui.
        </div>
      </main>
    );
  }

  const comparison = compareToLastMonth(transactions);
  const trends = categoryTrends(transactions);
  const growing = trends.filter((t) => t.delta > 0).slice(0, 3);
  const shrinking = trends.filter((t) => t.delta < 0).slice(-3).reverse();
  const topCategories = allTimeCategoryBreakdown(transactions, "uscita", 6);
  const avgMonthly = averageMonthlyExpense(transactions, 6);
  const biggest = largestExpense(transactions);
  const maxCategoryTotal = topCategories[0]?.total ?? 1;

  return (
    <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <h1 className="font-display italic text-3xl text-ink">Analytics</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card label={`Uscite: ${comparison.currentLabel} vs ${comparison.previousLabel}`}>
          <p className="font-display text-3xl text-ink">
            {formatEuro(comparison.currentUscite)}
          </p>
          {comparison.deltaPct !== null ? (
            <p
              className="tabular text-sm mt-1"
              style={{ color: comparison.deltaPct > 0 ? "#E08FA0" : "#6FB88F" }}
            >
              {comparison.deltaPct > 0 ? "+" : ""}
              {comparison.deltaPct.toFixed(1)}% rispetto al mese scorso
            </p>
          ) : (
            <p className="text-sm text-ink-soft mt-1">
              Nessun dato per il mese scorso
            </p>
          )}
        </Card>

        <Card label="Spesa media mensile (ultimi 6 mesi)">
          <p className="font-display text-3xl text-ink">{formatEuro(avgMonthly)}</p>
          <p className="text-sm text-ink-soft mt-1">al mese, in media</p>
        </Card>

        <Card label="Spesa singola più alta">
          {biggest ? (
            <>
              <p className="font-display text-3xl text-ink">
                {formatEuro(biggest.amount)}
              </p>
              <p className="text-sm text-ink-soft mt-1">
                {biggest.category} · {biggest.date.slice(8, 10)}/
                {biggest.date.slice(5, 7)}/{biggest.date.slice(0, 4)}
              </p>
            </>
          ) : (
            <p className="text-sm text-ink-soft">Nessuna uscita registrata</p>
          )}
        </Card>
      </div>

      <Card label="Dove hai speso di più (ultimi 6 mesi)">
        {topCategories.length === 0 ? (
          <p className="text-sm text-ink-soft">Nessuna uscita negli ultimi 6 mesi.</p>
        ) : (
          <div className="space-y-3">
            {topCategories.slice(0, 8).map((c, i) => (
              <div key={c.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.category}</span>
                  <span className="tabular text-ink-soft">{formatEuro(c.total)}</span>
                </div>
                <div className="h-2 rounded-full bg-rule-soft overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(4, (c.total / maxCategoryTotal) * 100)}%`,
                      background: CHIP_COLORS[i % CHIP_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card label="Categorie in crescita — valuta se ridurre qui">
          {growing.length === 0 ? (
            <p className="text-sm text-ink-soft">
              Nessuna categoria in aumento rispetto al mese scorso.
            </p>
          ) : (
            <ul className="space-y-2">
              {growing.map((t) => (
                <li key={t.category} className="flex justify-between text-sm">
                  <span>{t.category}</span>
                  <span className="tabular" style={{ color: "#E08FA0" }}>
                    +{formatEuro(t.delta)}
                    {t.deltaPct !== null ? ` (+${t.deltaPct.toFixed(0)}%)` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card label="Categorie in calo — bel lavoro">
          {shrinking.length === 0 ? (
            <p className="text-sm text-ink-soft">
              Nessuna categoria in calo rispetto al mese scorso.
            </p>
          ) : (
            <ul className="space-y-2">
              {shrinking.map((t) => (
                <li key={t.category} className="flex justify-between text-sm">
                  <span>{t.category}</span>
                  <span className="tabular" style={{ color: "#6FB88F" }}>
                    {formatEuro(t.delta)}
                    {t.deltaPct !== null ? ` (${t.deltaPct.toFixed(0)}%)` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}
