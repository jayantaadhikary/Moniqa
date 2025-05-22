import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../../../constants/Colors";
import usePremiumStore, {
  PREMIUM_BUNDLE,
  PREMIUM_FEATURES_INFO,
  PremiumFeature,
} from "../../../services/premium/premium-features";

/**
 * Premium Features Screen
 * Shows all available premium features and allows purchasing them, or confirms active premium status.
 */
const PremiumScreen: React.FC = () => {
  const { hasFeature, unlockAllFeatures, isPremium } = usePremiumStore(); // Removed unlockFeature
  const [unlockingFeature, setUnlockingFeature] = useState<string | null>(null);
  const router = useRouter();

  // Handler for unlocking all features (premium bundle)
  const handleUnlockAll = async () => {
    setUnlockingFeature("bundle");
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    unlockAllFeatures();
    setUnlockingFeature(null);
  };

  // Render each premium feature in the list
  const renderFeature = ({ item }: { item: PremiumFeature }) => {
    const featureInfo = PREMIUM_FEATURES_INFO[item];
    const isUnlocked = hasFeature(item); // This will be true if isPremium is true

    return (
      <TouchableOpacity
        style={[styles.featureCard, isUnlocked && styles.featureCardUnlocked]}
        disabled={true} // All items are informational if premium is active or not yet purchased (purchase is via bundle)
      >
        <View style={styles.featureIconContainer}>
          <Ionicons
            name={featureInfo.icon as any}
            size={24}
            color={isUnlocked ? AppColors.dark.success : AppColors.dark.text}
          />
        </View>

        <View style={styles.featureTextContainer}>
          <Text style={styles.featureTitle}>{featureInfo.name}</Text>
          <Text style={styles.featureDescription}>
            {featureInfo.description}
          </Text>
        </View>

        <View style={styles.featureStatusContainer}>
          {isUnlocked ? (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={AppColors.dark.success}
            />
          ) : // Show nothing here if not unlocked, as purchase is via bundle button
          null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: isPremium ? "Premium Features" : "Unlock Premium", // Changed title when premium is active
          headerStyle: { backgroundColor: AppColors.dark.background },
          headerTintColor: AppColors.dark.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 15 }}
            >
              <Ionicons
                name="close-outline"
                size={28}
                color={AppColors.dark.text}
              />
            </TouchableOpacity>
          ),
          headerLeft: () => null, // Hide default back button if sheetGrabberVisible is true
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        {/* Header Section - Common for both states, but text might change slightly */}
        <View style={styles.headerContainer}>
          <Ionicons
            name={isPremium ? "star" : "sparkles-outline"}
            size={40}
            color={isPremium ? AppColors.dark.success : AppColors.dark.tint}
          />
          <Text style={styles.header}>
            {isPremium ? "You are a Premium User!" : "Unlock Moniqa Premium"}
          </Text>
          <Text style={styles.subheader}>
            {isPremium
              ? "All premium features listed below are active. Thank you for your support!"
              : PREMIUM_BUNDLE.description}
          </Text>
        </View>

        <FlatList
          data={Object.values(PremiumFeature)} // Show all features regardless of premium status
          renderItem={renderFeature}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.featureList}
          scrollEnabled={false}
        />

        {!isPremium && (
          <>
            <TouchableOpacity
              style={[
                styles.unlockAllButton,
                unlockingFeature === "bundle" && styles.unlockingButton,
              ]}
              onPress={handleUnlockAll}
              disabled={unlockingFeature !== null}
            >
              {unlockingFeature === "bundle" ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={PREMIUM_BUNDLE.icon as any}
                    size={22}
                    color="#FFFFFF"
                    style={styles.bundleIcon}
                  />
                  <Text style={styles.unlockAllText}>
                    {PREMIUM_BUNDLE.name}
                  </Text>
                  <Text style={styles.unlockAllPrice}>
                    {PREMIUM_BUNDLE.price}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Purchases are processed by the App Store/Play Store.
            </Text>
          </>
        )}

        {isPremium && (
          <TouchableOpacity
            style={styles.doneButton} // Re-use doneButton style or create a new one
            onPress={() => router.back()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    // marginTop: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  subheader: {
    fontSize: 14,
    color: AppColors.dark.secondaryText,
    marginBottom: 12,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 10, // Add some horizontal padding for subheader
  },
  featureList: {
    marginBottom: 12, // Add some margin below the list before the button or done button
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.dark.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureCardUnlocked: {
    borderWidth: 1,
    borderColor: AppColors.dark.success,
  },
  featureIconContainer: {
    width: 48, // Consistent size
    height: 48,
    borderRadius: 24, // Fully rounded
    backgroundColor: `${AppColors.dark.text}15`, // More subtle background for icon
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.dark.text,
    marginBottom: 2, // Reduced margin
  },
  featureDescription: {
    fontSize: 13, // Slightly reduced
    color: AppColors.dark.secondaryText,
  },
  featureStatusContainer: {
    marginLeft: 12, // Increased margin for spacing
    alignItems: "center",
    justifyContent: "center",
    width: 24, // Changed from minWidth: 60 to a fixed width matching the icon
  },
  unlockAllButton: {
    backgroundColor: AppColors.dark.tint,
    borderRadius: 12,
    paddingVertical: 18, // Increased padding
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 16, // Increased margin top for more separation
    marginBottom: 8, // Reduced margin bottom
  },
  unlockingButton: {
    opacity: 0.8,
  },
  bundleIcon: {
    marginRight: 10, // Increased margin
  },
  unlockAllText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1, // Allow text to take space
    textAlign: "center", // Center text if price is not there or short
  },
  unlockAllPrice: {
    fontSize: 17, // Slightly adjusted
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8, // Add some space if text is long
  },
  disclaimer: {
    fontSize: 12,
    color: AppColors.dark.secondaryText,
    textAlign: "center",
    marginTop: 10, // Increased margin
    paddingHorizontal: 20,
  },
  doneButton: {
    backgroundColor: AppColors.dark.tint,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 12, // Add margin top if it's the last element
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PremiumScreen;
