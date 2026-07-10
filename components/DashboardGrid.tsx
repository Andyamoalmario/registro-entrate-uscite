"use client";

import { useMemo } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WIDGETS, WidgetDef } from "@/lib/widgets";
import { DashboardLayoutItem, useLedgerStore } from "@/lib/store";

const ResponsiveGrid = WidthProvider(GridLayout);
const COLS = 4;
const ROW_HEIGHT = 64;

export default function DashboardGrid({ editing }: { editing: boolean }) {
  const activeIds = useLedgerStore((s) => s.dashboardWidgets);
  const savedLayout = useLedgerStore((s) => s.dashboardLayout);
  const setDashboardLayout = useLedgerStore((s) => s.setDashboardLayout);
  const toggleDashboardWidget = useLedgerStore((s) => s.toggleDashboardWidget);

  const active = activeIds
    .map((id) => WIDGETS.find((w) => w.id === id))
    .filter((w): w is WidgetDef => Boolean(w));

  const layout: DashboardLayoutItem[] = useMemo(() => {
    return active.map((w, index) => {
      const saved = savedLayout.find((l) => l.i === w.id);
      if (saved) return saved;
      return {
        i: w.id,
        x: (index * w.defaultW) % COLS,
        y: Infinity,
        w: w.defaultW,
        h: w.defaultH,
      };
    });
  }, [active, savedLayout]);

  if (active.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        .react-grid-item.react-grid-placeholder {
          background: var(--accent-soft) !important;
          border-radius: 1rem;
          opacity: 0.6;
        }
        .react-resizable-handle {
          opacity: ${editing ? 0.5 : 0};
        }
      `}</style>

      <div className="hidden md:block">
        <ResponsiveGrid
          cols={COLS}
          rowHeight={ROW_HEIGHT}
          layout={layout}
          margin={[16, 16]}
          isDraggable={editing}
          isResizable={editing}
          draggableHandle=".drag-handle"
          onLayoutChange={(newLayout) => {
            if (!editing) return;
            setDashboardLayout(
              newLayout.map((l) => ({ i: l.i, x: l.x, y: l.y, w: l.w, h: l.h }))
            );
          }}
        >
          {active.map((w) => (
            <div key={w.id} className="overflow-hidden">
              {editing && (
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span
                    className="drag-handle text-xs text-ink-soft cursor-move flex-1"
                    style={{ touchAction: "none" }}
                  >
                    ⠿ {w.label}
                  </span>
                  <button
                    onClick={() => toggleDashboardWidget(w.id)}
                    aria-label="Rimuovi blocco"
                    className="text-ink-soft hover:text-expense text-xs px-1.5 shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div
                className="overflow-auto"
                style={{ height: editing ? "calc(100% - 1.75rem)" : "100%" }}
              >
                {w.render()}
              </div>
            </div>
          ))}
        </ResponsiveGrid>
      </div>

      {/* Simple stacked fallback for phones — a fixed-column drag grid doesn't translate well to touch on narrow screens */}
      <div className="md:hidden space-y-4">
        {active.map((w) => (
          <div key={w.id}>
            {editing && (
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-xs text-ink-soft">{w.label}</span>
                <button
                  onClick={() => toggleDashboardWidget(w.id)}
                  aria-label="Rimuovi blocco"
                  className="text-ink-soft hover:text-expense text-xs px-1.5"
                >
                  ✕
                </button>
              </div>
            )}
            {w.render()}
          </div>
        ))}
      </div>
    </>
  );
}
