"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import MonthSelector from "@/components/MonthSelector";
import BalanceStrip from "@/components/BalanceStrip";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import CategoryDonut from "@/components/CategoryDonut";
import { useLedgerStore } from "@/lib/store";
import {
  allMonthKeys,
  categoryBreakdown,
  currentMonthKey,
  lastNMonthsData,
  monthLabel,
  monthTotals,
  transactionsForMonth,
} from "@/lib/format";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const transactions = useLedgerStore((s) => s.transactions);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Nav />
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8" />
      </>
    );
  }

  const monthKeys = allMonthKeys(transactions);
  const monthTx = transactionsForMonth(transactions, selectedMonth);
  const totals = monthTotals(monthTx);
  const chartData = lastNMonthsData(transactions, 6);
  const expenseBreakdown = categoryBreakdown(monthTx, "uscita");

  return (
    <>
      <Nav />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
        <MonthSelector
          keys={monthKeys}
          selected={selectedMonth}
          onSelect={setSelectedMonth}
        />

        <BalanceStrip
          entrate={totals.entrate}
          uscite={totals.uscite}
          saldo={totals.saldo}
          monthLabel={monthLabel(selectedMonth)}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <MonthlyBarChart data={chartData} />
          <CategoryDonut data={expenseBreakdown} />
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
          <TransactionList transactions={monthTx} />
          <TransactionForm defaultMonth={selectedMonth} />
        </div>
      </main>
    </>
  );
}
