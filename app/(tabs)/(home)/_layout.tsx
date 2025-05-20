import { AppColors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";

const HomeLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          // headerShown: false, // Apply common screen options here
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="input"
          options={{
            presentation: "formSheet",
            sheetGrabberVisible: true,
            sheetCornerRadius: 30,
            contentStyle: {
              backgroundColor: AppColors.dark.background,
            },
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="incomeList"
          options={{
            headerShown: true,
            title: "Monthly Income",
            headerBackTitle: "Back",
            headerStyle: {
              backgroundColor: AppColors.dark.background,
            },
            headerTintColor: AppColors.dark.text,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="income/[id]" // Added screen for dynamic route
          options={{
            headerShown: true,
            title: "Edit Income",
            headerStyle: {
              backgroundColor: AppColors.dark.background,
            },
            headerTintColor: AppColors.dark.text,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack>
      <Toast />
    </>
  );
};

export default HomeLayout;
