import {
  endOfDay as dateFnsEndOfDay,
  startOfWeek as dateFnsStartOfWeek,
} from "date-fns";
import { create } from "zustand";
import { getItem, setItem } from "../utils/mmkv";

// Define Period as a string enum for easier iteration
export enum Period {
  Day = "Day",
  Week = "Week",
  Month = "Month",
}

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
  updateBudget: (period: Period, newTotal: number) => void; // Kept for settings
  setInitialBudgetData: (monthlyBudgetTotal: number) => void; // Changed from setBudgetData
  resetExpenses: () => void; // Added resetExpenses action

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
    expenses: expenses ? JSON.parse(expenses) : [],
    selectedPeriod: (selectedPeriod as Period) || Period.Month,
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

  updateBudget: (period, newTotal) => {
    set((state) => {
      const updatedBudgetData = {
        ...state.budgetData,
        [period]: {
          ...state.budgetData[period],
          total: newTotal, // Ensure this updates the total
        },
      };
      setItem("budgetData", JSON.stringify(updatedBudgetData));
      return { budgetData: updatedBudgetData };
    });
  },

  // Renamed and modified to accept only monthly total
  setInitialBudgetData: (monthlyBudgetTotal: number) => {
    const daysInMonth = 30.44; // Average days in a month
    const weeksInMonth = daysInMonth / 7; // Average weeks in a month

    const dailyBudgetTotal = monthlyBudgetTotal / daysInMonth;
    const weeklyBudgetTotal = monthlyBudgetTotal / weeksInMonth;

    const newBudgetData = {
      Day: { spent: 0, total: parseFloat(dailyBudgetTotal.toFixed(2)) },
      Week: { spent: 0, total: parseFloat(weeklyBudgetTotal.toFixed(2)) },
      Month: { spent: 0, total: parseFloat(monthlyBudgetTotal.toFixed(2)) },
    };

    setItem("budgetData", JSON.stringify(newBudgetData));
    set({ budgetData: newBudgetData });
  },

  resetExpenses: () => {
    set({ expenses: [] });
    setItem("expenses", JSON.stringify([]));
  },

  // Calculations
  getFilteredExpenses: () => {
    const { expenses, selectedPeriod } = get();
    const now = new Date();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        if (selectedPeriod === Period.Day) {
          return expenseDate.toDateString() === now.toDateString();
        } else if (selectedPeriod === Period.Week) {
          const startOfTheWeek = dateFnsStartOfWeek(now, { weekStartsOn: 0 }); // Sunday, 00:00:00
          const endOfTheCurrentDay = dateFnsEndOfDay(now); // Current day, 23:59:59
          return (
            expenseDate >= startOfTheWeek && expenseDate <= endOfTheCurrentDay
          );
        } else if (selectedPeriod === Period.Month) {
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
      if (period === Period.Day) {
        return expenseDate.toDateString() === now.toDateString();
      } else if (period === Period.Week) {
        const startOfTheWeek = dateFnsStartOfWeek(now, { weekStartsOn: 0 }); // Sunday, 00:00:00
        const endOfTheCurrentDay = dateFnsEndOfDay(now); // Current day, 23:59:59
        return (
          expenseDate >= startOfTheWeek && expenseDate <= endOfTheCurrentDay
        );
      } else if (period === Period.Month) {
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
