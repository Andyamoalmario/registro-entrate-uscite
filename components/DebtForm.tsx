"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { DEBT_TYPE_LABELS, DebtEntry, DebtEntryType } from "@/lib/types";
import { todayISO } from "@/lib/format";

const TYPE_ORDER: DebtEntryType[] = [
  "devo",
  "mi_deve",
  "ho_restituito",
  "mi_ha_restituito",
];

export default function DebtForm({
  editing,
  onDone,
}: {
  editing?: DebtEntry | null;
  onDone?: () => void;
}) {
  const addDebt = useLedgerStore((s) => s.addDebt);
  const updateDebt = useLedgerStore((s) => s.updateDebt);
  const debts = useLedgerStore((s) => s.debts);

  const [person, setPerson] = useState(editing?.person ?? "");
  const [type, setType] = useState<DebtEntryType>(editing?.type ?? "devo");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [note, setNote] = useState(editing?.note ?? "");
  const [date, setDate] = useState(editing?.date ?? todayISO());

  const knownPeople = Array.from(new Set(debts.map((d) => d.person))).sort();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(",", "."));
    if (!person.trim() || !parsed || parsed <= 0 || !date) return;

    if (editing) {
      updateDebt(editing.id, {
        person: person.trim(),
        type,
        amount: parsed,
        note: note.trim() || undefined,
        date,
      });
    } else {
      addDebt({
        person: person.trim(),
        type,
        amount: parsed,
        note: note.trim() || undefined,
        date,
      });
      setPerson("");
      setAmount("");
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
          <span>Stai modificando una voce</span>
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
        <span className="text-xs text-ink-soft">Persona</span>
        <input
          type="text"
          list="debt-people"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="es. Marco"
          required
          className="mt-1 w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
        <datalist id="debt-people">
          {knownPeople.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </label>

      <div className="grid grid-cols-2 gap-2">
        {TYPE_ORDER.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`py-2 text-xs font-medium rounded-xl border transition-colors ${
              type === t
                ? t === "devo" || t === "mi_ha_restituito"
                  ? "bg-expense text-paper-raised border-expense"
                  : "bg-income text-paper-raised border-income"
                : "border-rule text-ink-soft hover:border-ink"
            }`}
          >
            {DEBT_TYPE_LABELS[t]}
          </button>
        ))}
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
          placeholder="es. cena di gruppo"
          className="mt-1 w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
      </label>

      <button
        type="submit"
        className="w-full py-2.5 bg-ink text-paper-raised text-sm font-medium rounded-xl hover:bg-ink/90 transition-colors"
      >
        {editing ? "Salva modifiche" : "Aggiungi voce"}
      </button>
    </form>
  );
}
