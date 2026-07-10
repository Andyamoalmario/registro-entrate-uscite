"use client";

import { useEffect } from "react";
import { useLedgerStore } from "@/lib/store";
import { THEMES, ThemeTokens } from "@/lib/themes";

const VAR_MAP: Record<keyof ThemeTokens, string> = {
  ink: "--ink",
  inkSoft: "--ink-soft",
  paper: "--paper",
  paperRaised: "--paper-raised",
  rule: "--rule",
  ruleSoft: "--rule-soft",
  accentSoft: "--accent-soft",
  income: "--income",
  incomeSoft: "--income-soft",
  incomeBright: "--income-bright",
  expense: "--expense",
  expenseSoft: "--expense-soft",
  expenseBright: "--expense-bright",
  invest: "--invest",
  investSoft: "--invest-soft",
  investBright: "--invest-bright",
};

export default function ThemeApplier() {
  const themeId = useLedgerStore((s) => s.theme);

  useEffect(() => {
    const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
    const root = document.documentElement;
    (Object.keys(theme.tokens) as (keyof ThemeTokens)[]).forEach((key) => {
      root.style.setProperty(VAR_MAP[key], theme.tokens[key]);
    });
  }, [themeId]);

  return null;
}
