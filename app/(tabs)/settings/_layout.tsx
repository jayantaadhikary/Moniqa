import { AppColors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";

const SettingsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="manageCategories"
        options={{
          presentation: "card",
          headerShown: true, // Enable the header
          headerTitle: "Manage Categories", // Add a title
          headerBackTitle: "Back", // Customize back button text
          headerStyle: {
            backgroundColor: AppColors.dark.background,
          },
          headerTintColor: AppColors.dark.text, // Set back button color
        }}
      />
      {/* <Stack.Screen name="notificationSettings" /> */}
      {/* Removed notificationSettings as it's not being implemented now */}
      <Stack.Screen
        name="about"
        options={{
          presentation: "formSheet",
          // headerShown: true,
          // headerTitle: "About Moniqa", // Changed title
          // headerBackTitle: "Back",
          sheetGrabberVisible: true,
          contentStyle: {
            backgroundColor: AppColors.dark.background,
          },
          // headerTintColor: AppColors.dark.text,
        }}
      />
      <Stack.Screen
        name="premium"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          contentStyle: {
            backgroundColor: AppColors.dark.background,
          },
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
