import { create } from "zustand";
import { getItem, setItem } from "../utils/mmkv";

// Define interface for our category store state
interface CategoryState {
  // State
  masterCategoryIcons: Record<string, string>; // Holds all available master categories
  userCategoryIcons: Record<string, string>; // Holds user's selected/active categories (both master and custom)
  createdCustomCategories: Record<string, string>; // Holds all custom categories ever created by the user

  // Actions
  setUserCategoryIcons: (categories: Record<string, string>) => void;
  addCategory: (name: string, emoji: string) => void;
  toggleCategorySelection: (name: string) => void;
  deleteCustomCategory: (name: string) => void;
}

// Define a key for MMKV storage for user's selected categories
const USER_CATEGORY_ICONS_KEY = "userCategoryIcons";
// Define a key for MMKV storage for user's created custom categories
const CREATED_CUSTOM_CATEGORIES_KEY = "createdCustomCategories";

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
  return storedIcons ? JSON.parse(storedIcons) : {};
};

// Helper function to load initial created custom categories from MMKV
const loadCreatedCustomCategories = (): Record<string, string> => {
  const storedCustomIcons = getItem(CREATED_CUSTOM_CATEGORIES_KEY);
  return storedCustomIcons ? JSON.parse(storedCustomIcons) : {};
};

// Create the store
const useCategoryStore = create<CategoryState>((set) => ({
  // Initial state
  masterCategoryIcons: MASTER_CATEGORY_ICONS,
  userCategoryIcons: loadUserCategories(),
  createdCustomCategories: loadCreatedCustomCategories(),

  // Actions
  setUserCategoryIcons: (categories) => {
    setItem(USER_CATEGORY_ICONS_KEY, JSON.stringify(categories));
    set({ userCategoryIcons: categories });
  },

  addCategory: (name, emoji) =>
    set((state) => {
      // Add to created custom categories
      const updatedCreatedCustomCategories = {
        ...state.createdCustomCategories,
        [name]: emoji,
      };
      setItem(
        CREATED_CUSTOM_CATEGORIES_KEY,
        JSON.stringify(updatedCreatedCustomCategories)
      );

      // Also add to user selected categories (make it active by default)
      const updatedUserCategoryIcons = {
        ...state.userCategoryIcons,
        [name]: emoji,
      };
      setItem(
        USER_CATEGORY_ICONS_KEY,
        JSON.stringify(updatedUserCategoryIcons)
      );

      return {
        createdCustomCategories: updatedCreatedCustomCategories,
        userCategoryIcons: updatedUserCategoryIcons,
      };
    }),

  toggleCategorySelection: (name: string) =>
    set((state) => {
      const updatedUserCategoryIcons = { ...state.userCategoryIcons };
      if (updatedUserCategoryIcons[name]) {
        // Deselect: remove from userCategoryIcons
        delete updatedUserCategoryIcons[name];
      } else {
        // Select: add to userCategoryIcons
        // Check if it's a master category or an existing custom category
        if (state.masterCategoryIcons[name]) {
          updatedUserCategoryIcons[name] = state.masterCategoryIcons[name];
        } else if (state.createdCustomCategories[name]) {
          updatedUserCategoryIcons[name] = state.createdCustomCategories[name];
        }
      }
      setItem(
        USER_CATEGORY_ICONS_KEY,
        JSON.stringify(updatedUserCategoryIcons)
      );
      return { userCategoryIcons: updatedUserCategoryIcons };
    }),

  deleteCustomCategory: (name: string) =>
    set((state) => {
      let updatedUserCategoryIcons = { ...state.userCategoryIcons };
      let updatedCreatedCustomCategories = { ...state.createdCustomCategories };

      // Only proceed if it's a custom category (not in master list)
      if (
        state.createdCustomCategories[name] &&
        !state.masterCategoryIcons[name]
      ) {
        // Remove from user-selected categories if it exists there
        if (updatedUserCategoryIcons[name]) {
          delete updatedUserCategoryIcons[name];
          setItem(
            USER_CATEGORY_ICONS_KEY,
            JSON.stringify(updatedUserCategoryIcons)
          );
        }

        // Remove from created custom categories
        delete updatedCreatedCustomCategories[name];
        setItem(
          CREATED_CUSTOM_CATEGORIES_KEY,
          JSON.stringify(updatedCreatedCustomCategories)
        );
      }
      return {
        userCategoryIcons: updatedUserCategoryIcons,
        createdCustomCategories: updatedCreatedCustomCategories,
      };
    }),
}));

export default useCategoryStore;
