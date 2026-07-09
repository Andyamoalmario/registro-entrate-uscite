"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./navLinks";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-paper-raised border-t border-rule flex justify-around pb-[env(safe-area-inset-bottom)]">
      {navLinks.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 px-2 flex-1 text-[10px] font-medium transition-colors ${
              active ? "text-ink" : "text-ink-soft"
            }`}
          >
            {link.icon}
            <span className="truncate max-w-[60px]">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
