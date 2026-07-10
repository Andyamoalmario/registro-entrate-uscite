"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { HouseholdExpense } from "@/lib/types";

export default function HouseholdExpenseForm({
  editing,
  onDone,
}: {
  editing?: HouseholdExpense | null;
  onDone?: () => void;
}) {
  const addHouseholdExpense = useLedgerStore((s) => s.addHouseholdExpense);
  const updateHouseholdExpense = useLedgerStore((s) => s.updateHouseholdExpense);

  const [name, setName] = useState(editing?.name ?? "");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [note, setNote] = useState(editing?.note ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(",", "."));
    if (!name.trim() || !parsed || parsed <= 0) return;

    if (editing) {
      updateHouseholdExpense(editing.id, {
        name: name.trim(),
        amount: parsed,
        note: note.trim() || undefined,
      });
    } else {
      addHouseholdExpense({
        name: name.trim(),
        amount: parsed,
        note: note.trim() || undefined,
      });
      setName("");
      setAmount("");
      setNote("");
    }
    onDone?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper-raised border border-rule rounded-2xl p-5 space-y-4"
    >
      {editing && (
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span>Stai modificando una spesa fissa</span>
          <button
            type="button"
            onClick={() => onDone?.()}
            className="underline decoration-dotted hover:text-ink"
          >
            Annulla
          </button>
        </div>
      )}

      <label className="block">
        <span className="text-xs text-ink-soft">Voce di spesa</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="es. Affitto, Bollette, Condominio"
          required
          className="mt-1 w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
      </label>

      <label className="block">
        <span className="text-xs text-ink-soft">Importo mensile (€)</span>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
          required
          className="tabular mt-1 w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
      </label>

      <label className="block">
        <span className="text-xs text-ink-soft">Nota (opzionale)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="es. scade il 27 del mese"
          className="mt-1 w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
      </label>

      <button
        type="submit"
        className="w-full py-2.5 bg-ink text-paper-raised text-sm font-medium rounded-xl hover:bg-ink/90 transition-colors"
      >
        {editing ? "Salva modifiche" : "Aggiungi spesa fissa"}
      </button>
    </form>
  );
}
