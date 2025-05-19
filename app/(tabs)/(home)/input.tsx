import { DateTimePicker as DateTimePickerAndroid } from "@expo/ui/jetpack-compose";
import { DateTimePicker } from "@expo/ui/swift-ui";
import { isFuture } from "date-fns";
import { useRouter } from "expo-router"; // Added this line
import React, { useCallback, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import "react-native-get-random-values"; // Polyfill must be the very first import
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import { AppColors } from "../../../constants/Colors";
import useCategoryStore from "../../../stores/useCategoryStore";
import useExpenseStore from "../../../stores/useExpenseStore";
import useIncomeCategoryStore from "../../../stores/useIncomeCategoryStore";
import useIncomeStore from "../../../stores/useIncomeStore";
import useUserPreferencesStore from "../../../stores/useUserPreferencesStore";

type FormMode = "expense" | "income";

const InputPage = () => {
  const router = useRouter(); // Added this line
  const [formMode, setFormMode] = useState<FormMode>("expense");

  const [expenseAmount, setExpenseAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseEmoji, setExpenseEmoji] = useState<string | null>(null);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [expenseNote, setExpenseNote] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [incomeAmount, setIncomeAmount] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [incomeDate, setIncomeDate] = useState<Date>(new Date());
  const [incomeNote, setIncomeNote] = useState<string>("");

  const userCategoryIcons = useCategoryStore(
    (state) => state.userCategoryIcons
  );
  const addCategoryToStore = useCategoryStore((state) => state.addCategory);
  const addExpense = useExpenseStore((state) => state.addExpense);
  const { selectedCurrencySymbol } = useUserPreferencesStore();

  const { userIncomeCategoryIcons } = useIncomeCategoryStore();
  const addIncome = useIncomeStore((state) => state.addIncome);

  const showSuccessToast = useCallback((message: string) => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
      position: "bottom",
      visibilityTime: 2000,
      autoHide: true,
      bottomOffset: 50,
    });
  }, []);

  const handleAddCategory = () => {
    if (newCategory.trim() && expenseEmoji) {
      addCategoryToStore(newCategory, expenseEmoji);
      setCategory(newCategory);
      setNewCategory("");
      setExpenseEmoji(null);
      setShowAddCategoryModal(false);
    } else {
      Alert.alert(
        "Missing Information",
        "Category name and emoji are required."
      );
    }
  };

  const handleExpenseSubmit = () => {
    if (!expenseAmount || !category) {
      Alert.alert("Missing Information", "Amount and category are required.");
      return;
    }
    const parsedAmount = parseFloat(expenseAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive amount.");
      return;
    }
    if (isFuture(expenseDate)) {
      Alert.alert(
        "Invalid Date",
        "Future dates are not allowed for expenses. Please select a current or past date."
      );
      return;
    }
    addExpense({
      id: uuidv4(),
      amount: expenseAmount,
      category,
      emoji: userCategoryIcons[category] || "❓",
      date: expenseDate.toISOString(),
      note: expenseNote,
    });
    showSuccessToast("Your expense has been successfully added.");
    setExpenseAmount("");
    setCategory("");
    setExpenseNote("");
    setExpenseDate(new Date());
    router.replace("/(tabs)/(home)"); // Added this line
  };

  const handleIncomeSubmit = useCallback(() => {
    if (!incomeAmount || !source) {
      Alert.alert("Missing Information", "Amount and source are required.");
      return;
    }
    const parsedAmount = parseFloat(incomeAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive amount.");
      return;
    }
    if (isFuture(incomeDate)) {
      Alert.alert(
        "Invalid Date",
        "Future dates are not allowed for income. Please select a current or past date."
      );
      return;
    }
    addIncome({
      id: uuidv4(),
      amount: incomeAmount,
      source,
      emoji: userIncomeCategoryIcons[source] || "❓",
      date: incomeDate.toISOString(),
      note: incomeNote,
    });
    showSuccessToast("Your income has been successfully added.");
    setIncomeAmount("");
    setSource("");
    setIncomeNote("");
    setIncomeDate(new Date());
    router.replace("/(tabs)/(home)"); // Added this line
  }, [
    incomeAmount,
    source,
    incomeDate,
    incomeNote,
    addIncome,
    userIncomeCategoryIcons,
    showSuccessToast,
    router, // Added router to dependency array
  ]);

  const expenseCategoryList = Object.keys(userCategoryIcons);
  const incomeSourceList = Object.keys(userIncomeCategoryIcons);

  const onDateSelected = (selectedDate: Date | undefined) => {
    const currentDate =
      selectedDate || (formMode === "expense" ? expenseDate : incomeDate);
    if (formMode === "expense") {
      setExpenseDate(currentDate);
    } else {
      setIncomeDate(currentDate);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.pageContainer}>
        <View style={styles.formToggleHeader}>
          <TouchableOpacity
            onPress={() => setFormMode("expense")}
            style={styles.toggleButtonContainer}
          >
            <Text
              style={[
                styles.toggleButtonText,
                formMode === "expense" && styles.activeToggleButtonText,
              ]}
            >
              Add Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFormMode("income")}
            style={styles.toggleButtonContainer}
          >
            <Text
              style={[
                styles.toggleButtonText,
                formMode === "income" && styles.activeToggleButtonText,
              ]}
            >
              Add Income
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollableFormArea}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {formMode === "expense" ? (
            <>
              <View style={styles.verticalContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>💵 Amount</Text>
                  <TextInput
                    style={styles.inputAmount}
                    placeholder={`${selectedCurrencySymbol}0.00`}
                    placeholderTextColor={AppColors.dark.secondaryText}
                    keyboardType="numeric"
                    value={expenseAmount}
                    onChangeText={setExpenseAmount}
                    autoFocus
                  />
                </View>
                <View style={styles.labelContainer}>
                  {/* <Text style={styles.label}>📅 Date</Text> */}
                  {Platform.OS === "ios" ? (
                    <DateTimePicker
                      initialDate={expenseDate.toISOString()}
                      onDateSelected={onDateSelected}
                      title="📅 Date"
                      variant="compact"
                      color={AppColors.dark.tint}
                      displayedComponents="date"
                      style={styles.datePicker}
                    />
                  ) : (
                    <DateTimePickerAndroid
                      onDateSelected={onDateSelected}
                      displayedComponents="date"
                      initialDate={expenseDate.toISOString()}
                      variant="input"
                      color={AppColors.dark.tint}
                      style={styles.datePicker}
                    />
                  )}
                </View>
              </View>

              <Text style={styles.label}>🗂️ Category</Text>
              <View style={styles.categoryContainer}>
                {expenseCategoryList.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.categoryButton,
                      category === item && styles.selectedCategory,
                    ]}
                    onPress={() => setCategory(item)}
                  >
                    <Text style={styles.categoryText}>
                      {userCategoryIcons[item]} {item}
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

              <Text style={styles.label}>📝 Note (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Add a note for your expense"
                placeholderTextColor={AppColors.dark.secondaryText}
                maxLength={40}
                value={expenseNote}
                onChangeText={setExpenseNote}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleExpenseSubmit}
              >
                <Text style={styles.submitButtonText}>Add Expense</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.verticalContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>💵 Amount</Text>
                  <TextInput
                    style={styles.inputAmount}
                    placeholder={`${selectedCurrencySymbol}0.00`}
                    placeholderTextColor={AppColors.dark.secondaryText}
                    keyboardType="numeric"
                    value={incomeAmount}
                    onChangeText={setIncomeAmount}
                    autoFocus
                  />
                </View>
                <View style={styles.labelContainer}>
                  {/* <Text style={styles.label}>📅 Date</Text> */}
                  {Platform.OS === "ios" ? (
                    <DateTimePicker
                      initialDate={incomeDate.toISOString()}
                      onDateSelected={onDateSelected}
                      title="📅 Date"
                      variant="compact"
                      color={AppColors.dark.tint}
                      displayedComponents="date"
                      style={styles.datePicker}
                    />
                  ) : (
                    <DateTimePickerAndroid
                      onDateSelected={onDateSelected}
                      displayedComponents="date"
                      initialDate={incomeDate.toISOString()}
                      variant="input"
                      color={AppColors.dark.tint}
                      style={styles.datePicker}
                    />
                  )}
                </View>
              </View>

              <Text style={styles.label}>🗂️ Source</Text>
              <View style={styles.categoryContainer}>
                {incomeSourceList.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.categoryButton,
                      source === item && styles.selectedCategory,
                    ]}
                    onPress={() => setSource(item)}
                  >
                    <Text style={styles.categoryText}>
                      {userIncomeCategoryIcons[item]} {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>📝 Note (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Add a note for your income"
                placeholderTextColor={AppColors.dark.secondaryText}
                maxLength={40}
                value={incomeNote}
                onChangeText={setIncomeNote}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleIncomeSubmit}
              >
                <Text style={styles.submitButtonText}>Add Income</Text>
              </TouchableOpacity>
            </>
          )}

          {formMode === "expense" && (
            <Modal
              visible={showAddCategoryModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowAddCategoryModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add New Category</Text>
                  {expenseEmoji === null ? (
                    <View style={{ width: "100%", height: 250 }}>
                      <EmojiSelector
                        onEmojiSelected={(selectedEmoji: string) => {
                          setExpenseEmoji(selectedEmoji);
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
                        setExpenseEmoji(null);
                      }}
                    >
                      <Text
                        style={{
                          color: AppColors.dark.text,
                          fontSize: 24,
                          textAlign: "center",
                        }}
                      >
                        {expenseEmoji}
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
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputPage;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
  },
  formToggleHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.dark.secondaryBackground,
  },
  toggleButtonContainer: {
    paddingVertical: 8,
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.dark.secondaryText,
  },
  activeToggleButtonText: {
    color: AppColors.dark.tint,
    borderBottomWidth: 2,
    borderBottomColor: AppColors.dark.tint,
    paddingBottom: 2,
  },
  scrollableFormArea: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  verticalContainer: {
    // flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    color: AppColors.dark.text,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.dark.secondaryBackground,
    color: AppColors.dark.text,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputAmount: {
    backgroundColor: AppColors.dark.secondaryBackground,
    color: AppColors.dark.text,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 12, // Added horizontal padding
    fontSize: 16,
  },
  datePicker: {
    // Added style definition for date pickers
    // backgroundColor: AppColors.dark.secondaryBackground,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: AppColors.dark.text, // Attempt to style text color
    justifyContent: "center", // Center native UI if smaller than the box
    alignItems: "flex-start", // Align text to the left
    // Note: Native date pickers might not respect all style properties (e.g., internal text color/size)
    // The height will be primarily determined by paddingVertical and fontSize, similar to inputAmount.
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: AppColors.dark.secondaryBackground,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: AppColors.dark.tint,
  },
  categoryText: {
    color: AppColors.dark.text,
    fontSize: 14,
  },
  addCategoryButton: {
    backgroundColor: AppColors.dark.secondaryBackground,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addCategoryText: {
    color: AppColors.dark.text,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: AppColors.dark.secondaryBackground,
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    color: AppColors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: AppColors.dark.background,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: AppColors.dark.text,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: AppColors.dark.tint,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: AppColors.dark.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: AppColors.dark.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: AppColors.dark.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
