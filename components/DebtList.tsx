"use client";

import { useState } from "react";
import { DebtEntry, DEBT_TYPE_LABELS } from "@/lib/types";
import { formatEuro, personBalances } from "@/lib/format";
import { useLedgerStore } from "@/lib/store";

export default function DebtList({
  debts,
  onEdit,
}: {
  debts: DebtEntry[];
  onEdit: (d: DebtEntry) => void;
}) {
  const removeDebt = useLedgerStore((s) => s.removeDebt);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (debts.length === 0) {
    return (
      <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
        Nessuna voce registrata. Aggiungine una dal modulo qui accanto.
      </div>
    );
  }

  const balances = personBalances(debts);

  return (
    <div className="space-y-3">
      {balances.map((b) => {
        const isOpen = expanded === b.person;
        const positive = b.net > 0;
        const settled = Math.abs(b.net) < 0.005;
        return (
          <div
            key={b.person}
            className="border border-rule rounded-2xl overflow-hidden bg-paper-raised"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : b.person)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="font-medium text-ink">{b.person}</p>
                <p className="text-xs text-ink-soft">
                  {settled
                    ? "In pari"
                    : positive
                    ? "Ti deve"
                    : "Gli devi"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="tabular text-lg font-medium"
                  style={{
                    color: settled
                      ? "var(--ink-soft)"
                      : positive
                      ? "var(--income)"
                      : "var(--expense)",
                  }}
                >
                  {formatEuro(Math.abs(b.net))}
                </span>
                <span className="text-ink-soft text-xs">{isOpen ? "▲" : "▼"}</span>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-rule-soft">
                {b.entries.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between px-4 py-2.5 border-b border-rule-soft last:border-0 text-sm group"
                  >
                    <div>
                      <p className="text-ink-soft text-xs">
                        {DEBT_TYPE_LABELS[e.type]} · {e.date.slice(8, 10)}/
                        {e.date.slice(5, 7)}/{e.date.slice(0, 4)}
                      </p>
                      {e.note && <p className="text-ink-soft text-xs">{e.note}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="tabular font-medium">
                        {formatEuro(e.amount)}
                      </span>
                      <button
                        onClick={() => onEdit(e)}
                        aria-label="Modifica voce"
                        className="text-ink-soft hover:text-ink text-xs px-1 opacity-70 hover:opacity-100"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => removeDebt(e.id)}
                        aria-label="Elimina voce"
                        className="text-ink-soft hover:text-expense text-xs px-1 opacity-70 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
