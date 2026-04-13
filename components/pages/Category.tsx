import HorizontalLine from "@/components/common/HorizontalLine";
import SwipeableRow from "@/components/common/SwipeableRow";
import { category } from "@/components/type";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import { ArrowLeft, Plus, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CategoryProps {
  onClose?: () => void;
}

const Category = ({ onClose }: CategoryProps) => {
  const insets = useSafeAreaInsets();

  const [categoryList, setCategoryList] = useState<category[]>([]);
  const amountRef = useRef<TextInput>(null);
  const [categoryName, setCategoryName] = useState("");
  const [modelView, setModelView] = useState(false);
  const [isExpenseCategory, setIsExpenseCategory] = useState(true);
  const [editingCategory, setEditingCategory] = useState<category | null>(null);

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getAllCategory();
      setCategoryList(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAdd = () => {
    try {
      if (editingCategory) {
        // Update existing category
        updateCategory({
          id: editingCategory.id,
          category_name: categoryName,
          is_deduct: isExpenseCategory,
        });
      } else {
        // Create new category
        createCategory(categoryName, isExpenseCategory);
      }
      loadData();
      setModelView(false);
      setCategoryName("");
      setIsExpenseCategory(true);
      setEditingCategory(null);
    } catch {
      console.log("Error adding/updating category");
    }
  };

  const handleDelete = ({ id }: { id: string }) => {
    Alert.alert("Delete item?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteItem({ id: id }),
        style: "destructive",
      },
    ]);
  };

  const deleteItem = ({ id }: { id: string }) => {
    try {
      deleteCategory(id);
      loadData();
      console.log("Deleted");
    } catch {
      console.log("Error Deleting Ledger");
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleEdit = (item: category) => {
    setEditingCategory(item);
    setCategoryName(item.category_name);
    setIsExpenseCategory(item.is_deduct);
    setModelView(true);
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Header with back and close icons */}
        <View style={styles.categoryScreenHeader}>
          <View style={styles.categoryScreenHeaderLeft}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleClose}
            >
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.categoryScreenTitle}>Category</Text>
          </View>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleClose}
          >
            <X color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        {categoryList.map((c) => (
          <SwipeableRow
            key={c.id}
            onEdit={() => handleEdit(c)}
            onDelete={() => handleDelete(c)}
          >
            <View
              style={[
                styles.ledgerItem,
                {
                  borderLeftWidth: 4,
                  borderLeftColor: c.is_deduct ? "#ef4444" : "#22c55e",
                  backgroundColor: "#252525",
                  borderColor: "#333",
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: c.is_deduct ? "#ef444415" : "#22c55e15",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: c.is_deduct ? "#ef4444" : "#22c55e",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {c.is_deduct ? "−" : "+"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ledgerText}>{c.category_name}</Text>
                  <Text
                    style={{
                      fontFamily: "SpaceMono_400Regular",
                      fontSize: 11,
                      color: "#666",
                      marginTop: 2,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {c.is_deduct ? "Expense" : "Income"}
                  </Text>
                </View>
              </View>
            </View>
          </SwipeableRow>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.floatButton,
          {
            position: "absolute",
            bottom: insets.bottom + 65,
            right: 20,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          setEditingCategory(null);
          setCategoryName("");
          setIsExpenseCategory(true);
          setModelView(true);
        }}
      >
        <Plus color="#000" size={26} />
      </TouchableOpacity>
      <Modal
        transparent
        animationType="slide"
        visible={modelView}
        onRequestClose={() => {
          setModelView(false);
          setEditingCategory(null);
          setCategoryName("");
          setIsExpenseCategory(true);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? "Edit Category" : "Add Category"}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModelView(false);
                  setEditingCategory(null);
                  setCategoryName("");
                  setIsExpenseCategory(true);
                }}
              >
                <X size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.modalContainer}
              >
                <HorizontalLine />
                <Text style={styles.label}>Category Type</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      isExpenseCategory && styles.toggleButtonActive,
                    ]}
                    onPress={() => setIsExpenseCategory(true)}
                  >
                    <Text
                      style={[
                        styles.toggleButtonText,
                        isExpenseCategory && styles.toggleButtonTextActive,
                      ]}
                    >
                      − Expense
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      !isExpenseCategory && styles.toggleButtonActive,
                    ]}
                    onPress={() => setIsExpenseCategory(false)}
                  >
                    <Text
                      style={[
                        styles.toggleButtonText,
                        !isExpenseCategory && styles.toggleButtonTextActive,
                      ]}
                    >
                      + Income
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>Category Name</Text>
                <View>
                  <TextInput
                    ref={amountRef}
                    style={styles.pageInput}
                    placeholder="Enter Category Name"
                    value={categoryName}
                    onChangeText={setCategoryName}
                    returnKeyType="done"
                    placeholderTextColor="#999"
                  />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                  <Text
                    style={{
                      fontFamily: "SpaceMono_400Regular",
                      fontSize: 16,
                    }}
                  >
                    {editingCategory ? "Save" : "Add"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModelView(false);
                    setEditingCategory(null);
                    setCategoryName("");
                    setIsExpenseCategory(true);
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "SpaceMono_400Regular",
                      fontSize: 16,
                      color: "#999",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Category;
