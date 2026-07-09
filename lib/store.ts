import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Investment } from "./types";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface LedgerState {
  transactions: Transaction[];
  investments: Investment[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  addInvestment: (i: Omit<Investment, "id">) => void;
  removeInvestment: (id: string) => void;
  updateInvestment: (id: string, i: Partial<Investment>) => void;
}

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set) => ({
      transactions: [],
      investments: [],
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
    }),
    {
      name: "ledger-storage", // localStorage key
    }
  )
);
