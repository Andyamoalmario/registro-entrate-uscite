"use client";

import { Transaction } from "@/lib/types";
import { formatEuro } from "@/lib/format";
import { useLedgerStore } from "@/lib/store";

export default function TransactionList({
  transactions,
  onEdit,
}: {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
}) {
  const removeTransaction = useLedgerStore((s) => s.removeTransaction);

  if (transactions.length === 0) {
    return (
      <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
        Nessun movimento questo mese. Aggiungine uno dal modulo qui accanto.
      </div>
    );
  }

  return (
    <div className="border border-rule rounded-2xl overflow-hidden bg-paper-raised overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-rule text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2 px-4 font-medium">Data</th>
            <th className="py-2 px-4 font-medium">Categoria</th>
            <th className="py-2 px-4 font-medium">Nota</th>
            <th className="py-2 px-4 font-medium text-right">Importo</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-rule-soft last:border-0 group">
              <td className="py-2.5 px-4 tabular text-ink-soft">
                {t.date.slice(8, 10)}/{t.date.slice(5, 7)}
              </td>
              <td className="py-2.5 px-4">{t.category}</td>
              <td className="py-2.5 px-4 text-ink-soft truncate max-w-[160px]">
                {t.note ?? ""}
              </td>
              <td
                className={`py-2.5 px-4 tabular text-right font-medium ${
                  t.kind === "entrata" ? "text-income" : "text-expense"
                }`}
              >
                {t.kind === "entrata" ? "+" : "-"}
                {formatEuro(t.amount)}
              </td>
              <td className="py-2.5 px-2 text-right whitespace-nowrap">
                <button
                  onClick={() => onEdit(t)}
                  aria-label="Modifica movimento"
                  className="text-ink-soft hover:text-ink text-xs px-1.5 opacity-70 hover:opacity-100 transition-opacity"
                >
                  ✎
                </button>
                <button
                  onClick={() => removeTransaction(t.id)}
                  aria-label="Elimina movimento"
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
