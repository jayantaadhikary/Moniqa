import { AppColors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import useCategoryStore from "../../../stores/useCategoryStore";

const ManageCategories = () => {
  const {
    masterCategoryIcons,
    userCategoryIcons,
    createdCustomCategories,
    toggleCategorySelection,
    addCategory,
    deleteCustomCategory,
  } = useCategoryStore();

  const [isModalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryIcon) {
      addCategory(newCategoryName, newCategoryIcon);
      setNewCategoryName("");
      setNewCategoryIcon("");
      setModalVisible(false);
    } else {
      Alert.alert("Error", "Please provide both a name and an icon.");
    }
  };

  const handleLongPress = (name: string) => {
    if (createdCustomCategories[name] && !masterCategoryIcons[name]) {
      Alert.alert(
        "Delete Category",
        `Are you sure you want to delete the custom category "${name}"? This action cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteCustomCategory(name),
          },
        ]
      );
    } else {
      Alert.alert(
        "Cannot Delete",
        `"${name}" is a default category, it cannot be deleted. Just unselect it.`
      );
    }
  };

  // console.log("Master Categories:", masterCategoryIcons);
  // console.log("User Selected Categories:", userCategoryIcons);
  // console.log("Created Custom Categories:", createdCustomCategories);

  const allAvailableCategories = {
    ...masterCategoryIcons,
    ...createdCustomCategories,
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(allAvailableCategories)}
        keyExtractor={([name]) => name}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item: [name, icon] }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              userCategoryIcons[name] && styles.selectedCategory,
            ]}
            onPress={() => toggleCategorySelection(name)}
            onLongPress={() => handleLongPress(name)}
          >
            <Text style={styles.categoryText}>{`${icon} ${name}`}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: AppColors.dark.text, textAlign: "center" }}>
            No categories available.
          </Text>
        }
      />
      <Text
        style={{
          color: AppColors.dark.secondaryText,
          textAlign: "center",
          fontSize: 12,
          fontStyle: "italic",
        }}
      >
        Long press on a category to delete it.
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add New Category</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add New Category</Text>

              {newCategoryIcon === "" ? (
                <View style={{ width: "100%", height: 250 }}>
                  <EmojiSelector
                    onEmojiSelected={(selectedEmoji: string) => {
                      setNewCategoryIcon(selectedEmoji);
                    }}
                    showSearchBar={false}
                    showTabs={false}
                    showSectionTitles={false}
                    columns={6}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setNewCategoryIcon("")}
                >
                  <Text style={{ color: AppColors.dark.text }}>
                    {newCategoryIcon || "Select Emoji"}
                  </Text>
                </TouchableOpacity>
              )}
              <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleAddCategory}
                >
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
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
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryItem: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: AppColors.dark.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: AppColors.dark.primary + "95",
    borderColor: AppColors.dark.text,
  },
  categoryText: {
    color: AppColors.dark.text,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  addButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: AppColors.dark.primary + "95",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 18,
    backgroundColor: AppColors.dark.background,
  },
  modalTitle: {
    fontSize: 20,
    color: AppColors.dark.text,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.dark.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: AppColors.dark.text,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: AppColors.dark.primary,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: AppColors.dark.cardBackground,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});
