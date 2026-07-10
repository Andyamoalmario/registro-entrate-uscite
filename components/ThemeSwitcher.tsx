"use client";

import { useLedgerStore } from "@/lib/store";
import { THEMES } from "@/lib/themes";

export default function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const theme = useLedgerStore((s) => s.theme);
  const setTheme = useLedgerStore((s) => s.setTheme);

  return (
    <div className={compact ? "" : "mt-auto border-t border-rule px-3 py-4"}>
      {!compact && (
        <p className="text-[10px] uppercase tracking-widest text-ink-soft px-1.5 mb-2">
          Tema
        </p>
      )}
      <div className="flex gap-2 px-1.5 flex-wrap">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            aria-label={t.label}
            className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 shrink-0"
            style={{
              background: t.swatch,
              borderColor: theme === t.id ? "var(--ink)" : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}
