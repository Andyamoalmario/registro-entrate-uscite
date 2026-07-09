"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./navLinks";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 border-r border-rule bg-paper-raised min-h-screen flex-col">
      <div className="px-6 py-7">
        <span className="font-display italic font-semibold text-3xl text-ink tracking-tight">
          Saldo
        </span>
        <p className="text-xs text-ink-soft tracking-wide mt-1">
          entrate · uscite · investimenti
        </p>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-accent-soft text-ink"
                  : "text-ink-soft hover:bg-rule-soft hover:text-ink"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
