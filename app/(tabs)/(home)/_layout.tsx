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
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="input"
          options={{
            presentation: "formSheet",
            sheetGrabberVisible: true,
            sheetCornerRadius: 30,
            contentStyle: {
              backgroundColor: AppColors.dark.background,
            },
          }}
        />
      </Stack>
      <Toast />
    </>
  );
};

export default HomeLayout;
