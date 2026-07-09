"use client";

import { monthLabel } from "@/lib/format";

export default function MonthSelector({
  keys,
  selected,
  onSelect,
}: {
  keys: string[];
  selected: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {keys.map((key) => {
        const active = key === selected;
        const [, month] = monthLabel(key).split(" ");
        const monthName = monthLabel(key).split(" ")[0];
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`shrink-0 px-4 py-2 text-sm font-medium border rounded-2xl transition-colors ${
              active
                ? "bg-ink text-paper-raised border-ink"
                : "bg-paper-raised text-ink-soft border-rule hover:border-ink hover:text-ink"
            }`}
          >
            {monthName} <span className="tabular">{month}</span>
          </button>
        );
      })}
    </div>
  );
}
