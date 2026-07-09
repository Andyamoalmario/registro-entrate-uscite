"use client";

import { calendarGrid, dailyTotals, formatEuro, monthLabel } from "@/lib/format";
import { Transaction } from "@/lib/types";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export default function CalendarGrid({
  transactions,
  year,
  monthIndex,
  onPrevMonth,
  onNextMonth,
  selectedDate,
  onSelectDate,
}: {
  transactions: Transaction[];
  year: number;
  monthIndex: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  const cells = calendarGrid(year, monthIndex);
  const totals = dailyTotals(transactions, monthKey);
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          aria-label="Mese precedente"
          className="text-ink-soft hover:text-ink px-2 py-1"
        >
          ‹
        </button>
        <p className="font-display italic text-xl text-ink capitalize">
          {monthLabel(monthKey)}
        </p>
        <button
          onClick={onNextMonth}
          aria-label="Mese successivo"
          className="text-ink-soft hover:text-ink px-2 py-1"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[11px] text-ink-soft font-medium">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => {
          const dayTotals = totals.get(cell.date);
          const selected = cell.date === selectedDate;
          const isToday = cell.date === todayStr;
          const positive = dayTotals ? dayTotals.saldo >= 0 : true;

          return (
            <button
              key={cell.date}
              onClick={() => onSelectDate(cell.date)}
              className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center text-xs transition-colors border ${
                selected
                  ? "border-ink"
                  : isToday
                  ? "border-invest"
                  : "border-transparent"
              } ${cell.inMonth ? "text-ink" : "text-ink-soft/40"}`}
              style={{
                background: !cell.inMonth
                  ? "transparent"
                  : dayTotals
                  ? positive
                    ? "var(--income-soft)"
                    : "var(--expense-soft)"
                  : "var(--paper)",
              }}
            >
              <span>{cell.day}</span>
              {dayTotals && cell.inMonth && (
                <span
                  className="tabular text-[9px] leading-none mt-0.5"
                  style={{ color: positive ? "var(--income)" : "var(--expense)" }}
                >
                  {formatEuro(dayTotals.saldo).replace("€", "").trim()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
