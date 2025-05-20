import { AppColors } from "@/constants/Colors";
import useIncomeStore, { Income } from "@/stores/useIncomeStore";
import useUserPreferencesStore from "@/stores/useUserPreferencesStore";
import { Ionicons } from "@expo/vector-icons"; // For potential icons
import {
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
} from "date-fns";
import { useRouter } from "expo-router"; // Added
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const IncomeListPage: React.FC = () => {
  const { incomes } = useIncomeStore();
  const { selectedCurrencySymbol } = useUserPreferencesStore();
  const [monthlyIncomes, setMonthlyIncomes] = useState<Income[]>([]);
  const router = useRouter(); // Added

  useEffect(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const filteredIncomes = incomes
      .filter((income) => {
        try {
          const incomeDate = parseISO(income.date);
          return isWithinInterval(incomeDate, {
            start: monthStart,
            end: monthEnd,
          });
        } catch (e) {
          console.warn(
            `Error parsing date for income ID ${income.id}: ${income.date}`,
            e
          );
          return false;
        }
      })
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()); // Sort by date, most recent first
    setMonthlyIncomes(filteredIncomes);
  }, [incomes]);

  const renderIncomeItem = ({ item }: { item: Income }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/(home)/income/${item.id}`)}
      style={styles.itemContainerTouchable} // Changed style name for clarity
    >
      <View style={styles.itemIconContainer}>
        <Text style={styles.itemEmoji}>{item.emoji || "💰"}</Text>
      </View>
      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemSource} numberOfLines={1}>
          {item.source}
        </Text>
        <Text style={styles.itemDate}>
          {format(parseISO(item.date), "MMM dd, yyyy")}
        </Text>
        {item.note && (
          <Text style={styles.itemNote} numberOfLines={1}>
            {item.note}
          </Text>
        )}
      </View>
      <Text style={styles.itemAmount}>
        {selectedCurrencySymbol}
        {parseFloat(item.amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {monthlyIncomes.length > 0 ? (
        <FlatList
          data={monthlyIncomes}
          renderItem={renderIncomeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="sad-outline"
            size={60}
            color={AppColors.dark.secondaryText}
          />
          <Text style={styles.emptyText}>
            No income recorded for this month.
          </Text>
          <Text style={styles.emptySubText}>
            Tap the &apos;+&apos; button on the Home screen to add new income.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default IncomeListPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
  },
  listContentContainer: {
    paddingVertical: 10,
  },
  itemContainerTouchable: {
    // Changed style name
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: AppColors.dark.secondaryBackground,
  },
  itemIconContainer: {
    backgroundColor: AppColors.dark.background, // Slightly different background for icon circle
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemDetailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemSource: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 13,
    color: AppColors.dark.secondaryText,
    marginBottom: 3,
  },
  itemNote: {
    fontSize: 12,
    color: AppColors.dark.secondaryText,
    fontStyle: "italic",
  },
  itemAmount: {
    fontSize: 17,
    fontWeight: "bold",
    color: AppColors.dark.success, // Use success color for income amounts
  },
  separator: {
    height: 1,
    // backgroundColor: AppColors.dark.border,
    marginLeft: 20 + 50 + 15, // Align with details, after icon and margin
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginTop: 15,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: AppColors.dark.secondaryText,
    marginTop: 8,
    textAlign: "center",
  },
});
