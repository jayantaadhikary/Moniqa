import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ProgressBar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { AppColors } from "../../../constants/Colors";
import useExpenseStore, {
  Expense,
  Period,
} from "../../../stores/useExpenseStore";
import useIncomeStore from "../../../stores/useIncomeStore";
import useUserPreferencesStore from "../../../stores/useUserPreferencesStore";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const storeExpenses = useExpenseStore((state) => state.expenses);
  const selectedPeriod = useExpenseStore((state) => state.selectedPeriod);
  const setSelectedPeriod = useExpenseStore((state) => state.setSelectedPeriod);
  const budgetData = useExpenseStore((state) => state.budgetData);
  const calculateSpent = useExpenseStore((state) => state.calculateSpent);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const { selectedCurrencySymbol } = useUserPreferencesStore();

  const calculateCurrentMonthIncome = useIncomeStore(
    (state) => state.calculateCurrentMonthIncome
  );
  const currentMonthIncome = calculateCurrentMonthIncome();

  const spent = calculateSpent(selectedPeriod);
  const { total: budgetTotal } = budgetData[selectedPeriod];
  const progress = budgetTotal > 0 ? spent / budgetTotal : 0;

  const getFilteredExpenses = useCallback(
    (currentExpenses: Expense[], period: Period) => {
      const now = new Date();
      return currentExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        switch (period) {
          case Period.Day:
            return (
              expenseDate.getDate() === now.getDate() &&
              expenseDate.getMonth() === now.getMonth() &&
              expenseDate.getFullYear() === now.getFullYear()
            );
          case Period.Week:
            const startOfWeek = new Date(now);
            startOfWeek.setDate(
              now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
            );
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
          case Period.Month:
            return (
              expenseDate.getMonth() === now.getMonth() &&
              expenseDate.getFullYear() === now.getFullYear()
            );
          default:
            return true;
        }
      });
    },
    []
  );

  const filteredExpenses = useMemo(() => {
    const baseFilteredExpenses = getFilteredExpenses(
      storeExpenses,
      selectedPeriod
    );
    if (searchQuery.trim() === "") {
      return baseFilteredExpenses;
    }
    return baseFilteredExpenses.filter(
      (expense) =>
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (expense.note &&
          expense.note.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [storeExpenses, selectedPeriod, searchQuery, getFilteredExpenses]);

  const handleDeleteExpense = useCallback(
    (expenseId: string, closeSwipeable?: () => void) => {
      if (closeSwipeable) {
        closeSwipeable();
      }

      Alert.alert(
        "Delete Expense",
        "Are you sure you want to delete this expense?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteExpense(expenseId);
              Toast.show({
                type: "success",
                text1: "Expense Deleted",
                text2: "The expense has been successfully removed.",
                position: "bottom",
                visibilityTime: 2000,
              });
            },
          },
        ]
      );
    },
    [deleteExpense]
  );

  const renderRightActions = useCallback(
    (_progress: any, _dragX: any, swipeable: Swipeable, itemId: string) => {
      return (
        <View style={styles.rightActionContainer}>
          <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => handleDeleteExpense(itemId, () => swipeable.close())}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={AppColors.dark.text}
            />
          </TouchableOpacity>
        </View>
      );
    },
    [handleDeleteExpense]
  );

  const renderExpenseItem = useCallback(
    ({ item }: { item: Expense }) => {
      const amountAsNumber = parseFloat(item.amount);
      const formattedAmount = !isNaN(amountAsNumber)
        ? amountAsNumber.toFixed(2)
        : "0.00";

      return (
        <Swipeable
          renderRightActions={(progress, dragX, swipeable) =>
            renderRightActions(progress, dragX, swipeable, item.id)
          }
          friction={2}
          rightThreshold={40}
          overshootRight={false}
        >
          <TouchableOpacity
            style={styles.expenseRow}
            onPress={() => router.push(`/(tabs)/(home)/expense/${item.id}`)}
          >
            <Text style={styles.expenseIcon}>{item.emoji}</Text>
            <View style={styles.expenseDetailsContainer}>
              <Text style={styles.expenseTitle}>{item.category}</Text>
              <Text style={styles.expenseDate}>
                {format(parseISO(item.date), "dd MMM")}
              </Text>
              {item.note && <Text style={styles.expenseNote}>{item.note}</Text>}
            </View>
            <Text style={styles.expenseAmount}>
              {selectedCurrencySymbol}
              {formattedAmount}
            </Text>
          </TouchableOpacity>
        </Swipeable>
      );
    },
    [selectedCurrencySymbol, router, renderRightActions]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerSection}>
          <Image
            style={styles.headerImage}
            source={require("../../../assets/images/headerlogo.png")}
          />
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="filter" size={24} color={AppColors.dark.text} />
          </TouchableOpacity>
        </View>

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
          <View style={styles.incomeValueContainer}>
            <Text style={styles.incomeDetails}>
              💰 Income (This Month): {selectedCurrencySymbol}
              {currentMonthIncome.toFixed(2)}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/(home)/incomeList")}
              style={styles.infoIconContainer}
            >
              <FontAwesome
                name="info-circle"
                size={20}
                color={AppColors.dark.secondaryText}
              />
            </TouchableOpacity>
          </View>
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

        <View style={styles.recentExpensesSection}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={AppColors.dark.secondaryText}
              style={styles.searchIconStyle}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses (category or note)"
              placeholderTextColor={AppColors.dark.secondaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {filteredExpenses.length > 0 && (
            <Text style={styles.sectionTitle}>My Expenses</Text>
          )}
          {filteredExpenses.length === 0 && !searchQuery && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.noExpensesText}>
                No expenses recorded for this period yet.
              </Text>
              <Text style={styles.emptyStateMessage}>
                Tap the &apos;+&apos; button to add your first expense!
              </Text>
            </View>
          )}
          {filteredExpenses.length === 0 && searchQuery && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.noExpensesText}>No expenses found.</Text>
              <Text style={styles.emptyStateMessage}>
                Try a different search term.
              </Text>
            </View>
          )}
          <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id}
            renderItem={renderExpenseItem}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            contentContainerStyle={styles.listContentContainer}
            extraData={filteredExpenses}
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(tabs)/(home)/input")}
        >
          <Ionicons name="add" size={24} color={AppColors.dark.text} />
        </TouchableOpacity>

        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    height: 55,
    resizeMode: "contain",
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
  incomeValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoIconContainer: {
    paddingLeft: 10,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.dark.tint + "20",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIconStyle: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: AppColors.dark.text,
    fontSize: 16,
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
    paddingHorizontal: 16,
    backgroundColor: AppColors.dark.background,
  },
  expenseIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  expenseDetailsContainer: {
    flex: 1,
    marginRight: 8,
  },
  expenseTitle: {
    color: AppColors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseDate: {
    color: AppColors.dark.secondaryText,
    fontSize: 12,
  },
  expenseNote: {
    color: AppColors.dark.secondaryText,
    fontSize: 12,
    fontStyle: "italic",
  },
  expenseAmount: {
    color: AppColors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  rightActionContainer: {
    backgroundColor: AppColors.dark.error,
    justifyContent: "center",
    alignItems: "center",
    width: 75,
  },
  deleteAction: {
    padding: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noExpensesText: {
    color: AppColors.dark.text,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateMessage: {
    color: AppColors.dark.secondaryText,
    fontSize: 14,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.dark.tint + "30",
  },
  listContentContainer: {
    paddingBottom: 80,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: AppColors.dark.tint,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  expenseDetails: {},
});
