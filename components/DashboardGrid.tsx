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

// Simple left-to-right, top-to-bottom packer — avoids the gaps that come
// from guessing x positions and relying on y:Infinity for several items at once.
function packLayout(widgets: WidgetDef[]): DashboardLayoutItem[] {
  let cursorX = 0;
  let cursorY = 0;
  let rowMaxH = 0;
  const result: DashboardLayoutItem[] = [];
  for (const w of widgets) {
    if (cursorX + w.defaultW > COLS) {
      cursorX = 0;
      cursorY += rowMaxH;
      rowMaxH = 0;
    }
    result.push({ i: w.id, x: cursorX, y: cursorY, w: w.defaultW, h: w.defaultH });
    cursorX += w.defaultW;
    rowMaxH = Math.max(rowMaxH, w.defaultH);
  }
  return result;
}

export default function DashboardGrid({ editing }: { editing: boolean }) {
  const activeIds = useLedgerStore((s) => s.dashboardWidgets);
  const savedLayout = useLedgerStore((s) => s.dashboardLayout);
  const setDashboardLayout = useLedgerStore((s) => s.setDashboardLayout);
  const toggleDashboardWidget = useLedgerStore((s) => s.toggleDashboardWidget);

  const active = activeIds
    .map((id) => WIDGETS.find((w) => w.id === id))
    .filter((w): w is WidgetDef => Boolean(w));

  const layout: DashboardLayoutItem[] = useMemo(() => {
    if (savedLayout.length === 0) {
      // Nothing saved yet: pack everything cleanly in one pass.
      return packLayout(active);
    }
    return active.map((w) => {
      const saved = savedLayout.find((l) => l.i === w.id);
      if (saved) return saved;
      // A single newly-added widget: append it after everything else.
      return { i: w.id, x: 0, y: Infinity, w: w.defaultW, h: w.defaultH };
    });
  }, [active, savedLayout]);

  function tidyUp() {
    setDashboardLayout(packLayout(active));
  }

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
        {editing && (
          <div className="flex justify-end mb-2">
            <button
              onClick={tidyUp}
              className="text-xs px-3 py-1.5 rounded-full border border-rule text-ink-soft hover:border-ink hover:text-ink transition-colors"
            >
              Riordina automaticamente
            </button>
          </div>
        )}
        <ResponsiveGrid
          cols={COLS}
          rowHeight={ROW_HEIGHT}
          layout={layout}
          margin={[16, 16]}
          compactType="vertical"
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
