import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Investment, DebtEntry, HouseholdExpense, HouseholdSalaries } from "./types";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Shape of debt entries from before the "Splitwise-style" redesign
// (single direction, with a paid/unpaid flag instead of a type).
interface LegacyDebt {
  id: string;
  person: string;
  amount: number;
  note?: string;
  date: string;
  paid?: boolean;
  type?: DebtEntry["type"];
}

function migrateLegacyDebts(rawDebts: unknown): DebtEntry[] {
  if (!Array.isArray(rawDebts)) return [];
  const migrated: DebtEntry[] = [];
  (rawDebts as LegacyDebt[]).forEach((d) => {
    if (d.type) {
      // Already in the new shape, keep as-is.
      migrated.push(d as DebtEntry);
      return;
    }
    // Old entries only ever meant "money I owe them".
    migrated.push({
      id: d.id,
      person: d.person,
      amount: d.amount,
      type: "devo",
      note: d.note,
      date: d.date,
    });
    // If it was marked paid, add a matching payment so the net balance
    // comes out to zero, preserving what "paid" used to mean.
    if (d.paid) {
      migrated.push({
        id: `${d.id}-migrato`,
        person: d.person,
        amount: d.amount,
        type: "ho_restituito",
        note: "Migrato automaticamente (era segnato come pagato)",
        date: d.date,
      });
    }
  });
  return migrated;
}

interface LedgerState {
  transactions: Transaction[];
  investments: Investment[];
  debts: DebtEntry[];
  theme: string;
  dashboardWidgets: string[];
  widgetSizes: Record<string, "half" | "full">;
  ownerName: string;
  householdExpenses: HouseholdExpense[];
  householdSalaries: HouseholdSalaries;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  addInvestment: (i: Omit<Investment, "id">) => void;
  removeInvestment: (id: string) => void;
  updateInvestment: (id: string, i: Partial<Investment>) => void;
  addDebt: (d: Omit<DebtEntry, "id">) => void;
  removeDebt: (id: string) => void;
  updateDebt: (id: string, d: Partial<DebtEntry>) => void;
  setTheme: (id: string) => void;
  toggleDashboardWidget: (id: string) => void;
  reorderDashboardWidget: (id: string, direction: "up" | "down") => void;
  setWidgetSize: (id: string, size: "half" | "full") => void;
  setOwnerName: (name: string) => void;
  addHouseholdExpense: (e: Omit<HouseholdExpense, "id">) => void;
  removeHouseholdExpense: (id: string) => void;
  updateHouseholdExpense: (id: string, e: Partial<HouseholdExpense>) => void;
  setHouseholdSalaries: (patch: Partial<HouseholdSalaries>) => void;
}

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set) => ({
      transactions: [],
      investments: [],
      debts: [],
      theme: "azzurro",
      dashboardWidgets: [
        "saldo-mese",
        "grafico-mensile",
        "categorie-uscite",
        "panoramica-annuale",
      ],
      widgetSizes: {},
      ownerName: "",
      householdExpenses: [],
      householdSalaries: {
        person1Name: "",
        person1Salary: 0,
        person2Name: "",
        person2Salary: 0,
      },
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
      setTheme: (id) => set({ theme: id }),
      toggleDashboardWidget: (id) =>
        set((state) => ({
          dashboardWidgets: state.dashboardWidgets.includes(id)
            ? state.dashboardWidgets.filter((w) => w !== id)
            : [...state.dashboardWidgets, id],
        })),
      reorderDashboardWidget: (id, direction) =>
        set((state) => {
          const list = [...state.dashboardWidgets];
          const index = list.indexOf(id);
          if (index === -1) return {};
          const swapWith = direction === "up" ? index - 1 : index + 1;
          if (swapWith < 0 || swapWith >= list.length) return {};
          [list[index], list[swapWith]] = [list[swapWith], list[index]];
          return { dashboardWidgets: list };
        }),
      setWidgetSize: (id, size) =>
        set((state) => ({
          widgetSizes: { ...state.widgetSizes, [id]: size },
        })),
      setOwnerName: (name) => set({ ownerName: name }),
      addHouseholdExpense: (e) =>
        set((state) => ({
          householdExpenses: [...state.householdExpenses, { ...e, id: makeId() }],
        })),
      removeHouseholdExpense: (id) =>
        set((state) => ({
          householdExpenses: state.householdExpenses.filter((e) => e.id !== id),
        })),
      updateHouseholdExpense: (id, patch) =>
        set((state) => ({
          householdExpenses: state.householdExpenses.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        })),
      setHouseholdSalaries: (patch) =>
        set((state) => ({
          householdSalaries: { ...state.householdSalaries, ...patch },
        })),
    }),
    {
      name: "ledger-storage", // localStorage key
      version: 1,
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<LedgerState> & { debts?: unknown };
        if (version < 1 && state?.debts) {
          return { ...state, debts: migrateLegacyDebts(state.debts) };
        }
        return persistedState;
      },
    }
  )
);
