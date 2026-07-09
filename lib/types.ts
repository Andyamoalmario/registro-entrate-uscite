export type TransactionKind = "entrata" | "uscita";

export interface Transaction {
  id: string;
  kind: TransactionKind;
  amount: number; // always positive, sign derived from kind
  category: string;
  date: string; // ISO date, e.g. "2026-07-07"
  note?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: "azioni" | "etf" | "crypto" | "obbligazioni" | "altro";
  invested: number; // total capital put in
  currentValue: number; // current value, manually updated
  updatedAt: string; // ISO date of last manual update
}

export interface Debt {
  id: string;
  person: string;
  amount: number;
  note?: string;
  date: string; // ISO date when the debt was recorded
  paid: boolean;
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Casa",
  "Spesa",
  "Trasporti",
  "Bollette",
  "Svago",
  "Salute",
  "Altro",
];

export const DEFAULT_INCOME_CATEGORIES = [
  "Stipendio",
  "Freelance",
  "Regalo",
  "Rimborso",
  "Altro",
];
