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
import { Currency, majorCurrencies } from "../constants/currencies"; // Import from constants
import useCategoryStore from "../stores/useCategoryStore";
import useExpenseStore from "../stores/useExpenseStore";
import useUserPreferencesStore from "../stores/useUserPreferencesStore"; // Import the new store

const InitialData: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [budget, setBudget] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const { masterCategoryIcons, setUserCategoryIcons } = useCategoryStore();
  const { setInitialBudgetData } = useExpenseStore(); // Changed from setBudgetData
  const { setSelectedCurrency: setSelectedCurrencyInStore } =
    useUserPreferencesStore();

  const [allAvailableCategoryIcons] =
    useState<Record<string, string>>(masterCategoryIcons);
  const [userChosenDefaultCategories, setUserChosenDefaultCategories] =
    useState<Record<string, string>>({});

  const handleCategorySelection = (categoryName: string) => {
    setUserChosenDefaultCategories((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[categoryName]) {
        delete newSelected[categoryName];
      } else {
        if (Object.keys(newSelected).length < 6) {
          newSelected[categoryName] = allAvailableCategoryIcons[categoryName];
        }
      }
      return newSelected;
    });
  };

  const handleBudgetChange = (value: string) => {
    const validValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");

    if (validValue.length > 8) {
      Alert.alert("Limit Reached", "Budget cannot exceed 8 digits.");
      return;
    }

    setBudget(validValue);
  };

  const handleProceed = () => {
    if (
      !selectedCurrency ||
      !budget ||
      Object.keys(userChosenDefaultCategories).length === 0
    ) {
      Alert.alert("Incomplete Setup", "Please fill all fields to proceed.");
      return;
    }

    const monthlyBudgetFloat = parseFloat(budget);
    if (isNaN(monthlyBudgetFloat) || monthlyBudgetFloat <= 0) {
      Alert.alert(
        "Invalid Budget",
        "Please enter a valid positive budget amount."
      );
      return;
    }
    if (budget.length > 8) {
      Alert.alert("Limit Reached", "Budget cannot exceed 8 digits.");
      return;
    }

    const currencyDetails = majorCurrencies.find(
      (c: Currency) => c.value === selectedCurrency // Use .value for comparison
    );
    const currentSymbol = currencyDetails ? currencyDetails.symbol : "$";
    const currentCode = selectedCurrency;

    setSelectedCurrencyInStore(currentCode, currentSymbol); // Update the store

    setInitialBudgetData(monthlyBudgetFloat); // Using the new setInitialBudgetData action

    setUserCategoryIcons(userChosenDefaultCategories);

    router.push("/(tabs)/(home)");
  };

  const renderCategoryItem = ({
    item,
  }: {
    item: { name: string; emoji: string };
  }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        userChosenDefaultCategories[item.name] ? styles.selectedCategory : {},
      ]}
      onPress={() => handleCategorySelection(item.name)}
    >
      <Text style={styles.categoryText}>
        {item.emoji} {item.name}
      </Text>
    </TouchableOpacity>
  );

  const categoriesForDisplay = Object.entries(allAvailableCategoryIcons).map(
    ([name, emoji]) => ({ name, emoji })
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Preferences 💰</Text>

            <Text style={styles.label}>Select Currency</Text>
            <DropDownPicker
              open={dropdownOpen}
              value={selectedCurrency}
              items={majorCurrencies.map((currency: Currency) => ({
                label: `${currency.symbol} - ${currency.label}`, // Use .label and .symbol
                value: currency.value, // Use .value
              }))}
              setOpen={setDropdownOpen}
              setValue={setSelectedCurrency}
              style={styles.dropdownPicker}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={{ color: AppColors.dark.text }}
              theme="DARK"
              listMode="MODAL"
            />

            <Text style={styles.label}>Set Your Monthly Budget</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter monthly budget..."
              keyboardType="numeric"
              value={budget}
              onChangeText={handleBudgetChange}
              placeholderTextColor={AppColors.dark.secondaryText}
              maxLength={8}
            />

            <Text style={styles.label}>
              Choose Default Categories (up to 6)
            </Text>
            <FlatList
              data={categoriesForDisplay}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.name}
              numColumns={2}
            />
            <Text style={styles.note}>
              You can customize or add more categories anytime in Settings.
            </Text>

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
