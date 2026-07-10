"use client";

import { useEffect, useState } from "react";
import { useLedgerStore } from "@/lib/store";
import { WIDGETS } from "@/lib/widgets";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const activeIds = useLedgerStore((s) => s.dashboardWidgets);
  const widgetSizes = useLedgerStore((s) => s.widgetSizes);
  const toggleDashboardWidget = useLedgerStore((s) => s.toggleDashboardWidget);
  const reorderDashboardWidget = useLedgerStore((s) => s.reorderDashboardWidget);
  const setWidgetSize = useLedgerStore((s) => s.setWidgetSize);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="w-full px-4 sm:px-6 py-6 sm:py-8" />;
  }

  const active = activeIds
    .map((id) => WIDGETS.find((w) => w.id === id))
    .filter((w): w is (typeof WIDGETS)[number] => Boolean(w));
  const inactive = WIDGETS.filter((w) => !activeIds.includes(w.id));

  return (
    <main className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display italic text-3xl text-ink">Dashboard</h1>
          <p className="text-sm text-ink-soft mt-1">
            La tua vista personale — scegli tu cosa vedere, e quanto spazio dargli.
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

      {active.length === 0 ? (
        <div className="border border-dashed border-rule rounded-2xl p-8 text-center text-ink-soft text-sm">
          Nessun blocco selezionato. Clicca &ldquo;Personalizza&rdquo; per aggiungerne.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {active.map((w, i) => {
            const size = widgetSizes[w.id] ?? w.defaultSize;
            return (
              <div key={w.id} className={size === "full" ? "lg:col-span-2" : ""}>
                {editing && (
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-xs text-ink-soft">{w.label}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setWidgetSize(w.id, size === "full" ? "half" : "full")
                        }
                        aria-label="Cambia larghezza"
                        title={size === "full" ? "Rendi metà larghezza" : "Rendi larghezza piena"}
                        className="text-ink-soft hover:text-ink text-xs px-1.5"
                      >
                        {size === "full" ? "⇲" : "⇱"}
                      </button>
                      <button
                        disabled={i === 0}
                        onClick={() => reorderDashboardWidget(w.id, "up")}
                        aria-label="Sposta su"
                        className="text-ink-soft hover:text-ink disabled:opacity-30 text-xs px-1.5"
                      >
                        ↑
                      </button>
                      <button
                        disabled={i === active.length - 1}
                        onClick={() => reorderDashboardWidget(w.id, "down")}
                        aria-label="Sposta giù"
                        className="text-ink-soft hover:text-ink disabled:opacity-30 text-xs px-1.5"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => toggleDashboardWidget(w.id)}
                        aria-label="Rimuovi blocco"
                        className="text-ink-soft hover:text-expense text-xs px-1.5"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                {w.render()}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
