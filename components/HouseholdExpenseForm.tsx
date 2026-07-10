"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { HouseholdExpense } from "@/lib/types";
import { todayISO } from "@/lib/format";

export default function HouseholdExpenseForm({
  editing,
  defaultDate,
  onDone,
}: {
  editing?: HouseholdExpense | null;
  defaultDate?: string;
  onDone?: () => void;
}) {
  const addHouseholdExpense = useLedgerStore((s) => s.addHouseholdExpense);
  const updateHouseholdExpense = useLedgerStore((s) => s.updateHouseholdExpense);
  const salaries = useLedgerStore((s) => s.householdSalaries);

  const [name, setName] = useState(editing?.name ?? "");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [note, setNote] = useState(editing?.note ?? "");
  const [date, setDate] = useState(editing?.date ?? defaultDate ?? todayISO());
  const [paidBy, setPaidBy] = useState<"person1" | "person2">(
    editing?.paidBy ?? "person1"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(",", "."));
    if (!name.trim() || !parsed || parsed <= 0 || !date) return;

    if (editing) {
      updateHouseholdExpense(editing.id, {
        name: name.trim(),
        amount: parsed,
        note: note.trim() || undefined,
        paidBy,
        date,
      });
    } else {
      addHouseholdExpense({
        name: name.trim(),
        amount: parsed,
        note: note.trim() || undefined,
        paidBy,
        date,
      });
      setName("");
      setAmount("");
      setNote("");
      setDate(defaultDate ?? todayISO());
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

      <div>
        <span className="text-xs text-ink-soft">Pagato da</span>
        {salaries.person2Name ? (
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => setPaidBy("person1")}
              className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-colors ${
                paidBy === "person1"
                  ? "bg-ink text-paper-raised border-ink"
                  : "border-rule text-ink-soft hover:border-ink"
              }`}
            >
              {salaries.person1Name || "Tu"}
            </button>
            <button
              type="button"
              onClick={() => setPaidBy("person2")}
              className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-colors ${
                paidBy === "person2"
                  ? "bg-ink text-paper-raised border-ink"
                  : "border-rule text-ink-soft hover:border-ink"
              }`}
            >
              {salaries.person2Name}
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink-soft mt-1">
            {salaries.person1Name || "Tu"} (aggiungi un partner in &ldquo;Stipendi
            mensili&rdquo; per dividere le spese)
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-ink-soft">Importo (€)</span>
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
          <span className="text-xs text-ink-soft">Data</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="tabular mt-1 w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
          />
        </label>
      </div>

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
        {editing ? "Salva modifiche" : "Aggiungi spesa"}
      </button>
    </form>
  );
}
