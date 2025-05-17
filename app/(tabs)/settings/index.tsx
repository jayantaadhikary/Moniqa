import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useShallow } from "zustand/react/shallow";
import { AppColors } from "../../../constants/Colors";
import {
  Currency,
  getCurrencySymbol,
  majorCurrencies,
} from "../../../constants/currencies";
import useExpenseStore from "../../../stores/useExpenseStore";
import useUserPreferencesStore from "../../../stores/useUserPreferencesStore";

interface SettingItemOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  color?: string;
  isPlaceholder?: boolean;
  value?: string;
}

interface SettingsGroupData {
  id: string;
  title: string;
  options: SettingItemOption[];
}

const SettingScreen = () => {
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState("");

  const { selectedCurrencyCode, setSelectedCurrency, loadCurrency } =
    useUserPreferencesStore(
      useShallow((state) => ({
        selectedCurrencyCode: state.selectedCurrencyCode,
        setSelectedCurrency: state.setSelectedCurrency,
        loadCurrency: state.loadCurrency,
      }))
    );

  useEffect(() => {
    loadCurrency();
  }, [loadCurrency]);

  const { budgetData, setInitialBudgetData } = useExpenseStore(
    useShallow((state) => ({
      budgetData: state.budgetData,
      setInitialBudgetData: state.setInitialBudgetData,
    }))
  );

  useEffect(() => {
    if (budgetData.Month.total) {
      setMonthlyBudgetInput(budgetData.Month.total.toString());
    }
  }, [budgetData.Month.total]);

  const [currentPickerValue, setCurrentPickerValue] =
    useState(selectedCurrencyCode);

  useEffect(() => {
    setCurrentPickerValue(selectedCurrencyCode);
  }, [selectedCurrencyCode]);

  const handleManageCurrencyClick = useCallback(() => {
    setCurrentPickerValue(selectedCurrencyCode);
    setCurrencyPickerOpen(true);
  }, [selectedCurrencyCode]);

  const handleManageBudgetClick = () => {
    setMonthlyBudgetInput(budgetData.Month.total.toString());
    setBudgetModalVisible(true);
  };

  const handleSaveBudget = () => {
    const newMonthlyBudget = parseFloat(monthlyBudgetInput);
    if (!isNaN(newMonthlyBudget) && newMonthlyBudget > 0) {
      setInitialBudgetData(newMonthlyBudget);
      setBudgetModalVisible(false);
    } else {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid positive number for the budget."
      );
    }
  };

  const handleManageCategories = () =>
    console.log("Navigate to /settings/manage-categories (Placeholder)");
  const handleNotificationReminders = () =>
    console.log("Navigate to Notification Reminders (Placeholder)");

  const handleFreshStart = () => {
    Alert.alert(
      "Fresh Start",
      "Are you sure you want to clear all your expense data? Your settings (budget, currency, categories) will be kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Expenses",
          style: "destructive",
          onPress: () => console.log("All expense data cleared (Placeholder)"),
        },
      ]
    );
  };

  const handleDeleteAccountAndData = () => {
    Alert.alert(
      "Delete Account & All Data",
      "Are you sure you want to delete your account and all associated data? This will reset the app to its initial state and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: () => console.log("All app data cleared (Placeholder)"),
        },
      ]
    );
  };

  const handleAccountSettings = () =>
    console.log("Navigate to Account Settings (Placeholder)");

  const handleContactSupport = async () => {
    const email = "jayadky@yahoo.com";
    const subject = "Moniqa App Support";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          "Cannot open email app",
          "No email application is available to handle this request."
        );
      }
    } catch (error) {
      console.error("Failed to open mailto link", error);
      Alert.alert(
        "Failed to open email app",
        "Please send an email to jayadky@yahoo.com for support or feedbacks"
      );
    }
  };

  const handleAboutApp = () =>
    console.log("Navigate to /settings/about-app (Placeholder)");

  const handleUpgrade = () =>
    console.log("Navigate to Upgrade Screen (Placeholder)");

  const settingsData: SettingsGroupData[] = [
    {
      id: "appSettings",
      title: "App Settings",
      options: [
        {
          id: "currency",
          title: `Manage Currency (${getCurrencySymbol(selectedCurrencyCode)})`,
          icon: "cash-outline",
          action: handleManageCurrencyClick,
        },
        {
          id: "budget",
          title: "Manage Budget",
          icon: "calculator-outline",
          action: handleManageBudgetClick,
        },
        {
          id: "categories",
          title: "Manage Categories",
          icon: "list-outline",
          action: handleManageCategories,
        },
        {
          id: "reminders",
          title: "Reminders",
          icon: "notifications-outline",
          action: handleNotificationReminders,
          isPlaceholder: true,
        },
      ],
    },
    {
      id: "accountSettings",
      title: "Account Settings",
      options: [
        {
          id: "manageAccount",
          title: "Manage Account",
          icon: "person-circle-outline",
          action: handleAccountSettings,
          isPlaceholder: true,
        },
        {
          id: "appLock",
          title: "App Lock",
          icon: "lock-closed-outline",
          action: () => console.log("Navigate to App Lock (Placeholder)"),
          isPlaceholder: true,
        },
        {
          id: "upgrade",
          title: "Upgrade to Pro",
          icon: "star-outline",
          action: handleUpgrade,
          isPlaceholder: true,
        },
      ],
    },
    {
      id: "helpSupport",
      title: "Help & Support",
      options: [
        {
          id: "contactSupport",
          title: "Contact Support",
          icon: "mail-outline",
          action: handleContactSupport,
        },
        {
          id: "aboutApp",
          title: "About Moniqa",
          icon: "information-circle-outline",
          action: handleAboutApp,
        },
        {
          id: "freshStart",
          title: "Need a fresh start? (Clear Expenses)",
          icon: "refresh-circle-outline",
          action: handleFreshStart,
        },
        {
          id: "deleteAccountAndData",
          title: "Delete Account & All Data",
          icon: "trash-bin-outline",
          action: handleDeleteAccountAndData,
          color: AppColors.dark.error,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainHeaderTitle}>Settings</Text>

        {settingsData.map((group: SettingsGroupData) => (
          <View key={group.id} style={styles.groupContainer}>
            <Text style={styles.groupHeaderTitle}>{group.title}</Text>
            <View style={styles.settingsGroupCard}>
              {group.options.map((item: SettingItemOption, index: number) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    index === group.options.length - 1 &&
                      styles.lastSettingItem,
                  ]}
                  onPress={item.action}
                  disabled={item.isPlaceholder}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={
                      item.color ||
                      (item.isPlaceholder
                        ? AppColors.dark.secondaryText
                        : AppColors.dark.text)
                    }
                    style={styles.icon}
                  />
                  <View style={styles.settingTextContainer}>
                    <Text
                      style={[
                        styles.settingText,
                        {
                          color:
                            item.color ||
                            (item.isPlaceholder
                              ? AppColors.dark.secondaryText
                              : AppColors.dark.text),
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    {item.isPlaceholder && (
                      <Text style={styles.placeholderText}>(Coming Soon)</Text>
                    )}
                    {!item.isPlaceholder && (
                      <Ionicons
                        name={
                          item.id === "currency"
                            ? "chevron-down-outline"
                            : "chevron-forward-outline"
                        }
                        size={20}
                        color={AppColors.dark.secondaryText}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {currencyPickerOpen && (
        <DropDownPicker
          open={currencyPickerOpen}
          value={currentPickerValue}
          items={majorCurrencies.map((curr: Currency) => ({
            label: `${curr.label} (${curr.symbol})`,
            value: curr.value,
          }))}
          setOpen={setCurrencyPickerOpen}
          setValue={setCurrentPickerValue}
          onSelectItem={(item) => {
            if (item && item.value) {
              const selected = majorCurrencies.find(
                (c) => c.value === item.value
              );
              if (selected) {
                setSelectedCurrency(selected.value, selected.symbol);
              }
            }
          }}
          listMode="MODAL"
          placeholder="Select a currency"
          theme="DARK"
          style={[
            styles.dropdownPicker,
            {
              backgroundColor: AppColors.dark.cardBackground,
              borderColor: AppColors.dark.border,
            },
          ]}
          textStyle={{ color: AppColors.dark.text }}
          dropDownContainerStyle={[
            styles.dropdownContainerStyle,
            {
              backgroundColor: AppColors.dark.cardBackground,
              borderColor: AppColors.dark.border,
            },
          ]}
          listItemLabelStyle={{ color: AppColors.dark.text }}
          selectedItemLabelStyle={{ color: AppColors.dark.primary }}
          modalProps={{
            animationType: "slide",
          }}
          modalContentContainerStyle={{
            backgroundColor: AppColors.dark.cardBackground,
          }}
          placeholderStyle={{ color: AppColors.dark.secondaryText }}
          zIndex={3000}
          zIndexInverse={1000}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={budgetModalVisible}
        onRequestClose={() => {
          setBudgetModalVisible(!budgetModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Set Monthly Budget</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbolModal}>
                {getCurrencySymbol(selectedCurrencyCode)}
              </Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g., 5000"
                placeholderTextColor={AppColors.dark.secondaryText}
                keyboardType="numeric"
                value={monthlyBudgetInput}
                onChangeText={setMonthlyBudgetInput}
                autoFocus
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBudgetModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveBudget}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingBottom: 50,
  },
  mainHeaderTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupHeaderTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: AppColors.dark.secondaryText,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  settingsGroupCard: {
    backgroundColor: AppColors.dark.secondaryBackground,
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: AppColors.dark.border,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.dark.border,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  icon: {
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: AppColors.dark.secondaryText,
    fontStyle: "italic",
    marginLeft: 8,
  },
  dropdownPicker: {
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownContainerStyle: {
    borderWidth: 1,
    borderRadius: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    margin: 20,
    backgroundColor: AppColors.dark.cardBackground,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: AppColors.dark.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.dark.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  currencySymbolModal: {
    fontSize: 18,
    color: AppColors.dark.text,
    marginRight: 8,
  },
  modalTextInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: AppColors.dark.text,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: AppColors.dark.secondaryBackground,
    borderColor: AppColors.dark.border,
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: AppColors.dark.primary,
  },
  modalButtonText: {
    color: AppColors.dark.text,
    fontWeight: "bold",
    textAlign: "center",
  },
});
