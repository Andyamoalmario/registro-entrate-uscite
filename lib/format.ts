import { Transaction, Investment } from "./types";

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function monthKey(dateISO: string): string {
  return dateISO.slice(0, 7); // "2026-07"
}

const MONTH_NAMES_IT = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return `${MONTH_NAMES_IT[month - 1]} ${year}`;
}

export function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function transactionsForMonth(
  transactions: Transaction[],
  key: string
): Transaction[] {
  return transactions
    .filter((t) => monthKey(t.date) === key)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function monthTotals(transactions: Transaction[]): {
  entrate: number;
  uscite: number;
  saldo: number;
} {
  const entrate = transactions
    .filter((t) => t.kind === "entrata")
    .reduce((sum, t) => sum + t.amount, 0);
  const uscite = transactions
    .filter((t) => t.kind === "uscita")
    .reduce((sum, t) => sum + t.amount, 0);
  return { entrate, uscite, saldo: entrate - uscite };
}

export function allMonthKeys(transactions: Transaction[]): string[] {
  const keys = new Set(transactions.map((t) => monthKey(t.date)));
  keys.add(currentMonthKey());
  return Array.from(keys).sort().reverse();
}

export function categoryBreakdown(
  transactions: Transaction[],
  kind: "entrata" | "uscita"
): { category: string; total: number }[] {
  const map = new Map<string, number>();
  transactions
    .filter((t) => t.kind === kind)
    .forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    });
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

export function suggestedCategories(
  transactions: Transaction[],
  kind: "entrata" | "uscita",
  defaults: string[]
): string[] {
  const used = new Set(
    transactions.filter((t) => t.kind === kind).map((t) => t.category)
  );
  defaults.forEach((c) => used.add(c));
  return Array.from(used).sort((a, b) => a.localeCompare(b));
}

export interface MonthComparison {
  currentLabel: string;
  previousLabel: string;
  currentUscite: number;
  previousUscite: number;
  deltaPct: number | null;
}

export function compareToLastMonth(transactions: Transaction[]): MonthComparison {
  const now = new Date();
  const curKey = currentMonthKey();
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const curUscite = monthTotals(transactionsForMonth(transactions, curKey)).uscite;
  const prevUscite = monthTotals(transactionsForMonth(transactions, prevKey)).uscite;
  const deltaPct = prevUscite > 0 ? ((curUscite - prevUscite) / prevUscite) * 100 : null;
  return {
    currentLabel: monthLabel(curKey),
    previousLabel: monthLabel(prevKey),
    currentUscite: curUscite,
    previousUscite: prevUscite,
    deltaPct,
  };
}

export interface CategoryTrend {
  category: string;
  current: number;
  previous: number;
  deltaPct: number | null;
  delta: number;
}

export function categoryTrends(transactions: Transaction[]): CategoryTrend[] {
  const now = new Date();
  const curKey = currentMonthKey();
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const curBreakdown = categoryBreakdown(transactionsForMonth(transactions, curKey), "uscita");
  const prevBreakdown = categoryBreakdown(
    transactionsForMonth(transactions, prevKey),
    "uscita"
  );
  const prevMap = new Map(prevBreakdown.map((c) => [c.category, c.total]));
  const categories = new Set([
    ...curBreakdown.map((c) => c.category),
    ...prevBreakdown.map((c) => c.category),
  ]);
  const curMap = new Map(curBreakdown.map((c) => [c.category, c.total]));

  return Array.from(categories)
    .map((category) => {
      const current = curMap.get(category) ?? 0;
      const previous = prevMap.get(category) ?? 0;
      const delta = current - previous;
      const deltaPct = previous > 0 ? (delta / previous) * 100 : null;
      return { category, current, previous, deltaPct, delta };
    })
    .sort((a, b) => b.delta - a.delta);
}

export function averageMonthlyExpense(transactions: Transaction[], n = 6): number {
  const data = lastNMonthsData(transactions, n);
  const total = data.reduce((sum, m) => sum + m.uscite, 0);
  return data.length > 0 ? total / data.length : 0;
}

export function largestExpense(transactions: Transaction[]): Transaction | null {
  const expenses = transactions.filter((t) => t.kind === "uscita");
  if (expenses.length === 0) return null;
  return expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0]);
}

export function savingsRateForMonth(transactions: Transaction[], key: string): number | null {
  const totals = monthTotals(transactionsForMonth(transactions, key));
  if (totals.entrate <= 0) return null;
  return (totals.saldo / totals.entrate) * 100;
}

export function averageSavingsRate(transactions: Transaction[], n = 3): number | null {
  const now = new Date();
  const rates: number[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const rate = savingsRateForMonth(transactions, key);
    if (rate !== null) rates.push(rate);
  }
  if (rates.length === 0) return null;
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

export function accumulatedNet(transactions: Transaction[]): number {
  const totals = monthTotals(transactions);
  return totals.saldo;
}

export function emergencyFundMonths(transactions: Transaction[]): number | null {
  const avgExpense = averageMonthlyExpense(transactions, 6);
  if (avgExpense <= 0) return null;
  return accumulatedNet(transactions) / avgExpense;
}

export function allTimeCategoryBreakdown(
  transactions: Transaction[],
  kind: "entrata" | "uscita",
  months = 6
): { category: string; total: number }[] {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const recent = transactions.filter((t) => new Date(t.date) >= cutoff);
  return categoryBreakdown(recent, kind);
}
export function lastNMonthsData(
  transactions: Transaction[],
  n: number
): { key: string; label: string; entrate: number; uscite: number }[] {
  const now = new Date();
  const result: { key: string; label: string; entrate: number; uscite: number }[] =
    [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthTx = transactionsForMonth(transactions, key);
    const totals = monthTotals(monthTx);
    result.push({
      key,
      label: monthLabel(key).slice(0, 3),
      entrate: totals.entrate,
      uscite: totals.uscite,
    });
  }
  return result;
}

export function investmentTypeBreakdown(
  investments: Investment[]
): { type: string; total: number; pct: number }[] {
  const total = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const map = new Map<string, number>();
  investments.forEach((i) => {
    map.set(i.type, (map.get(i.type) ?? 0) + i.currentValue);
  });
  return Array.from(map.entries())
    .map(([type, value]) => ({
      type,
      total: value,
      pct: total > 0 ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
