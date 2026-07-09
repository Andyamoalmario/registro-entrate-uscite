import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Investment, Debt } from "./types";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface LedgerState {
  transactions: Transaction[];
  investments: Investment[];
  debts: Debt[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  addInvestment: (i: Omit<Investment, "id">) => void;
  removeInvestment: (id: string) => void;
  updateInvestment: (id: string, i: Partial<Investment>) => void;
  addDebt: (d: Omit<Debt, "id">) => void;
  removeDebt: (id: string) => void;
  updateDebt: (id: string, d: Partial<Debt>) => void;
}

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set) => ({
      transactions: [],
      investments: [],
      debts: [],
      addTransaction: (t) =>
        set((state) => ({
          transactions: [...state.transactions, { ...t, id: makeId() }],
        })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      updateTransaction: (id, patch) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        })),
      addInvestment: (i) =>
        set((state) => ({
          investments: [...state.investments, { ...i, id: makeId() }],
        })),
      removeInvestment: (id) =>
        set((state) => ({
          investments: state.investments.filter((i) => i.id !== id),
        })),
      updateInvestment: (id, patch) =>
        set((state) => ({
          investments: state.investments.map((i) =>
            i.id === id ? { ...i, ...patch } : i
          ),
        })),
      addDebt: (d) =>
        set((state) => ({
          debts: [...state.debts, { ...d, id: makeId() }],
        })),
      removeDebt: (id) =>
        set((state) => ({
          debts: state.debts.filter((d) => d.id !== id),
        })),
      updateDebt: (id, patch) =>
        set((state) => ({
          debts: state.debts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
    }),
    {
      name: "ledger-storage", // localStorage key
    }
  )
);
