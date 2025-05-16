import { create } from "zustand";
import mockExpenses from "../sampleData/mockExpenses";
import { getItem, setItem } from "../utils/mmkv";

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

// Helper function to load initial state from MMKV
const loadInitialState = () => {
  const expenses = getItem("expenses");
  const selectedPeriod = getItem("selectedPeriod");
  const budgetData = getItem("budgetData");

  return {
    expenses: expenses ? JSON.parse(expenses) : mockExpenses,
    selectedPeriod: (selectedPeriod as Period) || "Week",
    budgetData: budgetData
      ? JSON.parse(budgetData)
      : {
          Day: { spent: 100, total: 500 },
          Week: { spent: 100, total: 500 },
          Month: { spent: 2000, total: 5000 },
        },
  };
};

// Create the store
const useExpenseStore = create<ExpenseState>((set, get) => ({
  // Initial state
  ...loadInitialState(),

  // Actions
  setSelectedPeriod: (period) => {
    set({ selectedPeriod: period });
    setItem("selectedPeriod", period);
  },

  addExpense: (expense) => {
    set((state) => {
      const updatedExpenses = [expense, ...state.expenses];
      setItem("expenses", JSON.stringify(updatedExpenses));
      return { expenses: updatedExpenses };
    });
  },

  editExpense: (id, updatedExpense) => {
    set((state) => {
      const updatedExpenses = state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      );
      setItem("expenses", JSON.stringify(updatedExpenses));
      return { expenses: updatedExpenses };
    });
  },

  deleteExpense: (id) => {
    set((state) => {
      const updatedExpenses = state.expenses.filter(
        (expense) => expense.id !== id
      );
      setItem("expenses", JSON.stringify(updatedExpenses));
      return { expenses: updatedExpenses };
    });
  },

  updateBudget: (period, amount) => {
    set((state) => {
      const updatedBudgetData = {
        ...state.budgetData,
        [period]: {
          ...state.budgetData[period],
          total: amount,
        },
      };
      setItem("budgetData", JSON.stringify(updatedBudgetData));
      return { budgetData: updatedBudgetData };
    });
  },

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
