import { AppColors } from "@/constants/Colors";
import useCategoryStore from "@/stores/useCategoryStore";
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
  FlatList,
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

export interface CategorizedExpenseSummary {
  id: string; // Will use category name as ID
  name: string;
  emoji: string;
  amount: number;
  percentage: number;
}

const SummaryPage = () => {
  const { expenses } = useExpenseStore();
  const { selectedCurrencySymbol } = useUserPreferencesStore();
  const { masterCategoryIcons, createdCustomCategories } = useCategoryStore();

  const [currentFilterPeriod, setCurrentFilterPeriod] =
    useState<SummaryPeriodOption>("This Month");
  const [customStartDate, _setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, _setCustomEndDate] = useState<Date | null>(null);
  const [calculatedTotalExpenses, setCalculatedTotalExpenses] =
    useState<number>(0);
  const [isPeriodSelectorVisible, setPeriodSelectorVisible] = useState(false);
  const [categorizedExpensesSummary, setCategorizedExpensesSummary] = useState<
    CategorizedExpenseSummary[]
  >([]);

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

    if (total > 0) {
      const categoryMap: { [key: string]: CategorizedExpenseSummary } = {};

      filtered.forEach((expense: Expense) => {
        const categoryName = expense.category;
        if (!categoryName) return;

        let categoryEmoji =
          masterCategoryIcons[categoryName] ||
          createdCustomCategories[categoryName] ||
          "❓";

        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = {
            id: categoryName, // Use category name as ID
            name: categoryName,
            emoji: categoryEmoji,
            amount: 0,
            percentage: 0,
          };
        }
        const expenseAmount = parseFloat(expense.amount);
        categoryMap[categoryName].amount += isNaN(expenseAmount)
          ? 0
          : expenseAmount;
      });

      const summaryArray = Object.values(categoryMap).map((catSummary) => ({
        ...catSummary,
        percentage: total > 0 ? (catSummary.amount / total) * 100 : 0,
      }));

      summaryArray.sort((a, b) => b.amount - a.amount);
      setCategorizedExpensesSummary(summaryArray.slice(0, 5)); // Slice to get top 5
    } else {
      setCategorizedExpensesSummary([]);
    }
  }, [
    expenses,
    currentFilterPeriod,
    customStartDate,
    customEndDate,
    masterCategoryIcons,
    createdCustomCategories,
  ]);

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

  const renderCategoryItem = ({
    item,
  }: {
    item: CategorizedExpenseSummary;
  }) => (
    <View style={styles.categoryItemContainer}>
      <Text style={styles.categoryItemEmoji}>{item.emoji}</Text>
      <View style={styles.categoryItemDetails}>
        <Text style={styles.categoryItemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.categoryItemPercentage}>
          {item.percentage.toFixed(1)}% of total
        </Text>
      </View>
      <Text style={styles.categoryItemAmount}>
        {selectedCurrencySymbol}
        {item.amount.toFixed(2)}
      </Text>
    </View>
  );

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
          <Text style={styles.sectionTitle}>Spending Trends</Text>
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>
              Spending trends will be shown here.
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          {categorizedExpensesSummary.length > 0 ? (
            <FlatList
              data={categorizedExpensesSummary} // Already sliced to top 5
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id} // item.id is now category name
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={styles.categorySeparator} />
              )}
            />
          ) : (
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderText}>
                No spending data for the selected period.
              </Text>
            </View>
          )}
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
    fontSize: 18,
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
  categoryItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  categoryItemEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  categoryItemDetails: {
    flex: 1,
    marginRight: 10,
  },
  categoryItemName: {
    fontSize: 14,
    color: AppColors.dark.text,
    fontWeight: "500",
  },
  categoryItemPercentage: {
    fontSize: 13,
    color: AppColors.dark.secondaryText,
  },
  categoryItemAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.dark.primary,
  },
  categorySeparator: {
    height: 1,
    backgroundColor: AppColors.dark.border,
    marginVertical: 4,
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
