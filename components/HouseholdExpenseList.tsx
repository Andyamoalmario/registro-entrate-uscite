"use client";

import { HouseholdExpense } from "@/lib/types";
import { formatEuro } from "@/lib/format";
import { useLedgerStore } from "@/lib/store";

export default function HouseholdExpenseList({
  expenses,
  onEdit,
}: {
  expenses: HouseholdExpense[];
  onEdit: (e: HouseholdExpense) => void;
}) {
  const removeHouseholdExpense = useLedgerStore((s) => s.removeHouseholdExpense);
  const salaries = useLedgerStore((s) => s.householdSalaries);

  if (expenses.length === 0) {
    return (
      <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
        Nessuna spesa registrata questo mese. Aggiungine una dal modulo qui accanto.
      </div>
    );
  }

  const nameFor = (e: HouseholdExpense) =>
    (e.paidBy ?? "person1") === "person1"
      ? salaries.person1Name || "Tu"
      : salaries.person2Name;

  return (
    <div className="border border-rule rounded-2xl overflow-hidden bg-paper-raised overflow-x-auto">
      <table className="w-full min-w-[580px] text-sm">
        <thead>
          <tr className="border-b border-rule text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2 px-4 font-medium">Data</th>
            <th className="py-2 px-4 font-medium">Voce</th>
            <th className="py-2 px-4 font-medium">Pagato da</th>
            <th className="py-2 px-4 font-medium text-right">Importo</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-b border-rule-soft last:border-0 group">
              <td className="py-2.5 px-4 tabular text-ink-soft">
                {e.date ? `${e.date.slice(8, 10)}/${e.date.slice(5, 7)}` : "—"}
              </td>
              <td className="py-2.5 px-4 font-medium">
                {e.name}
                {e.note && (
                  <span className="block text-xs text-ink-soft font-normal">
                    {e.note}
                  </span>
                )}
              </td>
              <td className="py-2.5 px-4">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background:
                      (e.paidBy ?? "person1") === "person1"
                        ? "var(--accent-soft)"
                        : "var(--invest-soft)",
                    color: "var(--ink)",
                  }}
                >
                  {nameFor(e)}
                </span>
              </td>
              <td className="py-2.5 px-4 tabular text-right font-medium text-ink">
                {formatEuro(e.amount)}
              </td>
              <td className="py-2.5 px-2 text-right whitespace-nowrap">
                <button
                  onClick={() => onEdit(e)}
                  aria-label="Modifica spesa"
                  className="text-ink-soft hover:text-ink text-xs px-1.5 opacity-70 hover:opacity-100 transition-opacity"
                >
                  ✎
                </button>
                <button
                  onClick={() => removeHouseholdExpense(e.id)}
                  aria-label="Elimina spesa"
                  className="text-ink-soft hover:text-expense text-xs px-1.5 opacity-70 hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
