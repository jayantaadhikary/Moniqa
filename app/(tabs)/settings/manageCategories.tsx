import { AppColors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ManageCategories = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: AppColors.dark.text }}>manageCategories</Text>
    </View>
  );
};

export default ManageCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
    padding: 16,
  },
});
