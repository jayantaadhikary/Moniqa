import { AppColors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="input"
        options={{
          presentation: "formSheet", // Changed from "formSheet" to "modal"
          sheetGrabberVisible: true,
          sheetCornerRadius: 30,
          contentStyle: {
            backgroundColor: AppColors.dark.background,
          },
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
