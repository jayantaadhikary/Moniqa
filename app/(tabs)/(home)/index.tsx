import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { AppColors } from "../../../constants/Colors";
import useExpenseStore, {
  Expense,
  Period,
} from "../../../stores/useExpenseStore";
import useIncomeStore from "../../../stores/useIncomeStore";
import useUserPreferencesStore from "../../../stores/useUserPreferencesStore";

const HomePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedPeriod = useExpenseStore((state) => state.selectedPeriod);
  const setSelectedPeriod = useExpenseStore((state) => state.setSelectedPeriod);
  const budgetData = useExpenseStore((state) => state.budgetData);
  const calculateSpent = useExpenseStore((state) => state.calculateSpent);
  const getFilteredExpenses = useExpenseStore(
    (state) => state.getFilteredExpenses
  );
  const { selectedCurrencySymbol } = useUserPreferencesStore();

  const calculateCurrentMonthIncome = useIncomeStore(
    (state) => state.calculateCurrentMonthIncome
  );
  const currentMonthIncome = calculateCurrentMonthIncome();

  const spent = calculateSpent(selectedPeriod);
  const { total: budgetTotal } = budgetData[selectedPeriod];
  const progress = budgetTotal > 0 ? spent / budgetTotal : 0;

  const filteredExpenses = getFilteredExpenses();

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const amountAsNumber = parseFloat(item.amount);
    const formattedAmount = !isNaN(amountAsNumber)
      ? amountAsNumber.toFixed(2)
      : "0.00";
    return (
      <TouchableOpacity
        style={styles.expenseRow}
        onPress={() => router.push(`/expense/${item.id}`)}
      >
        <Text style={styles.expenseIcon}>{item.emoji}</Text>
        <View style={styles.expenseDetailsContainer}>
          <Text style={styles.expenseTitle}>{item.category}</Text>
          <Text style={styles.expenseDate}>
            {format(new Date(item.date), "dd MMM")}
          </Text>
          {item.note && <Text style={styles.expenseNote}>{item.note}</Text>}
        </View>
        <Text style={styles.expenseAmount}>
          {selectedCurrencySymbol}
          {formattedAmount}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Image
          style={styles.headerImage}
          source={require("../../../assets/images/placeholder.png")}
        />
        {/* Filter Icon */}
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color={AppColors.dark.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal for selecting period */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetContent}>
              <Text style={styles.modalTitle}>Choose budget period:</Text>
              {Object.values(Period).map((periodValue) => (
                <Pressable
                  key={periodValue}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedPeriod(periodValue as Period);
                    setIsModalVisible(false);
                  }}
                >
                  <View style={styles.modalOptionRow}>
                    {selectedPeriod === periodValue && (
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color={AppColors.dark.tint}
                        style={styles.modalOptionCheck}
                      />
                    )}
                    <Text style={styles.modalOptionText}>
                      {periodValue.charAt(0).toUpperCase() +
                        periodValue.slice(1)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Tappable Card */}
      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetTitle}>
            📅{" "}
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}{" "}
            Budget
          </Text>
        </View>
        <Text style={styles.budgetDetails}>
          💸 {selectedCurrencySymbol}
          {spent.toFixed(2)} spent of {selectedCurrencySymbol}
          {budgetTotal.toFixed(2)}
        </Text>
        <Text style={styles.incomeDetails}>
          💰 Income (This Month): {selectedCurrencySymbol}
          {currentMonthIncome.toFixed(2)}
        </Text>
        <Text
          style={[
            styles.budgetStatus,
            spent >= budgetTotal ? styles.exceededText : styles.remainingText,
          ]}
        >
          {spent === budgetTotal
            ? `⚠️ Budget Limit reached!`
            : spent > budgetTotal
            ? `⚠️ Exceeded by ${selectedCurrencySymbol}${(
                spent - budgetTotal
              ).toFixed(2)}`
            : `✅ ${selectedCurrencySymbol}${(budgetTotal - spent).toFixed(
                2
              )} left`}
        </Text>
        <ProgressBar
          progress={progress > 1 ? 1 : progress}
          color={
            spent > budgetTotal ? AppColors.dark.error : AppColors.dark.tint
          }
          style={styles.progressBar}
        />
      </View>

      {/* Recent Expenses Section */}
      <View style={styles.recentExpensesSection}>
        {filteredExpenses.length > 0 && (
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
        )}
        {filteredExpenses.length > 0 ? (
          <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id}
            renderItem={renderExpenseItem}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="wallet-outline"
              size={64}
              color={AppColors.dark.secondaryText}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.noExpensesText}>No expenses yet!</Text>
            <Text style={styles.emptyStateMessage}>
              Tap the + button to add your first expense.
            </Text>
          </View>
        )}
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/(home)/input")}
      >
        <Ionicons name="add" size={24} color={AppColors.dark.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
    paddingHorizontal: 16,
  },
  headerImage: {
    width: 100,
    height: 40,
    borderRadius: 16,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 24,
  },
  headerText: {
    color: AppColors.dark.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterIcon: {
    marginRight: 16,
  },
  budgetCard: {
    backgroundColor: AppColors.dark.tint + "20",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetTitle: {
    color: AppColors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  budgetDetails: {
    color: AppColors.dark.text,
    fontSize: 14,
    marginVertical: 8,
  },
  incomeDetails: {
    color: AppColors.dark.text,
    fontSize: 14,
    marginBottom: 8,
  },
  budgetStatus: {
    fontSize: 14,
    marginBottom: 8,
  },
  exceededText: {
    color: "#FF7043",
  },
  remainingText: {
    color: AppColors.dark.tint,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.dark.secondaryText,
  },
  tapToChange: {
    color: AppColors.dark.secondaryText,
    fontSize: 12,
    marginTop: 8,
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheetContent: {
    backgroundColor: AppColors.dark.background,
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    color: AppColors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 12,
  },
  modalOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  modalOptionText: {
    color: AppColors.dark.text,
    fontSize: 16,
  },
  modalOptionCheck: {
    marginRight: 8,
  },
  input: {
    backgroundColor: AppColors.dark.tint + "20",
    borderRadius: 8,
    padding: 12,
    color: AppColors.dark.text,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: AppColors.dark.tint,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: AppColors.dark.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  recentExpensesSection: {
    flex: 1,
  },
  sectionTitle: {
    color: AppColors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginRight: 16,
  },
  expenseIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  expenseDetailsContainer: {
    flex: 1,
  },
  expenseTitle: {
    fontWeight: "bold",
    color: AppColors.dark.text,
    fontSize: 16,
  },
  expenseDate: {
    color: AppColors.dark.secondaryText,
    fontSize: 12,
  },
  expenseNote: {
    color: AppColors.dark.secondaryText,
    fontSize: 12,
    marginTop: 4,
  },
  expenseAmount: {
    fontWeight: "bold",
    color: AppColors.dark.text,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#1e1e1e",
    marginVertical: 8,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2BBBAD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  noExpensesText: {
    color: AppColors.dark.secondaryText,
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateMessage: {
    color: AppColors.dark.secondaryText,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
