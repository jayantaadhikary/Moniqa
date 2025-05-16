import { AppColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  color?: string;
  isPlaceholder?: boolean;
  value?: string;
}

interface SettingsGroup {
  id: string;
  title: string;
  options: SettingItem[];
}

const SettingScreen = () => {
  const router = useRouter();

  // Placeholder actions - to be implemented later
  const handleManageCurrency = () =>
    console.log("Navigate to /settings/manage-currency (Placeholder)");
  const handleManageBudget = () =>
    console.log("Navigate to /settings/manage-budget (Placeholder)");
  const handleManageCategories = () =>
    console.log("Navigate to /settings/manage-categories (Placeholder)");
  const handleNotificationReminders = () =>
    console.log("Navigate to Notification Reminders (Placeholder)");

  // Renamed to be specific to clearing only expenses
  const handleFreshStart = () => {
    Alert.alert(
      "Fresh Start",
      "Are you sure you want to clear all your expense data? Your settings (budget, currency, categories) will be kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Expenses",
          style: "destructive",
          onPress: () => console.log("All expense data cleared (Placeholder)"), // Later, this will call a specific store action
        },
      ]
    );
  };

  // This will clear ALL app data
  const handleDeleteAccountAndData = () => {
    Alert.alert(
      "Delete Account & All Data",
      "Are you sure you want to delete your account and all associated data? This will reset the app to its initial state and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: () => console.log("All app data cleared (Placeholder)"), // Later, this will clear MMKV and reset stores
        },
      ]
    );
  };

  const handleAccountSettings = () =>
    console.log("Navigate to Account Settings (Placeholder)");
  const handleContactSupport = () =>
    Linking.openURL("mailto:jayadky@yahoo.com"); // Replace with actual email
  const handleAboutApp = () =>
    console.log("Navigate to /settings/about-app (Placeholder)");

  const handleUpgrade = () =>
    console.log("Navigate to Upgrade Screen (Placeholder)");

  const settingsData: SettingsGroup[] = [
    {
      id: "appSettings",
      title: "App Settings",
      options: [
        {
          id: "currency",
          title: "Manage Currency",
          icon: "cash-outline",
          action: handleManageCurrency,
        },
        {
          id: "budget",
          title: "Manage Budget",
          icon: "calculator-outline",
          action: handleManageBudget,
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
          action: handleFreshStart, // New handler for clearing only expenses
        },
        {
          id: "deleteAccountAndData",
          title: "Delete Account & All Data",
          icon: "trash-bin-outline",
          action: handleDeleteAccountAndData, // New handler for clearing all data
          color: AppColors.dark.error, // Keep red for this more destructive action
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.mainHeaderTitle}>Settings</Text>

        {settingsData.map((group) => (
          <View key={group.id} style={styles.groupContainer}>
            <Text style={styles.groupHeaderTitle}>{group.title}</Text>
            <View style={styles.settingsGroupCard}>
              {group.options.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    index === group.options.length - 1 &&
                      styles.lastSettingItem,
                  ]}
                  onPress={item.action}
                >
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={item.color || AppColors.dark.text}
                    style={styles.icon}
                  />
                  <View style={styles.settingTextContainer}>
                    <Text
                      style={[
                        styles.settingText,
                        { color: item.color || AppColors.dark.text },
                      ]}
                    >
                      {item.title}
                    </Text>
                    {item.value && (
                      <Text style={styles.settingValueText}>{item.value}</Text>
                    )}
                  </View>
                  {item.isPlaceholder && (
                    <Text style={styles.placeholderText}>(Coming Soon)</Text>
                  )}
                  <Ionicons
                    name="chevron-forward-outline"
                    size={22}
                    color={AppColors.dark.secondaryText}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
    fontSize: 15,
    color: AppColors.dark.text,
  },
  settingValueText: {
    fontSize: 16,
    color: AppColors.dark.secondaryText,
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: AppColors.dark.secondaryText,
    fontStyle: "italic",
    marginRight: 8,
  },
});
