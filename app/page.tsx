"use client";

import { useEffect, useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { WIDGETS } from "@/lib/widgets";
import DashboardGrid from "@/components/DashboardGrid";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const activeIds = useLedgerStore((s) => s.dashboardWidgets);
  const toggleDashboardWidget = useLedgerStore((s) => s.toggleDashboardWidget);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="w-full px-4 sm:px-6 py-6 sm:py-8" />;
  }

  const inactive = WIDGETS.filter((w) => !activeIds.includes(w.id));

  return (
    <main className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display italic text-3xl text-ink">Dashboard</h1>
          <p className="text-sm text-ink-soft mt-1">
            {editing
              ? "Trascina dall'intestazione di un blocco per spostarlo, tira l'angolo in basso a destra per ridimensionarlo."
              : "La tua vista personale — scegli tu cosa vedere, e dove."}
          </p>
        </div>
        <button
          onClick={() => setEditing((e) => !e)}
          className={`text-sm px-4 py-2 rounded-xl border transition-colors shrink-0 ${
            editing
              ? "bg-ink text-paper-raised border-ink"
              : "border-rule text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          {editing ? "Fatto" : "Personalizza"}
        </button>
      </div>

      {editing && (
        <div className="bg-paper-raised border border-dashed border-rule rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-ink-soft mb-3">
            Aggiungi un blocco
          </p>
          {inactive.length === 0 ? (
            <p className="text-sm text-ink-soft">Li hai già aggiunti tutti.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {inactive.map((w) => (
                <button
                  key={w.id}
                  onClick={() => toggleDashboardWidget(w.id)}
                  className="text-sm px-3 py-1.5 rounded-full border border-rule text-ink-soft hover:border-ink hover:text-ink transition-colors"
                >
                  + {w.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeIds.length === 0 ? (
        <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
          Nessun blocco selezionato. Clicca &ldquo;Personalizza&rdquo; per aggiungerne.
        </div>
      ) : (
        <DashboardGrid editing={editing} />
      )}
    </main>
  );
}
