"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  TransactionKind,
} from "@/lib/types";

export default function TransactionForm({
  defaultMonth,
  onDone,
}: {
  defaultMonth: string;
  onDone?: () => void;
}) {
  const addTransaction = useLedgerStore((s) => s.addTransaction);
  const [kind, setKind] = useState<TransactionKind>("uscita");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(`${defaultMonth}-01`);
  const [note, setNote] = useState("");

  const categories =
    kind === "entrata" ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(",", "."));
    if (!parsed || parsed <= 0 || !date) return;
    addTransaction({
      kind,
      amount: parsed,
      category,
      date,
      note: note.trim() || undefined,
    });
    setAmount("");
    setNote("");
    onDone?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper-raised border border-rule rounded-2xl p-5 space-y-4"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setKind("uscita");
            setCategory(DEFAULT_EXPENSE_CATEGORIES[0]);
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-2xl border transition-colors ${
            kind === "uscita"
              ? "bg-expense text-paper-raised border-expense"
              : "border-rule text-ink-soft hover:border-expense"
          }`}
        >
          Uscita
        </button>
        <button
          type="button"
          onClick={() => {
            setKind("entrata");
            setCategory(DEFAULT_INCOME_CATEGORIES[0]);
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-2xl border transition-colors ${
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
            className="tabular mt-1 w-full border border-rule rounded-2xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="text-xs text-ink-soft">Data</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="tabular mt-1 w-full border border-rule rounded-2xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs text-ink-soft">Categoria</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full border border-rule rounded-2xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-ink-soft">Nota (opzionale)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="es. cena con amici"
          className="mt-1 w-full border border-rule rounded-2xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
      </label>

      <button
        type="submit"
        className="w-full py-2.5 bg-ink text-paper-raised text-sm font-medium rounded-2xl hover:bg-ink/90 transition-colors"
      >
        Aggiungi movimento
      </button>
    </form>
  );
}
