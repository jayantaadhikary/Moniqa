import { AppColors } from "@/constants/Colors";
import useExpenseStore, { Expense } from "@/stores/useExpenseStore";
import useUserPreferencesStore from "@/stores/useUserPreferencesStore";
import {
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export type SummaryPeriodOption =
  | "This Week"
  | "This Month"
  | "This Year"
  | "Custom";

const SummaryPage = () => {
  const { expenses } = useExpenseStore();
  const { selectedCurrencySymbol } = useUserPreferencesStore();

  const [currentFilterPeriod, setCurrentFilterPeriod] =
    useState<SummaryPeriodOption>("This Month");
  const [customStartDate, _setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, _setCustomEndDate] = useState<Date | null>(null);
  const [calculatedTotalExpenses, setCalculatedTotalExpenses] =
    useState<number>(0);
  const [isPeriodSelectorVisible, setPeriodSelectorVisible] = useState(false);

  useEffect(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = endOfDay(now);

    switch (currentFilterPeriod) {
      case "This Week":
        startDate = startOfWeek(now, { weekStartsOn: 0 });
        break;
      case "This Month":
        startDate = startOfMonth(now);
        break;
      case "This Year":
        startDate = startOfYear(now);
        break;
      case "Custom":
        if (customStartDate && customEndDate) {
          startDate = customStartDate;
          endDate = endOfDay(customEndDate);
        } else {
          startDate = startOfMonth(now);
          setCurrentFilterPeriod("This Month");
        }
        break;
      default:
        startDate = startOfMonth(now);
    }

    const filtered = expenses.filter((expense: Expense) => {
      try {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, {
          start: startDate,
          end: endDate,
        });
      } catch (e) {
        console.warn(
          `Error parsing date for expense ID ${expense.id}: ${expense.date}`,
          e
        );
        return false;
      }
    });

    const total = filtered.reduce((sum: number, expense: Expense) => {
      const amount = parseFloat(expense.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    setCalculatedTotalExpenses(total);
  }, [expenses, currentFilterPeriod, customStartDate, customEndDate]);

  const displayPeriodText = () => {
    if (currentFilterPeriod === "Custom" && customStartDate && customEndDate) {
      return `Custom: ${format(customStartDate, "MMM d, yyyy")} - ${format(
        customEndDate,
        "MMM d, yyyy"
      )}`;
    }
    return currentFilterPeriod;
  };

  const handlePeriodChange = (newPeriod: SummaryPeriodOption) => {
    setCurrentFilterPeriod(newPeriod);
    setPeriodSelectorVisible(false);
    if (newPeriod !== "Custom") {
      _setCustomStartDate(null);
      _setCustomEndDate(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Your Summary</Text>

        <View style={styles.sectionCard}>
          <TouchableOpacity
            onPress={() => setPeriodSelectorVisible(true)}
            style={styles.periodSelectorTouchable}
          >
            <Text style={styles.periodText}>
              Showing data for:{" "}
              <Text style={styles.periodValue}>{displayPeriodText()} </Text>
              <Text style={styles.periodSelectorIcon}>▼</Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.totalExpensesLabel}>Total Expenses</Text>
          <Text style={styles.totalExpensesValue}>
            {selectedCurrencySymbol}
            {calculatedTotalExpenses.toFixed(2)}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>
              Category breakdown will be shown here (e.g., list or pie chart).
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Spending Trends</Text>
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>
              Charts for spending trends will be displayed here.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isPeriodSelectorVisible}
        onRequestClose={() => {
          setPeriodSelectorVisible(!isPeriodSelectorVisible);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setPeriodSelectorVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Period</Text>
                {(
                  [
                    "This Week",
                    "This Month",
                    "This Year",
                    "Custom",
                  ] as SummaryPeriodOption[]
                ).map((period) => (
                  <Pressable
                    key={period}
                    style={[
                      styles.modalOption,
                      currentFilterPeriod === period &&
                        styles.selectedModalOption,
                    ]}
                    onPress={() => handlePeriodChange(period)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        currentFilterPeriod === period &&
                          styles.selectedModalOptionText,
                      ]}
                    >
                      {period}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default SummaryPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: AppColors.dark.background,
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: AppColors.dark.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodText: {
    fontSize: 16,
    color: AppColors.dark.secondaryText,
  },
  periodValue: {
    fontWeight: "bold",
    color: AppColors.dark.text,
  },
  periodSelectorTouchable: {
    marginBottom: 10,
  },
  periodSelectorIcon: {
    fontSize: 12,
    color: AppColors.dark.secondaryText,
  },
  totalExpensesLabel: {
    fontSize: 18,
    color: AppColors.dark.text,
    marginBottom: 5,
  },
  totalExpensesValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: AppColors.dark.primary,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: AppColors.dark.text,
    marginBottom: 10,
  },
  placeholderContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderStyle: "dashed",
    borderColor: AppColors.dark.border,
    borderWidth: 1,
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: AppColors.dark.secondaryText,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: AppColors.dark.cardBackground,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.dark.border,
  },
  selectedModalOption: {
    backgroundColor: AppColors.dark.tint + "30",
    borderRadius: 8,
  },
  modalOptionText: {
    fontSize: 18,
    color: AppColors.dark.text,
    textAlign: "center",
  },
  selectedModalOptionText: {
    color: AppColors.dark.tint,
    fontWeight: "bold",
  },
});
