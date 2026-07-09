"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import InvestmentForm from "@/components/InvestmentForm";
import InvestmentList from "@/components/InvestmentList";
import PortfolioSummary from "@/components/PortfolioSummary";
import { useLedgerStore } from "@/lib/store";

export default function InvestimentiPage() {
  const [mounted, setMounted] = useState(false);
  const investments = useLedgerStore((s) => s.investments);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid SSR/localStorage hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Nav />
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8" />
      </>
    );
  }

  const totalInvested = investments.reduce((sum, i) => sum + i.invested, 0);
  const totalCurrent = investments.reduce((sum, i) => sum + i.currentValue, 0);

  return (
    <>
      <Nav />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
        <PortfolioSummary invested={totalInvested} current={totalCurrent} />

        <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
          <InvestmentList investments={investments} />
          <InvestmentForm />
        </div>
      </main>
    </>
  );
}
