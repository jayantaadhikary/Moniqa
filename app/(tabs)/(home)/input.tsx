import { DateTimePicker as DateTimePickerAndroid } from "@expo/ui/jetpack-compose";
import { DateTimePicker } from "@expo/ui/swift-ui";
import { isFuture } from "date-fns"; // Added isFuture from date-fns
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, // Added Alert
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import { AppColors } from "../../../constants/Colors";
import useCategoryStore from "../../../stores/useCategoryStore";
import useExpenseStore from "../../../stores/useExpenseStore";
import useUserPreferencesStore from "../../../stores/useUserPreferencesStore";

const InputPage = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [emoji, setEmoji] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Using Zustand store
  // Get userCategoryIcons which holds the user's selected default categories
  const userCategoryIcons = useCategoryStore(
    (state) => state.userCategoryIcons
  );
  const addCategoryToStore = useCategoryStore((state) => state.addCategory); // Renamed for clarity if used
  const addExpense = useExpenseStore((state) => state.addExpense);
  const { selectedCurrencySymbol } = useUserPreferencesStore();

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Your expense has been successfully added.",
      position: "bottom",
      visibilityTime: 2000,
      autoHide: true,
      bottomOffset: 50,
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && emoji) {
      console.log("Adding category:", newCategory, "with emoji:", emoji);
      // This adds the new category to the user's list in the store
      addCategoryToStore(newCategory, emoji);
      setCategory(newCategory); // Set the current expense category to the new one
      setNewCategory("");
      setEmoji(null);
      setShowAddCategoryModal(false);
    } else {
      console.log("Category name or emoji is missing.");
    }
  };

  const handleExpenseSubmit = () => {
    if (!amount || !category) {
      Alert.alert("Missing Information", "Amount and category are required."); // Updated Alert message
      return;
    }

    // validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive amount."); // Updated Alert message
      return;
    }

    // Validate date - prevent future dates
    if (isFuture(date)) {
      Alert.alert(
        "Invalid Date",
        "Future dates are not allowed for expenses. Please select a current or past date."
      );
      return;
    }

    addExpense({
      id: uuidv4(),
      amount,
      category,
      // Use the emoji from userCategoryIcons, fallback if somehow not there
      emoji: userCategoryIcons[category] || "❓",
      date: date.toISOString(),
      note,
    });

    showToast();

    router.replace("/(tabs)/(home)");
  };

  // Display categories from the user's selected defaults
  const categoryList = Object.keys(userCategoryIcons);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.header}>Add Expenses</Text>

        {/* Amount and Date Picker */}
        <View style={styles.horizontalContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>💵 Amount</Text>
            <Text style={styles.label}>📅 Date</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={`${selectedCurrencySymbol}0.00`}
              placeholderTextColor={AppColors.dark.secondaryText}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
            {Platform.OS === "ios" ? (
              <DateTimePicker
                initialDate={date.toISOString()}
                onDateSelected={(date) => {
                  setDate(date);
                }}
                title=""
                variant="compact"
                color={AppColors.dark.tint}
                displayedComponents="date"
              />
            ) : (
              <DateTimePickerAndroid
                onDateSelected={(date) => {
                  setDate(date);
                }}
                displayedComponents="date"
                initialDate={date.toISOString()}
                variant="input"
                color={AppColors.dark.tint}
              />
            )}

            {/* <DateTimePicker
              value={date}
              mode="date"
              display="inline"
              onChange={(event, selectedDate) => setDate(selectedDate || date)}
              themeVariant="dark"
            /> */}
          </View>
        </View>

        {/* Category Selection */}
        <Text style={styles.label}>🗂️ Category</Text>
        <View style={styles.categoryContainer}>
          {categoryList.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                category === item && styles.selectedCategory,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text style={styles.categoryText}>
                {userCategoryIcons[item]} {item}{" "}
                {/* Display emoji from userCategoryIcons */}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => setShowAddCategoryModal(true)}
          >
            <Text style={styles.addCategoryText}>➕ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Add Category Modal */}
        <Modal
          visible={showAddCategoryModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Category</Text>

              {emoji === null ? (
                <View style={{ width: "100%", height: 250 }}>
                  <EmojiSelector
                    onEmojiSelected={(selectedEmoji: string) => {
                      console.log("Emoji selected:", selectedEmoji);
                      setEmoji(selectedEmoji);
                    }}
                    showSearchBar={false}
                    showTabs={false}
                    showSectionTitles={false}
                    columns={6}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    console.log("Opening emoji picker");
                    setEmoji(null); // Reset emoji selection
                  }}
                >
                  <Text style={{ color: AppColors.dark.text }}>
                    {emoji || "Select Emoji"}
                  </Text>
                </TouchableOpacity>
              )}

              <TextInput
                style={styles.input}
                placeholder="Enter category name (e.g., Art)"
                placeholderTextColor={AppColors.dark.secondaryText}
                value={newCategory}
                onChangeText={setNewCategory}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddCategoryModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddCategory}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Note Input */}
        <Text style={styles.label}>📝 Note (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a note"
          placeholderTextColor={AppColors.dark.secondaryText}
          maxLength={40}
          value={note}
          onChangeText={setNote}
        />

        {/* Submit Expense Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            handleExpenseSubmit();
          }}
        >
          <Text style={styles.submitButtonText}>Submit Expense</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
    padding: 16,
  },
  header: {
    color: AppColors.dark.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  labelContainer: {
    flex: 1,
  },
  inputContainer: {
    // flex: 2,
  },
  label: {
    color: AppColors.dark.text,
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: AppColors.dark.secondaryBackground,
    color: AppColors.dark.text,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: AppColors.dark.secondaryBackground,
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: AppColors.dark.tint,
  },
  categoryText: {
    color: AppColors.dark.text,
  },
  addCategoryButton: {
    backgroundColor: AppColors.dark.secondaryBackground,
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addCategoryText: {
    color: AppColors.dark.text,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: AppColors.dark.background,
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    color: AppColors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: AppColors.dark.secondaryBackground,
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: AppColors.dark.text,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: AppColors.dark.tint,
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: AppColors.dark.text,
    textAlign: "center",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: AppColors.dark.tint,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: AppColors.dark.text,
    fontWeight: "bold",
  },
});
