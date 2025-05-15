import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppColors } from "../../../constants/Colors";

const SummaryPage = () => {
  return (
    <View style={styles.container}>
      <Text>SummaryPage</Text>
    </View>
  );
};

export default SummaryPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.dark.background },
});
