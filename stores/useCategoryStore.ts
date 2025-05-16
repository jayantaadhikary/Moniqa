import { create } from "zustand";
import { getItem, setItem } from "../utils/mmkv";

// Define interface for our category store state
interface CategoryState {
  // State
  masterCategoryIcons: Record<string, string>; // Holds all available categories
  userCategoryIcons: Record<string, string>; // Holds user's selected/default categories

  // Actions
  setUserCategoryIcons: (categories: Record<string, string>) => void;
  addCategory: (name: string, emoji: string) => void;
}

// Define a key for MMKV storage for user's selected categories
const USER_CATEGORY_ICONS_KEY = "userCategoryIcons";

// Master list of all available categories
const MASTER_CATEGORY_ICONS: Record<string, string> = {
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
  // Add more master categories here if needed in the future
};

// Helper function to load initial user-selected state from MMKV
const loadUserCategories = (): Record<string, string> => {
  const storedIcons = getItem(USER_CATEGORY_ICONS_KEY);
  // If nothing is stored for user categories, default to an empty object.
  // initialData screen will populate this.
  return storedIcons ? JSON.parse(storedIcons) : {};
};

// Create the store
const useCategoryStore = create<CategoryState>((set) => ({
  // Initial state
  masterCategoryIcons: MASTER_CATEGORY_ICONS,
  userCategoryIcons: loadUserCategories(),

  // Actions
  setUserCategoryIcons: (categories) => {
    setItem(USER_CATEGORY_ICONS_KEY, JSON.stringify(categories));
    set({ userCategoryIcons: categories });
  },

  addCategory: (name, emoji) =>
    set((state) => {
      const updatedIcons = { ...state.userCategoryIcons, [name]: emoji };
      setItem(USER_CATEGORY_ICONS_KEY, JSON.stringify(updatedIcons));
      // Optionally, if adding a new category should also update the master list (e.g., for future global availability)
      // This depends on the desired app logic. For now, we only add to user's list.
      // const updatedMasterIcons = { ...state.masterCategoryIcons, [name]: emoji };
      return {
        userCategoryIcons:
          updatedIcons /* , masterCategoryIcons: updatedMasterIcons */,
      };
    }),
}));

export default useCategoryStore;
