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

  if (expenses.length === 0) {
    return (
      <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
        Nessuna spesa fissa registrata. Aggiungine una dal modulo qui accanto.
      </div>
    );
  }

  return (
    <div className="border border-rule rounded-2xl overflow-hidden bg-paper-raised overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="border-b border-rule text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2 px-4 font-medium">Voce</th>
            <th className="py-2 px-4 font-medium">Nota</th>
            <th className="py-2 px-4 font-medium text-right">Importo/mese</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-b border-rule-soft last:border-0 group">
              <td className="py-2.5 px-4 font-medium">{e.name}</td>
              <td className="py-2.5 px-4 text-ink-soft truncate max-w-[180px]">
                {e.note ?? ""}
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
