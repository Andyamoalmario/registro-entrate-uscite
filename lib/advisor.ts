import { Transaction, Investment } from "./types";
import {
  averageMonthlyExpense,
  averageSavingsRate,
  categoryTrends,
  emergencyFundMonths,
  formatEuro,
  investmentTypeBreakdown,
  savingsRateForMonth,
  currentMonthKey,
} from "./format";
import { Advice } from "@/components/AdviceCard";

export function buildAdvice(
  transactions: Transaction[],
  investments: Investment[]
): Advice[] {
  const advice: Advice[] = [];

  const currentRate = savingsRateForMonth(transactions, currentMonthKey());
  const avgRate = averageSavingsRate(transactions, 3);
  const avgExpense = averageMonthlyExpense(transactions, 6);
  const fundMonths = emergencyFundMonths(transactions);

  // 1. Savings rate
  if (avgRate !== null) {
    if (avgRate < 0) {
      advice.push({
        tone: "warning",
        title: "Stai spendendo più di quanto entra",
        body: `Negli ultimi mesi le uscite hanno superato le entrate in media del ${Math.abs(avgRate).toFixed(0)}%. Vale la pena rivedere le categorie di spesa principali prima di ogni altra cosa.`,
      });
    } else if (avgRate < 10) {
      advice.push({
        tone: "warning",
        title: "Margine di risparmio ridotto",
        body: `Risparmi in media il ${avgRate.toFixed(0)}% delle entrate. Una soglia comune di riferimento è il 20%: anche portarlo gradualmente al 15% farebbe una differenza notevole nel tempo.`,
      });
    } else if (avgRate < 20) {
      advice.push({
        tone: "info",
        title: "Sei sulla buona strada",
        body: `Risparmi in media il ${avgRate.toFixed(0)}% delle entrate. Sei vicino alla soglia consigliata del 20% — un piccolo taglio sulla categoria che spende di più potrebbe bastare per arrivarci.`,
      });
    } else {
      advice.push({
        tone: "positive",
        title: "Ottimo tasso di risparmio",
        body: `Risparmi in media il ${avgRate.toFixed(0)}% delle entrate, sopra la soglia consigliata del 20%. Se hai un fondo di emergenza solido, potrebbe essere il momento di far lavorare di più questo surplus.`,
      });
    }
  }

  if (currentRate !== null && avgRate !== null && currentRate < avgRate - 10) {
    advice.push({
      tone: "info",
      title: "Questo mese sei sotto la tua media",
      body: `Questo mese hai risparmiato il ${currentRate.toFixed(0)}%, contro una media recente del ${avgRate.toFixed(0)}%. Può capitare — controlla se c'è stata una spesa fuori dal normale.`,
    });
  }

  // 2. Emergency fund
  if (fundMonths !== null) {
    if (fundMonths < 0) {
      advice.push({
        tone: "warning",
        title: "Saldo accumulato negativo",
        body: "Il totale di entrate meno uscite registrate finora è negativo. Prima di pensare a investire, l'obiettivo è tornare in equilibrio.",
      });
    } else if (fundMonths < 3) {
      advice.push({
        tone: "warning",
        title: "Fondo di emergenza da costruire",
        body: `Con la spesa media attuale (${formatEuro(avgExpense)}/mese), il saldo accumulato copre circa ${fundMonths.toFixed(1)} mesi di spese. Un obiettivo comune è arrivare a 3-6 mesi prima di investire capitale extra.`,
      });
    } else if (fundMonths < 6) {
      advice.push({
        tone: "info",
        title: "Fondo di emergenza quasi completo",
        body: `Il saldo accumulato copre circa ${fundMonths.toFixed(1)} mesi di spese medie. Sei nella fascia consigliata (3-6 mesi) — bene così.`,
      });
    } else {
      advice.push({
        tone: "positive",
        title: "Fondo di emergenza solido",
        body: `Il saldo accumulato copre circa ${fundMonths.toFixed(1)} mesi di spese medie, oltre la soglia consigliata. La parte in eccesso potrebbe rendere di più se investita, invece di restare ferma.`,
      });
    }
  }

  // 3. Category to cut
  const trends = categoryTrends(transactions);
  const topGrowth = trends.find((t) => t.delta > 0 && t.current > 0);
  if (topGrowth) {
    advice.push({
      tone: "warning",
      title: `"${topGrowth.category}" è la categoria in maggior crescita`,
      body: `Rispetto al mese scorso hai speso ${formatEuro(topGrowth.delta)} in più in questa categoria${
        topGrowth.deltaPct !== null ? ` (+${topGrowth.deltaPct.toFixed(0)}%)` : ""
      }. Anche solo dimezzare questo aumento libererebbe circa ${formatEuro(topGrowth.delta / 2)} al mese.`,
    });
  }

  // 4. Investment diversification / readiness
  if (investments.length === 0) {
    if (fundMonths !== null && fundMonths >= 3 && avgRate !== null && avgRate >= 10) {
      advice.push({
        tone: "info",
        title: "Potresti iniziare a investire",
        body: "Hai un fondo di emergenza adeguato e un margine di risparmio positivo, ma non hai ancora investimenti registrati. Potrebbe essere il momento di valutare dove destinare una parte del risparmio mensile.",
      });
    }
  } else {
    const breakdown = investmentTypeBreakdown(investments);
    const top = breakdown[0];
    if (top && top.pct > 70) {
      advice.push({
        tone: "info",
        title: "Portafoglio poco diversificato",
        body: `Il ${top.pct.toFixed(0)}% del tuo portafoglio è in "${top.type}". Diversificare tra più tipologie riduce il rischio legato a un singolo mercato.`,
      });
    }
  }

  if (advice.length === 0) {
    advice.push({
      tone: "info",
      title: "Servono più dati",
      body: "Aggiungi qualche movimento in più nel Registro: con almeno un mese o due di storico posso darti consigli più mirati.",
    });
  }

  return advice;
}
