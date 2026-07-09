import { Transaction } from "./types";

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
