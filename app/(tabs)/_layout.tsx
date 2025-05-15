import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { AppColors } from "../../constants/Colors";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: AppColors.dark.background,
          borderTopColor: "#1e1e1e",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: AppColors.dark.tint,
        tabBarInactiveTintColor: AppColors.dark.text,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="(summary)"
        options={{
          title: "Summary",
          tabBarIcon: ({ color }) => <Text style={{ color }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
