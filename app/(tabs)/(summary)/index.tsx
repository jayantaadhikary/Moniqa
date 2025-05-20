import { AppColors } from "@/constants/Colors";
import useCategoryStore from "@/stores/useCategoryStore";
import useExpenseStore, { Expense, Period } from "@/stores/useExpenseStore";
import useIncomeStore from "@/stores/useIncomeStore";
import useUserPreferencesStore from "@/stores/useUserPreferencesStore";
import {
  differenceInDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  isSameYear,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
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
import { LineChart } from "react-native-gifted-charts";

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
  const { budgetData } = useExpenseStore();
  const { calculateCurrentMonthIncome } = useIncomeStore();

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
  const [spendingTrendData, setSpendingTrendData] = useState<
    { value: number; label: string; date?: string }[]
  >([]);
  const [dynamicChartSpacing, setDynamicChartSpacing] = useState(40);
  const [dynamicInitialSpacing, setDynamicInitialSpacing] = useState(10);
  const [dynamicEndSpacing, setDynamicEndSpacing] = useState(10);
  const [dynamicRulesLength, setDynamicRulesLength] = useState<
    number | undefined
  >();

  const [monthlyExpensesForOverview, setMonthlyExpensesForOverview] =
    useState<number>(0);
  const [monthlyBudgetForOverview, setMonthlyBudgetForOverview] =
    useState<number>(0);
  const [currentMonthIncome, setCurrentMonthIncome] = useState<number>(0);

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

    const income = calculateCurrentMonthIncome();
    setCurrentMonthIncome(income);

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

    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);

    const expensesThisMonth = expenses.filter((expense: Expense) => {
      try {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, {
          start: startOfThisMonth,
          end: endOfThisMonth,
        });
      } catch (e) {
        console.warn(
          `Error parsing date for expense ID ${expense.id} (overview): ${expense.date}`,
          e
        );
        return false;
      }
    });

    const totalThisMonthExpenses = expensesThisMonth.reduce(
      (sum: number, expense: Expense) => {
        const amount = parseFloat(expense.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      },
      0
    );
    setMonthlyExpensesForOverview(totalThisMonthExpenses);

    const monthBudget = budgetData[Period.Month].total;
    setMonthlyBudgetForOverview(monthBudget);

    const incomeOverview = calculateCurrentMonthIncome();
    setCurrentMonthIncome(incomeOverview);

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
            id: categoryName,
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
      setCategorizedExpensesSummary(summaryArray.slice(0, 5));

      let newTrendData: { value: number; label: string; date: string }[] = [];

      switch (currentFilterPeriod) {
        case "This Week":
          const daysInWeek = eachDayOfInterval({
            start: startDate,
            end: endDate,
          });
          newTrendData = daysInWeek.map((day) => {
            const dayExpenses = filtered.filter((exp) =>
              isSameDay(parseISO(exp.date), day)
            );
            const sum = dayExpenses.reduce(
              (acc, curr) => acc + parseFloat(curr.amount),
              0
            );
            return {
              value: sum,
              label: format(day, "E"),
              date: format(day, "yyyy-MM-dd"),
            };
          });
          break;

        case "This Month":
          const weeksInMonth = eachWeekOfInterval(
            { start: startDate, end: endDate },
            { weekStartsOn: 0 }
          );
          newTrendData = weeksInMonth.map((weekStart) => {
            const weekActualEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
            const effectiveWeekEnd = isAfter(weekActualEnd, endDate)
              ? endDate
              : weekActualEnd;

            const weekExpenses = filtered.filter((exp) => {
              const expDate = parseISO(exp.date);
              return isWithinInterval(expDate, {
                start: weekStart,
                end: effectiveWeekEnd,
              });
            });
            const sum = weekExpenses.reduce(
              (acc, curr) => acc + parseFloat(curr.amount),
              0
            );
            return {
              value: sum,
              label: `W${format(weekStart, "w")}`,
              date: format(weekStart, "yyyy-MM-dd"),
            };
          });
          break;

        case "This Year":
          const monthsInYear = eachMonthOfInterval({
            start: startDate,
            end: endDate,
          });
          newTrendData = monthsInYear.map((monthStart) => {
            const monthActualEnd = endOfMonth(monthStart);
            const effectiveMonthEnd = isAfter(monthActualEnd, endDate)
              ? endDate
              : monthActualEnd;

            const monthExpenses = filtered.filter((exp) => {
              const expDate = parseISO(exp.date);
              return (
                isSameMonth(expDate, monthStart) &&
                isSameYear(expDate, monthStart) &&
                isWithinInterval(expDate, {
                  start: monthStart,
                  end: effectiveMonthEnd,
                })
              );
            });
            const sum = monthExpenses.reduce(
              (acc, curr) => acc + parseFloat(curr.amount),
              0
            );
            return {
              value: sum,
              label: format(monthStart, "MMM"),
              date: format(monthStart, "yyyy-MM-dd"),
            };
          });
          break;

        case "Custom":
          if (customStartDate && customEndDate) {
            const duration = differenceInDays(endDate, startDate);
            if (duration <= 31) {
              const daysInCustom = eachDayOfInterval({
                start: startDate,
                end: endDate,
              });
              newTrendData = daysInCustom.map((day) => {
                const dayExpenses = filtered.filter((exp) =>
                  isSameDay(parseISO(exp.date), day)
                );
                const sum = dayExpenses.reduce(
                  (acc, curr) => acc + parseFloat(curr.amount),
                  0
                );
                return {
                  value: sum,
                  label: format(day, "d"),
                  date: format(day, "yyyy-MM-dd"),
                };
              });
            } else if (duration <= 92) {
              const weeksInCustom = eachWeekOfInterval(
                { start: startDate, end: endDate },
                { weekStartsOn: 0 }
              );
              newTrendData = weeksInCustom.map((weekStart) => {
                const weekActualEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
                const effectiveWeekEnd = isAfter(weekActualEnd, endDate)
                  ? endDate
                  : weekActualEnd;
                const weekExpenses = filtered.filter((exp) =>
                  isWithinInterval(parseISO(exp.date), {
                    start: weekStart,
                    end: effectiveWeekEnd,
                  })
                );
                const sum = weekExpenses.reduce(
                  (acc, curr) => acc + parseFloat(curr.amount),
                  0
                );
                return {
                  value: sum,
                  label: `W${format(weekStart, "w")}`,
                  date: format(weekStart, "yyyy-MM-dd"),
                };
              });
            } else {
              const monthsInCustom = eachMonthOfInterval({
                start: startDate,
                end: endDate,
              });
              newTrendData = monthsInCustom.map((monthStart) => {
                const monthActualEnd = endOfMonth(monthStart);
                const effectiveMonthEnd = isAfter(monthActualEnd, endDate)
                  ? endDate
                  : monthActualEnd;
                const monthExpenses = filtered.filter((exp) =>
                  isWithinInterval(parseISO(exp.date), {
                    start: monthStart,
                    end: effectiveMonthEnd,
                  })
                );
                const sum = monthExpenses.reduce(
                  (acc, curr) => acc + parseFloat(curr.amount),
                  0
                );
                return {
                  value: sum,
                  label: format(monthStart, "MMM yy"),
                  date: format(monthStart, "yyyy-MM-dd"),
                };
              });
            }
          }
          break;
      }
      setSpendingTrendData(newTrendData);

      if (newTrendData.length > 0) {
        const screenWidth = Dimensions.get("window").width;
        const horizontalPadding = 20 * 2 + 15 * 2;
        const yAxisLabelSpace = 40;
        const chartAvailableWidth =
          screenWidth - horizontalPadding - yAxisLabelSpace;

        setDynamicRulesLength(chartAvailableWidth);

        const numberOfPoints = newTrendData.length;

        let calculatedSpacing = chartAvailableWidth / (numberOfPoints || 1);

        const minSpacing = 30;
        const maxSpacing = 120;
        calculatedSpacing = Math.max(
          minSpacing,
          Math.min(maxSpacing, calculatedSpacing)
        );

        if (
          numberOfPoints * calculatedSpacing < chartAvailableWidth * 0.8 &&
          numberOfPoints > 1
        ) {
          calculatedSpacing = (chartAvailableWidth * 0.8) / numberOfPoints;
        }

        const initialSpacing =
          calculatedSpacing / 3 < 10 ? 10 : calculatedSpacing / 3;
        const endSpacing =
          calculatedSpacing / 3 < 10 ? 10 : calculatedSpacing / 3;

        if (numberOfPoints === 1) {
          const singlePointSpacing = chartAvailableWidth / 3;
          setDynamicChartSpacing(singlePointSpacing);
          setDynamicInitialSpacing(singlePointSpacing);
          setDynamicEndSpacing(singlePointSpacing);
        } else {
          setDynamicChartSpacing(calculatedSpacing);
          setDynamicInitialSpacing(initialSpacing);
          setDynamicEndSpacing(endSpacing);
        }
      } else {
        setDynamicChartSpacing(40);
        setDynamicInitialSpacing(10);
        setDynamicEndSpacing(10);
        setDynamicRulesLength(undefined);
      }
    } else {
      setCategorizedExpensesSummary([]);
      setSpendingTrendData([]);
      setDynamicChartSpacing(40);
      setDynamicInitialSpacing(10);
      setDynamicEndSpacing(10);
      setDynamicRulesLength(undefined);
    }
  }, [
    expenses,
    currentFilterPeriod,
    customStartDate,
    customEndDate,
    masterCategoryIcons,
    createdCustomCategories,
    budgetData,
    calculateCurrentMonthIncome,
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
          <Text style={styles.totalExpensesLabel}>
            Total Expenses ({displayPeriodText()})
          </Text>
          <Text style={styles.totalExpensesValue}>
            {selectedCurrencySymbol}
            {calculatedTotalExpenses.toFixed(2)}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Spending Trends</Text>
          {calculatedTotalExpenses > 0 && spendingTrendData.length > 0 ? (
            <LineChart
              data={spendingTrendData}
              height={200}
              spacing={dynamicChartSpacing}
              initialSpacing={dynamicInitialSpacing}
              endSpacing={dynamicEndSpacing}
              color={AppColors.dark.primary}
              textColor={AppColors.dark.text}
              dataPointsColor={AppColors.dark.primary}
              textFontSize={10}
              yAxisTextStyle={{
                color: AppColors.dark.secondaryText,
                fontSize: 10,
              }}
              xAxisLabelTextStyle={{
                color: AppColors.dark.secondaryText,
                fontSize: 10,
                textAlign: "center",
              }}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={AppColors.dark.border}
              yAxisOffset={0}
              rulesLength={dynamicRulesLength}
              rulesColor={AppColors.dark.border}
              yAxisLabelWidth={45}
              formatYLabel={(value) => {
                return `${selectedCurrencySymbol}${value}`;
              }}
            />
          ) : (
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderText}>
                {calculatedTotalExpenses === 0
                  ? "No spending data for the selected period."
                  : "Not enough data to display trends."}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Spending (This Month):</Text>
            <Text style={styles.overviewValueSpend}>
              {selectedCurrencySymbol}
              {monthlyExpensesForOverview.toFixed(2)}
            </Text>
          </View>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Budget (This Month):</Text>
            <Text style={styles.overviewValue}>
              {selectedCurrencySymbol}
              {monthlyBudgetForOverview.toFixed(2)}
            </Text>
          </View>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Income (This Month):</Text>
            <Text style={styles.overviewValueIncome}>
              {selectedCurrencySymbol}
              {currentMonthIncome.toFixed(2)}
            </Text>
          </View>

          <View style={styles.separator} />

          {monthlyBudgetForOverview > 0 && (
            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>Budget Status:</Text>
              <Text
                style={
                  monthlyExpensesForOverview <= monthlyBudgetForOverview
                    ? styles.overviewValueSuccess
                    : styles.overviewValueError
                }
              >
                {monthlyExpensesForOverview <= monthlyBudgetForOverview
                  ? `${selectedCurrencySymbol}${(
                      monthlyBudgetForOverview - monthlyExpensesForOverview
                    ).toFixed(2)} Under Budget`
                  : `${selectedCurrencySymbol}${(
                      monthlyExpensesForOverview - monthlyBudgetForOverview
                    ).toFixed(2)} Over Budget`}
              </Text>
            </View>
          )}

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Savings (This Month):</Text>
            <Text
              style={
                currentMonthIncome - monthlyExpensesForOverview >= 0
                  ? styles.overviewValueSuccess
                  : styles.overviewValueError
              }
            >
              {selectedCurrencySymbol}
              {(currentMonthIncome - monthlyExpensesForOverview).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Top Categories ({displayPeriodText()})
          </Text>
          {categorizedExpensesSummary.length > 0 ? (
            <FlatList
              data={categorizedExpensesSummary}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
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
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  overviewLabel: {
    fontSize: 15,
    color: AppColors.dark.secondaryText,
    flex: 1,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.dark.text,
  },
  overviewValueSpend: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.dark.error,
  },
  overviewValueIncome: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.dark.success,
  },
  overviewValueSuccess: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.dark.success,
  },
  overviewValueError: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.dark.error,
  },
  separator: {
    height: 1,
    backgroundColor: AppColors.dark.border,
    marginVertical: 10,
  },
});
