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
import mockExpenses from "../../../sampleData/mockExpenses";

type Period = "Day" | "Week" | "Month";

const calculateSpent = (period: Period) => {
  const now = new Date();
  const filteredExpenses = mockExpenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    if (period === "Day") {
      return expenseDate.toDateString() === now.toDateString();
    } else if (period === "Week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return expenseDate >= startOfWeek && expenseDate <= now;
    } else if (period === "Month") {
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    }
  });
  return filteredExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );
};

const HomePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Week");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const budgetData: Record<Period, { spent: number; total: number }> = {
    Day: { spent: 100, total: 500 },
    Week: { spent: 100, total: 500 },
    Month: { spent: 2000, total: 5000 },
  };

  const spent = calculateSpent(selectedPeriod);
  const { total } = budgetData[selectedPeriod];
  const progress = spent / total;

  const filteredExpenses = mockExpenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (selectedPeriod === "Day") {
        return expenseDate.toDateString() === new Date().toDateString();
      } else if (selectedPeriod === "Week") {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return expenseDate >= startOfWeek && expenseDate <= now;
      } else if (selectedPeriod === "Month") {
        const now = new Date();
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log("Filtered Expenses:", filteredExpenses);

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
              {Object.keys(budgetData).map((period) => (
                <Pressable
                  key={period}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedPeriod(period as Period);
                    setIsModalVisible(false);
                  }}
                >
                  <View style={styles.modalOptionRow}>
                    {selectedPeriod === period && (
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color={AppColors.dark.tint}
                        style={styles.modalOptionCheck}
                      />
                    )}
                    <Text style={styles.modalOptionText}>{period}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Tappable Card */}
      <View style={styles.budgetCard}>
        <Text style={styles.budgetTitle}>📅 {selectedPeriod} Budget</Text>
        <Text style={styles.budgetDetails}>
          💸 ${spent} spent of ${total}
        </Text>
        <ProgressBar
          progress={progress}
          color={AppColors.dark.tint}
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
            renderItem={({ item }) => (
              <View style={styles.expenseRow}>
                <Text style={styles.expenseIcon}>{item.emoji}</Text>
                <View style={styles.expenseDetailsContainer}>
                  <Text style={styles.expenseTitle}>{item.category}</Text>
                  <Text style={styles.expenseDate}>
                    {format(new Date(item.date), "dd MMM")}
                  </Text>
                  {item.note && (
                    <Text style={styles.expenseNote}>{item.note}</Text>
                  )}
                </View>
                <Text style={styles.expenseAmount}>{item.amount}</Text>
              </View>
            )}
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
        onPress={() => router.push("/input")}
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
