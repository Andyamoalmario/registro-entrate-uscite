"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { formatEuro, todayISO } from "@/lib/format";

export default function ImportFromFondoCasa({
  defaultDate,
}: {
  defaultDate?: string;
}) {
  const expenses = useLedgerStore((s) => s.householdExpenses);
  const addTransaction = useLedgerStore((s) => s.addTransaction);
  const [selectedId, setSelectedId] = useState("");

  if (expenses.length === 0) return null;

  function handleImport() {
    const e = expenses.find((exp) => exp.id === selectedId);
    if (!e) return;
    addTransaction({
      kind: "uscita",
      amount: e.amount,
      category: e.name,
      date: defaultDate ?? todayISO(),
      note: e.note ? `Fondo casa — ${e.note}` : "Fondo casa",
    });
    setSelectedId("");
  }

  return (
    <div className="bg-paper-raised border border-dashed border-rule rounded-2xl p-4">
      <p className="text-xs uppercase tracking-widest text-ink-soft mb-3">
        Importa una spesa fissa dal Fondo Casa
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink text-sm"
        >
          <option value="">Scegli una spesa fissa da importare...</option>
          {expenses.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} — {formatEuro(e.amount)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleImport}
          disabled={!selectedId}
          className="px-4 py-2 rounded-xl bg-ink text-paper-raised text-sm font-medium disabled:opacity-40 shrink-0"
        >
          Importa
        </button>
      </div>
    </div>
  );
}
