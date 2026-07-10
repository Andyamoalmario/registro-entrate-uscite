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

export type DebtEntryType = "devo" | "mi_deve" | "ho_restituito" | "mi_ha_restituito";

export const DEBT_TYPE_LABELS: Record<DebtEntryType, string> = {
  devo: "Gli devo",
  mi_deve: "Mi deve",
  ho_restituito: "Gli ho restituito (rata)",
  mi_ha_restituito: "Mi ha restituito (rata)",
};

// +1 increases how much they owe me, -1 increases how much I owe them
export const DEBT_TYPE_SIGN: Record<DebtEntryType, 1 | -1> = {
  devo: -1,
  mi_deve: 1,
  ho_restituito: 1,
  mi_ha_restituito: -1,
};

export interface DebtEntry {
  id: string;
  person: string;
  amount: number;
  type: DebtEntryType;
  note?: string;
  date: string;
}

export interface HouseholdExpense {
  id: string;
  name: string;
  amount: number;
  note?: string;
}

export interface HouseholdSalaries {
  person1Name: string;
  person1Salary: number;
  person2Name: string;
  person2Salary: number;
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
