"use client";

import { useEffect, useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { DebtEntry } from "@/lib/types";
import DebtSummary from "@/components/DebtSummary";
import DebtList from "@/components/DebtList";
import DebtForm from "@/components/DebtForm";
import { debtTotals } from "@/lib/format";

export default function DebitiPage() {
  const [mounted, setMounted] = useState(false);
  const debts = useLedgerStore((s) => s.debts);
  const [editing, setEditing] = useState<DebtEntry | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8" />;
  }

  const totals = debtTotals(debts);

  return (
    <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <DebtSummary owedByMe={totals.owedByMe} owedToMe={totals.owedToMe} />

      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <DebtList debts={debts} onEdit={setEditing} />
        <DebtForm
          key={editing?.id ?? "new"}
          editing={editing}
          onDone={() => setEditing(null)}
        />
      </div>
    </main>
  );
}
