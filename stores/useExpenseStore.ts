import { create } from "zustand";
import mockExpenses from "../sampleData/mockExpenses";

// Define the Period type
export type Period = "Day" | "Week" | "Month";

// Define the expense type based on mockExpenses
export interface Expense {
  id: string;
  amount: string;
  category: string;
  emoji: string;
  date: string;
  note?: string;
}

// Define interface for our expense store state
interface ExpenseState {
  // Data
  expenses: Expense[];
  selectedPeriod: Period;
  budgetData: Record<Period, { spent: number; total: number }>;

  // Actions
  setSelectedPeriod: (period: Period) => void;
  addExpense: (expense: Expense) => void;
  editExpense: (id: string, updatedExpense: Expense) => void;
  deleteExpense: (id: string) => void;
  updateBudget: (period: Period, amount: number) => void;

  // Calculations
  getFilteredExpenses: () => Expense[];
  calculateSpent: (period: Period) => number;
}

// Create the store
const useExpenseStore = create<ExpenseState>((set, get) => ({
  // Initial state
  expenses: mockExpenses,
  selectedPeriod: "Week",
  budgetData: {
    Day: { spent: 100, total: 500 },
    Week: { spent: 100, total: 500 },
    Month: { spent: 2000, total: 5000 },
  },

  // Actions
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  addExpense: (expense) =>
    set((state) => ({
      expenses: [expense, ...state.expenses],
    })),

  editExpense: (id, updatedExpense) =>
    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      ),
    })),
  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    })),

  updateBudget: (period, amount) =>
    set((state) => ({
      budgetData: {
        ...state.budgetData,
        [period]: {
          ...state.budgetData[period],
          total: amount,
        },
      },
    })),

  // Calculations
  getFilteredExpenses: () => {
    const { expenses, selectedPeriod } = get();
    const now = new Date();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        if (selectedPeriod === "Day") {
          return expenseDate.toDateString() === now.toDateString();
        } else if (selectedPeriod === "Week") {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          return expenseDate >= startOfWeek && expenseDate <= now;
        } else if (selectedPeriod === "Month") {
          return (
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        }
        return false;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  calculateSpent: (period) => {
    const { expenses } = get();
    const now = new Date();

    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (period === "Day") {
        return expenseDate.toDateString() === now.toDateString();
      } else if (period === "Week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return expenseDate >= startOfWeek && expenseDate <= now;
      } else if (period === "Month") {
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      }
      return false;
    });

    return filteredExpenses.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );
  },
}));

export default useExpenseStore;
