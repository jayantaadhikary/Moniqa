import { create } from "zustand";

// Define interface for our category store state
interface CategoryState {
  // State
  categoryIcons: Record<string, string>;

  // Actions
  setCategoryIcons: (categories: Record<string, string>) => void;
  addCategory: (name: string, emoji: string) => void;
}

// Create the store
const useCategoryStore = create<CategoryState>((set) => ({
  // Initial state (same as in the original context)
  categoryIcons: {
    Dining: "🍕",
    Groceries: "🛒",
    Rent: "🏠",
    Transport: "🚗",
    Entertainment: "🎥",
    Utilities: "💡",
    Shopping: "🛍️",
  },

  // Actions
  setCategoryIcons: (categories) => set({ categoryIcons: categories }),

  addCategory: (name, emoji) =>
    set((state) => ({
      categoryIcons: { ...state.categoryIcons, [name]: emoji },
    })),
}));

export default useCategoryStore;
