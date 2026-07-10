"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";

function EditableName({
  value,
  placeholder,
  onSave,
}: {
  value: string;
  placeholder: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed) onSave(trimmed);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        autoFocus
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        placeholder={placeholder}
        className="w-full border border-ink rounded-xl px-3 py-2 bg-paper text-sm font-medium focus:outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className="text-sm font-medium text-ink hover:underline decoration-dotted text-left"
      title="Clicca per rinominare"
    >
      {value || placeholder}
    </button>
  );
}

export default function HouseholdSalaries() {
  const salaries = useLedgerStore((s) => s.householdSalaries);
  const setHouseholdSalaries = useLedgerStore((s) => s.setHouseholdSalaries);
  const ownerName = useLedgerStore((s) => s.ownerName);

  const [salary1, setSalary1] = useState(String(salaries.person1Salary || ""));
  const [salary2, setSalary2] = useState(String(salaries.person2Salary || ""));
  const [addingPartner, setAddingPartner] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerSalary, setPartnerSalary] = useState("");

  function commitSalary1() {
    setHouseholdSalaries({
      person1Salary: parseFloat(salary1.replace(",", ".")) || 0,
    });
  }
  function commitSalary2() {
    setHouseholdSalaries({
      person2Salary: parseFloat(salary2.replace(",", ".")) || 0,
    });
  }

  function confirmAddPartner() {
    if (!partnerName.trim()) return;
    setHouseholdSalaries({
      person2Name: partnerName.trim(),
      person2Salary: parseFloat(partnerSalary.replace(",", ".")) || 0,
    });
    setAddingPartner(false);
    setPartnerName("");
    setPartnerSalary("");
  }

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-4">
        Stipendi mensili
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <EditableName
            value={salaries.person1Name || ownerName}
            placeholder="Il tuo nome"
            onSave={(v) => setHouseholdSalaries({ person1Name: v })}
          />
          <input
            type="text"
            inputMode="decimal"
            value={salary1}
            onChange={(e) => setSalary1(e.target.value)}
            onBlur={commitSalary1}
            placeholder="Stipendio netto (€)"
            className="tabular w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
          />
        </div>

        <div className="space-y-2">
          {salaries.person2Name ? (
            <>
              <EditableName
                value={salaries.person2Name}
                placeholder="Nome partner"
                onSave={(v) => setHouseholdSalaries({ person2Name: v })}
              />
              <input
                type="text"
                inputMode="decimal"
                value={salary2}
                onChange={(e) => setSalary2(e.target.value)}
                onBlur={commitSalary2}
                placeholder="Stipendio netto (€)"
                className="tabular w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
              />
            </>
          ) : addingPartner ? (
            <div className="space-y-2 border border-dashed border-rule rounded-xl p-3">
              <input
                autoFocus
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Nome del partner"
                className="w-full border border-rule rounded-xl px-3 py-2 bg-paper text-sm font-medium focus:outline-none focus:border-ink"
              />
              <input
                type="text"
                inputMode="decimal"
                value={partnerSalary}
                onChange={(e) => setPartnerSalary(e.target.value)}
                placeholder="Stipendio netto (€)"
                className="tabular w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={confirmAddPartner}
                  className="flex-1 py-2 rounded-xl bg-ink text-paper-raised text-sm font-medium"
                >
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setAddingPartner(false)}
                  className="px-3 text-sm text-ink-soft hover:text-ink"
                >
                  Annulla
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingPartner(true)}
              className="w-full py-3 rounded-xl border border-dashed border-rule text-ink-soft hover:border-ink hover:text-ink text-sm transition-colors"
            >
              + Aggiungi partner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
