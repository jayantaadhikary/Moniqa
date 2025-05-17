import { DateTimePicker as DateTimePickerAndroid } from "@expo/ui/jetpack-compose";
import { DateTimePicker } from "@expo/ui/swift-ui";

import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { isFuture } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../../../../constants/Colors";
import useCategoryStore from "../../../../stores/useCategoryStore";
import useExpenseStore from "../../../../stores/useExpenseStore";

const ExpenseDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const expenses = useExpenseStore((state) => state.expenses);
  const editExpense = useExpenseStore((state) => state.editExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const categoryIcons = useCategoryStore((state) => state.userCategoryIcons);

  // Find the expense with the matching ID
  const expense = expenses.find((e) => e.id === id);

  // State for form fields
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");

  // Populate form with existing expense data
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(new Date(expense.date));
      setNote(expense.note || "");
    }
  }, [expense]);

  if (!expense) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Expense not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    // Validate the input
    if (!amount) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
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

    // Update the expense
    editExpense(id, {
      amount,
      category,
      emoji: categoryIcons[category] || expense.emoji,
      date: date.toISOString(),
      note,
      id,
    });

    // Navigate back
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteExpense(id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={AppColors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Expense</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF5555" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Amount Input */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={AppColors.dark.secondaryText}
        />

        {/* Date Picker */}

        {Platform.OS === "ios" ? (
          <DateTimePicker
            onDateSelected={(date) => {
              setDate(date);
            }}
            displayedComponents="date"
            initialDate={date.toISOString()}
            variant="compact"
            style={{
              // backgroundColor: AppColors.dark.secondaryBackground,
              borderRadius: 8,
              padding: 12,
              marginTop: 16,
            }}
            title="Date"
            color={AppColors.dark.text}
          />
        ) : (
          <DateTimePickerAndroid
            onDateSelected={(date) => {
              setDate(date);
            }}
            displayedComponents="date"
            initialDate={date.toISOString()}
            variant="input"
            style={{
              // backgroundColor: AppColors.dark.secondaryBackground,
              borderRadius: 8,
              padding: 12,
              marginTop: 16,
            }}
            color={AppColors.dark.text}
          />
        )}

        {/* <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={closeDatePicker}
          date={date}
          themeVariant="dark"
          display="inline"
        /> */}
        {/* <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) =>
            selectedDate && setDate(selectedDate)
          }
          themeVariant="dark"
        /> */}

        {/* Note Input */}
        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note"
          placeholderTextColor={AppColors.dark.secondaryText}
          multiline
          maxLength={40}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.dark.text,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: AppColors.dark.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: AppColors.dark.secondaryBackground,
    color: AppColors.dark.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  noteInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: AppColors.dark.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 32,
  },
  buttonText: {
    color: AppColors.dark.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: AppColors.dark.secondaryBackground,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  errorText: {
    color: AppColors.dark.text,
    fontSize: 18,
    textAlign: "center",
    marginTop: 32,
    marginBottom: 16,
  },
});

export default ExpenseDetailScreen;
