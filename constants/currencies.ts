export interface Currency {
  label: string; // e.g., "US Dollar"
  value: string; // e.g., "USD"
  symbol: string; // e.g., "$"
}

export const majorCurrencies: Currency[] = [
  { label: "US Dollar", value: "USD", symbol: "$" },
  { label: "Euro", value: "EUR", symbol: "€" },
  { label: "Indian Rupee", value: "INR", symbol: "₹" },
  { label: "Japanese Yen", value: "JPY", symbol: "¥" },
  { label: "British Pound", value: "GBP", symbol: "£" },
  { label: "Australian Dollar", value: "AUD", symbol: "A$" },
  { label: "Canadian Dollar", value: "CAD", symbol: "CA$" },
  { label: "Swiss Franc", value: "CHF", symbol: "CHF" },
  { label: "Chinese Yuan", value: "CNY", symbol: "¥" },
  { label: "Swedish Krona", value: "SEK", symbol: "kr" },
  { label: "New Zealand Dollar", value: "NZD", symbol: "NZ$" },
  { label: "Mexican Peso", value: "MXN", symbol: "Mex$" },
  { label: "Singapore Dollar", value: "SGD", symbol: "S$" },
  { label: "Hong Kong Dollar", value: "HKD", symbol: "HK$" },
  { label: "Norwegian Krone", value: "NOK", symbol: "kr" },
  { label: "South Korean Won", value: "KRW", symbol: "₩" },
  { label: "Turkish Lira", value: "TRY", symbol: "₺" },
  { label: "Russian Ruble", value: "RUB", symbol: "₽" },
  { label: "Brazilian Real", value: "BRL", symbol: "R$" },
  { label: "South African Rand", value: "ZAR", symbol: "R" },
  { label: "Philippine Peso", value: "PHP", symbol: "₱" },
  { label: "Indonesian Rupiah", value: "IDR", symbol: "Rp" },
  { label: "Malaysian Ringgit", value: "MYR", symbol: "RM" },
  { label: "Thai Baht", value: "THB", symbol: "฿" },
  { label: "Vietnamese Dong", value: "VND", symbol: "₫" },
  { label: "Saudi Riyal", value: "SAR", symbol: "ر.س" },
  { label: "United Arab Emirates Dirham", value: "AED", symbol: "د.إ" },
  { label: "Qatari Rial", value: "QAR", symbol: "ر.ق" },
  { label: "Kuwaiti Dinar", value: "KWD", symbol: "د.ك" },
  { label: "Nigerian Naira", value: "NGN", symbol: "₦" },
];

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = majorCurrencies.find((c) => c.value === currencyCode);
  return currency ? currency.symbol : currencyCode; // Fallback to code if symbol not found
};
