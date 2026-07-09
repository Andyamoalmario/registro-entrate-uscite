"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  Transaction,
  TransactionKind,
} from "@/lib/types";
import { suggestedCategories, todayISO } from "@/lib/format";

export default function TransactionForm({
  editing,
  onDone,
}: {
  editing?: Transaction | null;
  onDone?: () => void;
}) {
  const addTransaction = useLedgerStore((s) => s.addTransaction);
  const updateTransaction = useLedgerStore((s) => s.updateTransaction);
  const transactions = useLedgerStore((s) => s.transactions);

  const [kind, setKind] = useState<TransactionKind>(editing?.kind ?? "uscita");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [category, setCategory] = useState(editing?.category ?? "");
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [note, setNote] = useState(editing?.note ?? "");

  const categoryOptions = suggestedCategories(
    transactions,
    kind,
    kind === "entrata" ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(",", "."));
    if (!parsed || parsed <= 0 || !date || !category.trim()) return;

    if (editing) {
      updateTransaction(editing.id, {
        kind,
        amount: parsed,
        category: category.trim(),
        date,
        note: note.trim() || undefined,
      });
    } else {
      addTransaction({
        kind,
        amount: parsed,
        category: category.trim(),
        date,
        note: note.trim() || undefined,
      });
      setAmount("");
      setCategory("");
      setNote("");
      setDate(todayISO());
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
          <span>Stai modificando un movimento</span>
          <button
            type="button"
            onClick={() => onDone?.()}
            className="underline decoration-dotted hover:text-ink"
          >
            Annulla
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setKind("uscita")}
          className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-colors ${
            kind === "uscita"
              ? "bg-expense text-paper-raised border-expense"
              : "border-rule text-ink-soft hover:border-expense"
          }`}
        >
          Uscita
        </button>
        <button
          type="button"
          onClick={() => setKind("entrata")}
          className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-colors ${
            kind === "entrata"
              ? "bg-income text-paper-raised border-income"
              : "border-rule text-ink-soft hover:border-income"
          }`}
        >
          Entrata
        </button>
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
        <span className="text-xs text-ink-soft">Categoria</span>
        <input
          type="text"
          list="category-suggestions"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="es. Spesa, Bollette, Stipendio..."
          required
          className="mt-1 w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
        <datalist id="category-suggestions">
          {categoryOptions.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <label className="block">
        <span className="text-xs text-ink-soft">Nota (opzionale)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="es. cena con amici"
          className="mt-1 w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
      </label>

      <button
        type="submit"
        className="w-full py-2.5 bg-ink text-paper-raised text-sm font-medium rounded-xl hover:bg-ink/90 transition-colors"
      >
        {editing ? "Salva modifiche" : "Aggiungi movimento"}
      </button>
    </form>
  );
}
