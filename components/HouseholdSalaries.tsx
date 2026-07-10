"use client";

import { useState } from "react";
import { useLedgerStore } from "@/lib/store";

export default function HouseholdSalaries() {
  const salaries = useLedgerStore((s) => s.householdSalaries);
  const setHouseholdSalaries = useLedgerStore((s) => s.setHouseholdSalaries);

  const [name1, setName1] = useState(salaries.person1Name);
  const [salary1, setSalary1] = useState(String(salaries.person1Salary || ""));
  const [name2, setName2] = useState(salaries.person2Name);
  const [salary2, setSalary2] = useState(String(salaries.person2Salary || ""));

  function commit() {
    setHouseholdSalaries({
      person1Name: name1.trim() || "Persona 1",
      person1Salary: parseFloat(salary1.replace(",", ".")) || 0,
      person2Name: name2.trim() || "Persona 2",
      person2Salary: parseFloat(salary2.replace(",", ".")) || 0,
    });
  }

  return (
    <div className="bg-paper-raised border border-rule rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-4">
        Stipendi mensili
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            onBlur={commit}
            placeholder="Nome persona 1"
            className="w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink text-sm font-medium"
          />
          <input
            type="text"
            inputMode="decimal"
            value={salary1}
            onChange={(e) => setSalary1(e.target.value)}
            onBlur={commit}
            placeholder="Stipendio netto (€)"
            className="tabular w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
          />
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            onBlur={commit}
            placeholder="Nome persona 2"
            className="w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink text-sm font-medium"
          />
          <input
            type="text"
            inputMode="decimal"
            value={salary2}
            onChange={(e) => setSalary2(e.target.value)}
            onBlur={commit}
            placeholder="Stipendio netto (€)"
            className="tabular w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink"
          />
        </div>
      </div>
    </div>
  );
}
