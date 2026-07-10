"use client";

import type { ReactNode } from "react";
import { useLedgerStore } from "@/lib/store";
import BalanceStrip from "@/components/BalanceStrip";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import CategoryDonut from "@/components/CategoryDonut";
import YearlyOverview from "@/components/YearlyOverview";
import PortfolioSummary from "@/components/PortfolioSummary";
import DebtSummary from "@/components/DebtSummary";
import AdviceCard from "@/components/AdviceCard";
import { buildAdvice } from "@/lib/advisor";
import {
  allTimeCategoryBreakdown,
  categoryBreakdown,
  currentMonthKey,
  debtTotals,
  formatEuro,
  householdSettlement,
  lastNMonthsData,
  monthLabel,
  monthTotals,
  transactionsForMonth,
} from "@/lib/format";

function SaldoMeseWidget() {
  const transactions = useLedgerStore((s) => s.transactions);
  const key = currentMonthKey();
  const totals = monthTotals(transactionsForMonth(transactions, key));
  return (
    <BalanceStrip
      entrate={totals.entrate}
      uscite={totals.uscite}
      saldo={totals.saldo}
      monthLabel={monthLabel(key)}
    />
  );
}

function GraficoMensileWidget() {
  const transactions = useLedgerStore((s) => s.transactions);
  return <MonthlyBarChart data={lastNMonthsData(transactions, 6)} />;
}

function CategorieUsciteWidget() {
  const transactions = useLedgerStore((s) => s.transactions);
  const key = currentMonthKey();
  return (
    <CategoryDonut
      data={categoryBreakdown(transactionsForMonth(transactions, key), "uscita")}
    />
  );
}

function PanoramicaAnnualeWidget() {
  const transactions = useLedgerStore((s) => s.transactions);
  return <YearlyOverview transactions={transactions} />;
}

function TopCategorieWidget() {
  const transactions = useLedgerStore((s) => s.transactions);
  const top = allTimeCategoryBreakdown(transactions, "uscita", 6).slice(0, 5);
  const max = top[0]?.total ?? 1;
  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-3">
        Top categorie di spesa (6 mesi)
      </p>
      {top.length === 0 ? (
        <p className="text-sm text-ink-soft">Nessuna uscita registrata.</p>
      ) : (
        <div className="space-y-2.5">
          {top.map((c) => (
            <div key={c.category}>
              <div className="flex justify-between text-sm mb-1">
                <span>{c.category}</span>
                <span className="tabular text-ink-soft">{formatEuro(c.total)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-rule-soft overflow-hidden">
                <div
                  className="h-full rounded-full bg-expense"
                  style={{ width: `${Math.max(4, (c.total / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PortafoglioWidget() {
  const investments = useLedgerStore((s) => s.investments);
  const invested = investments.reduce((sum, i) => sum + i.invested, 0);
  const current = investments.reduce((sum, i) => sum + i.currentValue, 0);
  return <PortfolioSummary invested={invested} current={current} />;
}

function DebitiWidget() {
  const debts = useLedgerStore((s) => s.debts);
  const totals = debtTotals(debts);
  return <DebtSummary owedByMe={totals.owedByMe} owedToMe={totals.owedToMe} />;
}

function FondoCasaWidget() {
  const expenses = useLedgerStore((s) => s.householdExpenses);
  const salaries = useLedgerStore((s) => s.householdSalaries);
  const { total, split, balance } = householdSettlement(expenses, salaries);
  const settled = Math.abs(balance) < 0.5;
  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-3">
        Fondo casa
      </p>
      <p className="tabular text-2xl text-ink font-medium">{formatEuro(total)}</p>
      <p className="text-xs text-ink-soft mt-0.5">spese fisse al mese</p>
      {split && (
        <>
          <p className="text-xs text-ink-soft mt-3">
            Versate entrambi il {split.sharedPct.toFixed(1)}% dello stipendio
          </p>
          <p
            className="text-xs mt-2 pt-2 border-t border-rule-soft"
            style={{ color: settled ? "var(--income)" : "var(--expense)" }}
          >
            {settled
              ? "Conti in pari"
              : balance > 0
              ? `${salaries.person2Name} deve ${formatEuro(balance)} a ${salaries.person1Name}`
              : `${salaries.person1Name} deve ${formatEuro(-balance)} a ${salaries.person2Name}`}
          </p>
        </>
      )}
    </div>
  );
}

function ConsigliWidget() {
  const transactions = useLedgerStore((s) => s.transactions);
  const investments = useLedgerStore((s) => s.investments);
  const advice = buildAdvice(transactions, investments).slice(0, 2);
  return (
    <div className="space-y-3">
      {advice.map((a, i) => (
        <AdviceCard key={i} advice={a} />
      ))}
    </div>
  );
}

export interface WidgetDef {
  id: string;
  label: string;
  defaultW: number;
  defaultH: number;
  render: () => ReactNode;
}

export const WIDGETS: WidgetDef[] = [
  { id: "saldo-mese", label: "Saldo del mese", defaultW: 4, defaultH: 2, render: () => <SaldoMeseWidget /> },
  {
    id: "grafico-mensile",
    label: "Grafico entrate/uscite",
    defaultW: 2,
    defaultH: 4,
    render: () => <GraficoMensileWidget />,
  },
  {
    id: "categorie-uscite",
    label: "Uscite per categoria",
    defaultW: 2,
    defaultH: 4,
    render: () => <CategorieUsciteWidget />,
  },
  {
    id: "panoramica-annuale",
    label: "Panoramica annuale",
    defaultW: 4,
    defaultH: 3,
    render: () => <PanoramicaAnnualeWidget />,
  },
  {
    id: "top-categorie",
    label: "Top categorie di spesa",
    defaultW: 2,
    defaultH: 4,
    render: () => <TopCategorieWidget />,
  },
  {
    id: "portafoglio",
    label: "Portafoglio investimenti",
    defaultW: 4,
    defaultH: 2,
    render: () => <PortafoglioWidget />,
  },
  { id: "debiti", label: "Debiti e crediti", defaultW: 4, defaultH: 2, render: () => <DebitiWidget /> },
  { id: "fondo-casa", label: "Fondo casa", defaultW: 2, defaultH: 3, render: () => <FondoCasaWidget /> },
  {
    id: "consigli",
    label: "Consigli dell'analista",
    defaultW: 2,
    defaultH: 3,
    render: () => <ConsigliWidget />,
  },
];
