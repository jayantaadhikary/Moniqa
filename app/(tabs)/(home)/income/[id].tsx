import { AppColors } from "@/constants/Colors";
import useIncomeCategoryStore from "@/stores/useIncomeCategoryStore";
import useIncomeStore, { Income } from "@/stores/useIncomeStore";
import useUserPreferencesStore from "@/stores/useUserPreferencesStore";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// Re-using and adapting components from input.tsx where possible
const iconSize = 24;

const EditIncomePage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { incomes, editIncome, deleteIncome } = useIncomeStore();
  const { selectedCurrencySymbol } = useUserPreferencesStore();
  const { userIncomeCategoryIcons } = useIncomeCategoryStore();

  const [incomeDetails, setIncomeDetails] = useState<Income | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [isSourceSelectorVisible, setSourceSelectorVisible] =
    useState<boolean>(false);

  const incomeSourcesForList = Object.entries(userIncomeCategoryIcons).map(
    ([name, emoji]) => ({ name, emoji })
  );

  useEffect(() => {
    if (id) {
      const currentIncome = incomes.find((inc) => inc.id === id);
      if (currentIncome) {
        setIncomeDetails(currentIncome);
        setAmount(currentIncome.amount);
        setSelectedSource(currentIncome.source);
        setSelectedEmoji(currentIncome.emoji);
        setDate(new Date(currentIncome.date));
        setNote(currentIncome.note || "");
      } else {
        // Income not found, maybe navigate back or show error
        // Toast.show({
        //   type: "error",
        //   text1: "Error",
        //   text2: "Income entry not found.",
        // });
        if (router.canGoBack()) router.back();
      }
    }
  }, [id, incomes, router]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleSourceSelect = (sourceName: string, emoji: string) => {
    setSelectedSource(sourceName);
    setSelectedEmoji(emoji);
    setSourceSelectorVisible(false);
  };

  const validateInput = (): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid positive amount.");
      return false;
    }
    if (!selectedSource) {
      Alert.alert("Invalid Input", "Please select an income source.");
      return false;
    }
    return true;
  };

  const handleSaveChanges = () => {
    if (!validateInput() || !incomeDetails) return;

    const updatedIncome: Income = {
      ...incomeDetails,
      amount,
      source: selectedSource,
      emoji: selectedEmoji,
      date: date.toISOString(),
      note: note.trim(),
    };

    editIncome(updatedIncome);
    Toast.show({
      type: "success",
      text1: "Income Updated",
      text2: "Your income entry has been successfully updated.",
      topOffset: 50,
      visibilityTime: 2000,
      autoHide: true,
    });
    if (router.canGoBack()) router.back();
  };

  const handleDeleteIncome = () => {
    if (!incomeDetails) return;

    Alert.alert(
      "Delete Income",
      "Are you sure you want to delete this income entry? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteIncome(incomeDetails.id);
            Toast.show({
              type: "success",
              text1: "Income Deleted",
              text2: "The income entry has been removed.",
            });
            if (router.canGoBack()) router.back();
          },
        },
      ]
    );
  };

  if (!incomeDetails) {
    // Can show a loading spinner or a more specific "not found" UI
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading income details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount Input */}
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>{selectedCurrencySymbol}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor={AppColors.dark.secondaryText}
            />
          </View>

          {/* Source Selector */}
          <TouchableOpacity
            style={styles.inputField}
            onPress={() => setSourceSelectorVisible(true)}
          >
            <View style={styles.inputFieldContent}>
              <Ionicons
                name="briefcase-outline"
                size={iconSize}
                color={AppColors.dark.secondaryText}
              />
              <Text style={styles.inputText}>
                {selectedSource || "Select Source"}
              </Text>
            </View>
            {selectedEmoji && (
              <Text style={styles.emojiText}>{selectedEmoji}</Text>
            )}
          </TouchableOpacity>

          {/* Date Picker */}
          <TouchableOpacity
            style={styles.inputField}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.inputFieldContent}>
              <Ionicons
                name="calendar-outline"
                size={iconSize}
                color={AppColors.dark.secondaryText}
              />
              <Text style={styles.inputText}>
                {date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner" // Or "default"
              onChange={handleDateChange}
              maximumDate={new Date()} // Optional: prevent future dates
              textColor={AppColors.dark.text} // For iOS
            />
          )}

          {/* Note Input */}
          <View style={styles.inputField}>
            <View style={styles.inputFieldContent}>
              <Ionicons
                name="reader-outline"
                size={iconSize}
                color={AppColors.dark.secondaryText}
              />
              <TextInput
                style={[styles.inputText, styles.noteInput]}
                placeholder="Add a note (optional)"
                value={note}
                onChangeText={setNote}
                placeholderTextColor={AppColors.dark.secondaryText}
                multiline
              />
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSaveChanges}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteIncome}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete Income
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Source Selector Modal (similar to input.tsx) */}
      {isSourceSelectorVisible && (
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSourceSelectorVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Income Source</Text>
              <FlatList
                data={incomeSourcesForList}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handleSourceSelect(item.name, item.emoji)}
                  >
                    <Text style={styles.modalEmoji}>{item.emoji}</Text>
                    <Text style={styles.modalOptionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View style={styles.modalSeparator} />
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default EditIncomePage;

// Styles (adapted from input.tsx and new styles added)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50, // Ensure space for last button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.dark.secondaryText,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.dark.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 20 : 15,
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 30,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: "bold",
    color: AppColors.dark.text,
    paddingVertical: 0, // Reset padding
  },
  inputField: {
    backgroundColor: AppColors.dark.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputFieldContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inputText: {
    marginLeft: 10,
    fontSize: 16,
    color: AppColors.dark.text,
    flex: 1, // Allow text to take available space
  },
  noteInput: {
    minHeight: 40, // For multiline
    textAlignVertical: "top", // For Android
  },
  emojiText: {
    fontSize: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10, // Spacing between buttons
  },
  saveButton: {
    backgroundColor: AppColors.dark.primary,
  },
  deleteButton: {
    backgroundColor: AppColors.dark.danger, // Use danger color
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.dark.text,
  },
  deleteButtonText: {
    color: AppColors.dark.text, // Ensure text is readable on danger background
  },
  // Modal styles (copied and adapted from input.tsx)
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: AppColors.dark.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20, // Safe area for bottom
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  modalEmoji: {
    fontSize: 20,
    marginRight: 15,
  },
  modalOptionText: {
    fontSize: 16,
    color: AppColors.dark.text,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: AppColors.dark.border,
  },
});
