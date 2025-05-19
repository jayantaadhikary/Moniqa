import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from "date-fns";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Initialize MMKV storage
const storage = new MMKV({ id: "income-storage" });

export interface Income {
  id: string;
  amount: string; // Storing as string, consistent with expense input
  source: string; // e.g., Salary, Freelance, Gift
  emoji: string;
  date: string; // ISO string
  note?: string;
}

interface IncomeState {
  incomes: Income[];
  addIncome: (income: Income) => void;
  editIncome: (updatedIncome: Income) => void;
  deleteIncome: (incomeId: string) => void;
  calculateCurrentMonthIncome: () => number;
}

const useIncomeStore = create<IncomeState>()(
  persist(
    (set, get) => ({
      incomes: [],
      addIncome: (income) =>
        set((state) => ({ incomes: [...state.incomes, income] })),
      editIncome: (updatedIncome) =>
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === updatedIncome.id ? updatedIncome : income
          ),
        })),
      deleteIncome: (incomeId) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== incomeId),
        })),
      calculateCurrentMonthIncome: () => {
        const { incomes } = get();
        const now = new Date();
        const interval = { start: startOfMonth(now), end: endOfMonth(now) };

        return incomes.reduce((total, income) => {
          const incomeDate = parseISO(income.date);
          if (isWithinInterval(incomeDate, interval)) {
            const amount = parseFloat(income.amount);
            return total + (isNaN(amount) ? 0 : amount);
          }
          return total;
        }, 0);
      },
    }),
    {
      name: "income-store",
      storage: createJSONStorage(() => ({
        setItem: (name, value) => storage.set(name, value),
        getItem: (name) => {
          const value = storage.getString(name);
          return value ?? null;
        },
        removeItem: (name) => storage.delete(name),
      })),
    }
  )
);

export default useIncomeStore;
