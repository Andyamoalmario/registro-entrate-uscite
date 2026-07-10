"use client";

import { useEffect, useState } from "react";
import { useLedgerStore } from "@/lib/store";

export default function OnboardingGate() {
  const [mounted, setMounted] = useState(false);
  const ownerName = useLedgerStore((s) => s.ownerName);
  const setOwnerName = useLedgerStore((s) => s.setOwnerName);
  const householdSalaries = useLedgerStore((s) => s.householdSalaries);
  const setHouseholdSalaries = useLedgerStore((s) => s.setHouseholdSalaries);
  const [name, setName] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted || ownerName) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setOwnerName(trimmed);
    if (!householdSalaries.person1Name) {
      setHouseholdSalaries({ person1Name: trimmed });
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-paper-raised rounded-2xl p-7 max-w-sm w-full border border-rule shadow-xl"
      >
        <p className="font-display italic text-2xl text-ink mb-2">Benvenuto in Saldo</p>
        <p className="text-sm text-ink-soft mb-4">
          A chi appartiene questo Saldo? Il nome resterà su questo dispositivo.
        </p>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Il tuo nome"
          className="w-full border border-rule rounded-xl px-3 py-2 bg-paper focus:outline-none focus:border-ink mb-4"
        />
        <button
          type="submit"
          className="w-full py-2.5 bg-ink text-paper-raised text-sm font-medium rounded-xl hover:bg-ink/90 transition-colors"
        >
          Continua
        </button>
      </form>
    </div>
  );
}
