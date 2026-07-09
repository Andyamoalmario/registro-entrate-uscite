"use client";

import { useState } from "react";
import { Investment } from "@/lib/types";
import { formatEuro } from "@/lib/format";
import { useLedgerStore } from "@/lib/store";

function GainBadge({ invested, current }: { invested: number; current: number }) {
  const gain = current - invested;
  const pct = invested > 0 ? (gain / invested) * 100 : 0;
  const positive = gain >= 0;
  return (
    <span
      className={`tabular text-sm font-medium ${
        positive ? "text-income" : "text-expense"
      }`}
    >
      {positive ? "+" : ""}
      {formatEuro(gain)} ({positive ? "+" : ""}
      {pct.toFixed(1)}%)
    </span>
  );
}

function EditableValue({ investment }: { investment: Investment }) {
  const updateInvestment = useLedgerStore((s) => s.updateInvestment);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(investment.currentValue));

  function save() {
    const parsed = parseFloat(value.replace(",", "."));
    if (parsed > 0) {
      updateInvestment(investment.id, {
        currentValue: parsed,
        updatedAt: new Date().toISOString().slice(0, 10),
      });
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        autoFocus
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && save()}
        className="tabular w-28 border border-ink rounded-2xl px-2 py-1 bg-paper text-right"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="tabular text-right font-medium hover:underline decoration-dotted"
      title="Clicca per aggiornare il valore"
    >
      {formatEuro(investment.currentValue)}
    </button>
  );
}

export default function InvestmentList({
  investments,
}: {
  investments: Investment[];
}) {
  const removeInvestment = useLedgerStore((s) => s.removeInvestment);

  if (investments.length === 0) {
    return (
      <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
        Nessun investimento ancora. Aggiungine uno dal modulo qui accanto.
      </div>
    );
  }

  return (
    <div className="border border-rule rounded-2xl overflow-hidden bg-paper-raised">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-rule text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2 px-4 font-medium">Nome</th>
            <th className="py-2 px-4 font-medium">Tipo</th>
            <th className="py-2 px-4 font-medium text-right">Investito</th>
            <th className="py-2 px-4 font-medium text-right">Attuale</th>
            <th className="py-2 px-4 font-medium text-right">Guadagno/Perdita</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id} className="border-b border-rule-soft last:border-0">
              <td className="py-2.5 px-4 font-medium">{inv.name}</td>
              <td className="py-2.5 px-4 text-ink-soft capitalize">{inv.type}</td>
              <td className="py-2.5 px-4 tabular text-right text-ink-soft">
                {formatEuro(inv.invested)}
              </td>
              <td className="py-2.5 px-4 text-right">
                <EditableValue investment={inv} />
              </td>
              <td className="py-2.5 px-4 text-right">
                <GainBadge invested={inv.invested} current={inv.currentValue} />
              </td>
              <td className="py-2.5 px-2 text-right">
                <button
                  onClick={() => removeInvestment(inv.id)}
                  aria-label="Elimina investimento"
                  className="text-ink-soft hover:text-expense text-xs px-2"
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
