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
}

const useIncomeStore = create<IncomeState>()(
  persist(
    (set) => ({
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
