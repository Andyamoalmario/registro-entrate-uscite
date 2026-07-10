"use client";

import ThemeSwitcher from "./ThemeSwitcher";

export default function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-paper-raised border-b border-rule px-4 py-3 flex items-center justify-between">
      <span className="font-display italic font-semibold text-2xl text-ink tracking-tight">
        Saldo
      </span>
      <ThemeSwitcher compact />
    </header>
  );
}
