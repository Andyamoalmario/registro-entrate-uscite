"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { Investment } from "@/lib/types";

const TYPES: Investment["type"][] = [
  "azioni",
  "etf",
  "crypto",
  "obbligazioni",
  "altro",
];

export default function InvestmentForm() {
  const addInvestment = useLedgerStore((s) => s.addInvestment);
  const [name, setName] = useState("");
  const [type, setType] = useState<Investment["type"]>("etf");
  const [invested, setInvested] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const investedNum = parseFloat(invested.replace(",", "."));
    const currentNum = parseFloat(currentValue.replace(",", "."));
    if (!name.trim() || !investedNum || !currentNum) return;
    addInvestment({
      name: name.trim(),
      type,
      invested: investedNum,
      currentValue: currentNum,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setName("");
    setInvested("");
    setCurrentValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper-raised border border-rule rounded-2xl p-5 space-y-4"
    >
      <label className="block">
        <span className="text-xs text-ink-soft">Nome</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="es. ETF MSCI World"
          required
          className="mt-1 w-full border border-rule rounded-2xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        />
      </label>

      <label className="block">
        <span className="text-xs text-ink-soft">Tipo</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Investment["type"])}
          className="mt-1 w-full border border-rule rounded-2xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-ink-soft">Capitale investito (€)</span>
          <input
            type="text"
            inputMode="decimal"
            value={invested}
            onChange={(e) => setInvested(e.target.value)}
            placeholder="0,00"
            required
            className="tabular mt-1 w-full border border-rule rounded-2xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="text-xs text-ink-soft">Valore attuale (€)</span>
          <input
            type="text"
            inputMode="decimal"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="0,00"
            required
            className="tabular mt-1 w-full border border-rule rounded-2xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-ink text-paper-raised text-sm font-medium rounded-2xl hover:bg-ink/90 transition-colors"
      >
        Aggiungi investimento
      </button>
    </form>
  );
}
