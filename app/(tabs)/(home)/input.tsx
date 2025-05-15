import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import { AppColors } from "../../../constants/Colors";
import { useCategoryContext } from "../../../context/CategoryContext";

const InputPage = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [emoji, setEmoji] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showAddCategoryFields, setShowAddCategoryFields] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { categoryIcons, setCategoryIcons } = useCategoryContext();

  const handleAddCategory = () => {
    if (newCategory.trim() && emoji) {
      console.log("Adding category:", newCategory, "with emoji:", emoji);
      setCategoryIcons({ ...categoryIcons, [newCategory]: emoji });
      setCategory(newCategory);
      setNewCategory("");
      setEmoji(null);
      setShowAddCategoryFields(false);
    } else {
      console.log("Category name or emoji is missing.");
    }
  };

  const categoryList = Object.keys(categoryIcons);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Expenses</Text>

      {/* Amount and Date Picker */}
      <View style={styles.horizontalContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>💵 Amount</Text>
          <Text style={styles.label}>📅 Date</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="$0.00"
            placeholderTextColor={AppColors.dark.secondaryText}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => setDate(selectedDate || date)}
            themeVariant="dark"
          />
        </View>
      </View>

      {/* Category Selection */}
      <Text style={styles.label}>🗂️ Category</Text>
      <View style={styles.categoryContainer}>
        {categoryList.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              category === item && styles.selectedCategory,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text style={styles.categoryText}>
              {categoryIcons[item]} {item}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => setShowAddCategoryFields(!showAddCategoryFields)}
        >
          <Text style={styles.addCategoryText}>➕ Add Category</Text>
        </TouchableOpacity>
      </View>

      {showAddCategoryFields && (
        <View style={styles.newCategoryContainer}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              console.log("Opening emoji picker");
              setEmoji(null); // Reset emoji selection
            }}
          >
            <Text style={{ color: AppColors.dark.text }}>
              {emoji || "Select Emoji"}
            </Text>
          </TouchableOpacity>

          {emoji === null && (
            <View style={{ width: "100%", height: 200 }}>
              <EmojiSelector
                onEmojiSelected={(selectedEmoji: string) => {
                  console.log("Emoji selected:", selectedEmoji);
                  setEmoji(selectedEmoji);
                }}
                showSearchBar={false}
                showTabs={true}
                showSectionTitles={false}
                columns={8}
              />
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Enter category name (e.g., Art)"
            placeholderTextColor={AppColors.dark.secondaryText}
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCategory}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Note Input */}
      <Text style={styles.label}>📝 Note (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a note"
        placeholderTextColor={AppColors.dark.secondaryText}
        value={note}
        onChangeText={setNote}
      />
    </View>
  );
};

export default InputPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
    padding: 16,
  },
  header: {
    color: AppColors.dark.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  labelContainer: {
    flex: 1,
  },
  inputContainer: {
    flex: 2,
  },
  label: {
    color: AppColors.dark.text,
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: AppColors.dark.secondaryBackground,
    color: AppColors.dark.text,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: AppColors.dark.secondaryBackground,
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: AppColors.dark.tint,
  },
  categoryText: {
    color: AppColors.dark.text,
  },
  addCategoryButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: AppColors.dark.tint,
    borderRadius: 4,
    alignItems: "center",
  },
  addCategoryText: {
    color: AppColors.dark.text,
    fontWeight: "bold",
  },
  newCategoryContainer: {
    marginTop: 16,
  },
  addButton: {
    backgroundColor: AppColors.dark.tint,
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: AppColors.dark.text,
    textAlign: "center",
    fontWeight: "bold",
  },
});
