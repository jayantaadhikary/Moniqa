import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = new MMKV({ id: "income-category-storage" });

// Define some default income categories/sources
const defaultIncomeCategories: { [key: string]: string } = {
  Salary: "💰",
  Freelance: "💼",
  Gifts: "🎁",
  Investments: "📈",
  Other: "🪙",
};

interface IncomeCategoryState {
  userIncomeCategoryIcons: { [key: string]: string };
}

const useIncomeCategoryStore = create<IncomeCategoryState>()(
  persist(
    () => ({
      userIncomeCategoryIcons: defaultIncomeCategories,
    }),
    {
      name: "income-category-store",
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

export default useIncomeCategoryStore;
