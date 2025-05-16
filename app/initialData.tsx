import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { AppColors } from "../constants/Colors";
import useCategoryStore from "../stores/useCategoryStore";

const majorCurrencies = [
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "GBP", name: "British Pound Sterling", symbol: "£" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan Renminbi", symbol: "¥" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
];

const InitialData = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [budget, setBudget] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const categoryIcons = useCategoryStore((state) => state.categoryIcons);
  const defaultCategories = Object.keys(categoryIcons);

  const handleCategorySelection = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else if (selectedCategories.length < 6) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      Alert.alert(
        "Limit Reached",
        "You can only select up to 6 categories here. Add more later in settings."
      );
    }
  };

  const handleBudgetChange = (value: string) => {
    // Allow only numbers and a single decimal point
    const validValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");

    if (validValue.length > 8) {
      Alert.alert("Limit Reached", "Budget cannot exceed 10 digits.");
      setBudget("");
      return;
    }

    setBudget(validValue);
  };

  const handleProceed = () => {
    if (!selectedCurrency || !budget || selectedCategories.length === 0) {
      Alert.alert("Incomplete Setup", "Please fill all fields to proceed.");
      return;
    }

    // Save data to store or backend here

    router.push("/(tabs)/(home)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Preferences 💰</Text>

            {/* Currency Selection */}
            <Text style={styles.label}>Select Currency</Text>
            <DropDownPicker
              open={dropdownOpen}
              value={selectedCurrency}
              items={majorCurrencies.map((currency) => ({
                label: `${currency.symbol} - ${currency.name}`,
                value: currency.code,
              }))}
              setOpen={setDropdownOpen}
              setValue={setSelectedCurrency}
              style={styles.dropdownPicker}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={{ color: AppColors.dark.text }}
              theme="DARK"
            />

            {/* Budget Input */}
            <Text style={styles.label}>Set Your Monthly Budget</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter monthly budget..."
              keyboardType="numeric"
              value={budget}
              onChangeText={handleBudgetChange}
              placeholderTextColor={AppColors.dark.secondaryText}
            />

            {/* Category Selection */}
            <Text style={styles.label}>Choose Default Categories</Text>
            <FlatList
              data={defaultCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategories.includes(item) &&
                      styles.selectedCategory,
                  ]}
                  onPress={() => handleCategorySelection(item)}
                >
                  <Text style={styles.categoryText}>
                    {categoryIcons[item]} {item}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={2}
            />
            <Text style={styles.note}>
              You can customize or add more categories anytime in Settings.
            </Text>

            {/* Proceed Button */}
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceed}
            >
              <Text style={styles.proceedButtonText}>Proceed to Home</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InitialData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginVertical: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: AppColors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.dark.secondaryBackground,
    borderRadius: 8,
    padding: 12,
    color: AppColors.dark.text,
    marginBottom: 16,
  },
  dropdownPicker: {
    // backgroundColor: AppColors.dark.tint,
    backgroundColor: AppColors.dark.secondaryBackground,
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownContainer: {
    backgroundColor: AppColors.dark.secondaryBackground,
    borderRadius: 20,
  },
  categoryItem: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 8,
    // backgroundColor: AppColors.dark.tint + "20",
    backgroundColor: AppColors.dark.secondaryBackground,
    alignItems: "center",
  },
  selectedCategory: {
    backgroundColor: AppColors.dark.tint,
  },
  categoryText: {
    color: AppColors.dark.text,
  },
  note: {
    fontSize: 12,
    color: AppColors.dark.secondaryText,
    marginTop: 8,
    textAlign: "center",
  },
  proceedButton: {
    backgroundColor: AppColors.dark.tint,
    borderRadius: 14,
    paddingVertical: 12,
    margin: 20,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
