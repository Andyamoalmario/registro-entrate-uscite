"use client";

import { useEffect, useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { Transaction } from "@/lib/types";
import CalendarGrid from "@/components/CalendarGrid";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { transactionsForDay } from "@/lib/format";

export default function CalendarioPage() {
  const [mounted, setMounted] = useState(false);
  const transactions = useLedgerStore((s) => s.transactions);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    now.toISOString().slice(0, 10)
  );
  const [editing, setEditing] = useState<Transaction | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8" />;
  }

  function prevMonth() {
    setEditing(null);
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  }

  function nextMonth() {
    setEditing(null);
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  }

  const dayTransactions = selectedDate ? transactionsForDay(transactions, selectedDate) : [];
  const [dy, dm, dd] = selectedDate ? selectedDate.split("-") : [];

  return (
    <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <h1 className="font-display italic text-3xl text-ink">Calendario</h1>

      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <CalendarGrid
          transactions={transactions}
          year={year}
          monthIndex={monthIndex}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setEditing(null);
          }}
        />

        <TransactionForm
          key={editing?.id ?? selectedDate ?? "new"}
          editing={editing}
          defaultDate={selectedDate ?? undefined}
          onDone={() => setEditing(null)}
        />
      </div>

      {selectedDate && (
        <div>
          <p className="text-sm text-ink-soft mb-2">
            Movimenti del {dd}/{dm}/{dy}
          </p>
          <TransactionList transactions={dayTransactions} onEdit={setEditing} />
        </div>
      )}
    </main>
  );
}
