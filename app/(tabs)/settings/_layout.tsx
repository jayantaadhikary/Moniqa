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
          presentation: "formSheet",
          sheetAllowedDetents: [0.75, 1],
          sheetGrabberVisible: true,
          sheetCornerRadius: 30,
          contentStyle: {
            backgroundColor: AppColors.dark.background,
          },
        }}
      />
      <Stack.Screen name="notificationSettings" />
    </Stack>
  );
};

export default SettingsLayout;
