import { create } from "zustand";
import { getItem, setItem } from "../utils/mmkv";

const CURRENCY_SYMBOL_KEY = "selectedCurrencySymbol";
const CURRENCY_CODE_KEY = "selectedCurrencyCode";

interface UserPreferencesState {
  selectedCurrencySymbol: string;
  selectedCurrencyCode: string;
  setSelectedCurrency: (code: string, symbol: string) => void;
  loadCurrency: () => void;
}

const useUserPreferencesStore = create<UserPreferencesState>((set) => ({
  selectedCurrencySymbol: getItem(CURRENCY_SYMBOL_KEY) || "$", // Default to $
  selectedCurrencyCode: getItem(CURRENCY_CODE_KEY) || "USD", // Default to USD
  setSelectedCurrency: (code: string, symbol: string) => {
    setItem(CURRENCY_CODE_KEY, code);
    setItem(CURRENCY_SYMBOL_KEY, symbol);
    set({ selectedCurrencyCode: code, selectedCurrencySymbol: symbol });
  },
  loadCurrency: () => {
    // Action to explicitly reload from MMKV if needed
    const symbol = getItem(CURRENCY_SYMBOL_KEY) || "$";
    const code = getItem(CURRENCY_CODE_KEY) || "USD";
    set({ selectedCurrencySymbol: symbol, selectedCurrencyCode: code });
  },
}));

// Call loadCurrency on store initialization if values might change externally
// and you want the store to pick them up without an explicit call after setup.
// However, initial values are already set from getItem during create.
// This explicit loadCurrency can be used if, for example, another part of the app
// modifies MMKV directly and the store needs to be refreshed.
// For the initial setup via initialData.tsx, the values will be set there,
// and subsequent app loads will pick them up via getItem in the store's initial state.

export default useUserPreferencesStore;
