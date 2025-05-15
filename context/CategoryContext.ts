import { createContext, useContext } from "react";

export const CategoryContext = createContext<{
  categoryIcons: Record<string, string>;
  setCategoryIcons: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}>({
  categoryIcons: {
    Dining: "🍕",
    Groceries: "🛒",
    Transport: "🚗",
    Entertainment: "🎥",
  },
  setCategoryIcons: () => {},
});

export const useCategoryContext = () => useContext(CategoryContext);
