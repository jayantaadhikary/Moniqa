import { create } from "zustand";
import { getItem, setItem } from "../utils/mmkv";

// Define interface for our category store state
interface CategoryState {
  // State
  categoryIcons: Record<string, string>;

  // Actions
  setCategoryIcons: (categories: Record<string, string>) => void;
  addCategory: (name: string, emoji: string) => void;
}

// Define a key for MMKV storage
const CATEGORY_ICONS_KEY = "categoryIcons";

// Helper function to load initial state from MMKV
const loadInitialState = (): Record<string, string> => {
  const storedIcons = getItem(CATEGORY_ICONS_KEY);
  return storedIcons
    ? JSON.parse(storedIcons)
    : {
        Dining: "🍕",
        Groceries: "🛒",
        Rent: "🏠",
        Transport: "🚗",
        Entertainment: "🎥",
        Utilities: "💡",
        Shopping: "🛍️",
        Health: "💊",
        Subscriptions: "📅",
        Investments: "📈",
        Hygiene: "🧼",
        Miscellaneous: "🗂️",
      };
};

// Create the store
const useCategoryStore = create<CategoryState>((set) => ({
  // Initial state
  categoryIcons: loadInitialState(),

  // Actions
  setCategoryIcons: (categories) => {
    setItem(CATEGORY_ICONS_KEY, JSON.stringify(categories));
    set({ categoryIcons: categories });
  },

  addCategory: (name, emoji) =>
    set((state) => {
      const updatedIcons = { ...state.categoryIcons, [name]: emoji };
      setItem(CATEGORY_ICONS_KEY, JSON.stringify(updatedIcons));
      return { categoryIcons: updatedIcons };
    }),
}));

export default useCategoryStore;
