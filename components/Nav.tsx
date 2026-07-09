"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Registro" },
  { href: "/investimenti", label: "Investimenti" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-rule bg-paper-raised">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display italic font-semibold text-3xl text-ink tracking-tight">
            Registro
          </span>
          <span className="text-xs text-ink-soft tracking-wide hidden sm:inline">
            entrate · uscite · investimenti
          </span>
        </div>
        <nav className="flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-t-xl border-b-2 transition-colors ${
                  active
                    ? "border-invest text-ink"
                    : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
