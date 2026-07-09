"use client";

import { Debt } from "@/lib/types";
import { formatEuro } from "@/lib/format";
import { useLedgerStore } from "@/lib/store";

export default function DebtList({
  debts,
  onEdit,
}: {
  debts: Debt[];
  onEdit: (d: Debt) => void;
}) {
  const removeDebt = useLedgerStore((s) => s.removeDebt);
  const updateDebt = useLedgerStore((s) => s.updateDebt);

  if (debts.length === 0) {
    return (
      <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
        Nessun debito registrato. Aggiungine uno dal modulo qui accanto.
      </div>
    );
  }

  const sorted = [...debts].sort((a, b) => {
    if (a.paid !== b.paid) return a.paid ? 1 : -1;
    return b.date.localeCompare(a.date);
  });

  return (
    <div className="border border-rule rounded-2xl overflow-hidden bg-paper-raised overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-rule text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2 px-4 font-medium">Persona</th>
            <th className="py-2 px-4 font-medium">Nota</th>
            <th className="py-2 px-4 font-medium text-right">Importo</th>
            <th className="py-2 px-4 font-medium text-center">Stato</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d) => (
            <tr
              key={d.id}
              className={`border-b border-rule-soft last:border-0 group ${
                d.paid ? "opacity-50" : ""
              }`}
            >
              <td className="py-2.5 px-4 font-medium">{d.person}</td>
              <td className="py-2.5 px-4 text-ink-soft truncate max-w-[180px]">
                {d.note ?? ""}
              </td>
              <td className="py-2.5 px-4 tabular text-right font-medium text-expense">
                {formatEuro(d.amount)}
              </td>
              <td className="py-2.5 px-4 text-center">
                <button
                  onClick={() => updateDebt(d.id, { paid: !d.paid })}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    d.paid
                      ? "bg-income-soft text-income"
                      : "bg-expense-soft text-expense"
                  }`}
                >
                  {d.paid ? "Pagato" : "Da pagare"}
                </button>
              </td>
              <td className="py-2.5 px-2 text-right whitespace-nowrap">
                <button
                  onClick={() => onEdit(d)}
                  aria-label="Modifica debito"
                  className="text-ink-soft hover:text-ink text-xs px-1.5 opacity-70 hover:opacity-100 transition-opacity"
                >
                  ✎
                </button>
                <button
                  onClick={() => removeDebt(d.id)}
                  aria-label="Elimina debito"
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
