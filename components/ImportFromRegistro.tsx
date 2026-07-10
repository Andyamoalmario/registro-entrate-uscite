"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { formatEuro } from "@/lib/format";

export default function ImportFromRegistro() {
  const transactions = useLedgerStore((s) => s.transactions);
  const addHouseholdExpense = useLedgerStore((s) => s.addHouseholdExpense);
  const [selectedId, setSelectedId] = useState("");

  const uscite = [...transactions]
    .filter((t) => t.kind === "uscita")
    .sort((a, b) => b.date.localeCompare(a.date));

  if (uscite.length === 0) return null;

  function handleImport() {
    const t = uscite.find((tx) => tx.id === selectedId);
    if (!t) return;
    addHouseholdExpense({
      name: t.category,
      amount: t.amount,
      note: `Importato dal Registro${t.note ? " — " + t.note : ""} (${t.date.slice(
        8,
        10
      )}/${t.date.slice(5, 7)}/${t.date.slice(0, 4)})`,
    });
    setSelectedId("");
  }

  return (
    <div className="bg-paper-raised border border-dashed border-rule rounded-2xl p-4">
      <p className="text-xs uppercase tracking-widest text-ink-soft mb-3">
        Importa una spesa dal Registro
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink text-sm"
        >
          <option value="">Scegli un&rsquo;uscita da importare...</option>
          {uscite.map((t) => (
            <option key={t.id} value={t.id}>
              {t.category} — {formatEuro(t.amount)} ({t.date.slice(8, 10)}/
              {t.date.slice(5, 7)})
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
