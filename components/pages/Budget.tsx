import { budget, category } from "@/components/type";
import {
  createBudget,
  deleteBudget,
  getAllCategory,
  getBudgetsForMonth,
  updateBudget,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import {
  formatMonthDisplay,
  getCurrentMonth,
} from "@/utils/BudgetCalculations";
import { Picker } from "@react-native-picker/picker";
import { X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface BudgetProps {
  visible: boolean;
  onClose: () => void;
}

const Budget = ({ visible, onClose }: BudgetProps) => {
  const [budgets, setBudgets] = useState<budget[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingBudgetAmount, setEditingBudgetAmount] = useState("");
  const [budgetLoading, setBudgetLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  useEffect(() => {
    if (categories.length > 0 && visible) {
      loadBudgets();
    }
  }, [categories, visible]);

  const loadCategories = async () => {
    try {
      const cats = await getAllCategory();
      setCategories(cats);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadBudgets = async () => {
    try {
      const currentMonth = getCurrentMonth();
      const monthBudgets = await getBudgetsForMonth(currentMonth);

      const enrichedBudgets = monthBudgets.map((b) => ({
        ...b,
        category_name:
          categories.find((c) => c.id === b.category_id)?.category_name ||
          "Unknown",
      }));

      setBudgets(enrichedBudgets);
    } catch (error) {
      console.error("Error loading budgets:", error);
    }
  };

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.is_deduct === true),
    [categories]
  );

  const handleCreateBudget = async () => {
    if (!newBudgetCategory || !newBudgetAmount) {
      Alert.alert("Error", "Please select a category and enter an amount");
      return;
    }

    const amount = parseFloat(newBudgetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (budgets.some((b) => b.category_id === newBudgetCategory)) {
      Alert.alert("Error", "Budget already exists for this category");
      return;
    }

    setBudgetLoading(true);
    try {
      const currentMonth = getCurrentMonth();
      await createBudget({
        category_id: newBudgetCategory,
        allocated_amount: amount,
        month: currentMonth,
      });

      setNewBudgetCategory("");
      setNewBudgetAmount("");
      await loadBudgets();
      Alert.alert("Success", "Budget created successfully");
    } catch (error) {
      console.error("Error creating budget:", error);
      Alert.alert("Error", "Failed to create budget");
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleUpdateBudget = async (budgetId: string) => {
    const amount = parseFloat(editingBudgetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setBudgetLoading(true);
    try {
      await updateBudget(budgetId, amount);
      setEditingBudgetId(null);
      setEditingBudgetAmount("");
      await loadBudgets();
    } catch (error) {
      console.error("Error updating budget:", error);
      Alert.alert("Error", "Failed to update budget");
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    Alert.alert(
      "Delete Budget",
      "Are you sure you want to delete this budget?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setBudgetLoading(true);
            try {
              await deleteBudget(budgetId);
              await loadBudgets();
            } catch (error) {
              console.error("Error deleting budget:", error);
              Alert.alert("Error", "Failed to delete budget");
            } finally {
              setBudgetLoading(false);
            }
          },
        },
      ]
    );
  };

  const startEditingBudget = (budgetId: string, currentAmount: number) => {
    setEditingBudgetId(budgetId);
    setEditingBudgetAmount(currentAmount.toString());
  };

  const cancelEditingBudget = () => {
    setEditingBudgetId(null);
    setEditingBudgetAmount("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.budgetModalOverlay}>
        <View style={styles.budgetModalContent}>
          <View style={styles.budgetModalHeader}>
            <Text style={styles.budgetModalTitle}>
              Manage Budgets - {formatMonthDisplay(getCurrentMonth())}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.budgetModalBody}>
            {/* Add New Budget Form */}
            <View style={styles.budgetFormSection}>
              <Text style={styles.budgetFormTitle}>Add New Budget</Text>

              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={newBudgetCategory}
                  onValueChange={setNewBudgetCategory}
                  style={styles.pickerCont}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Select Category" value="" />
                  {expenseCategories.map((cat) => (
                    <Picker.Item
                      key={cat.id}
                      label={cat.category_name}
                      value={cat.id}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.label, { marginTop: 15 }]}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter budget amount"
                placeholderTextColor="#666"
                value={newBudgetAmount}
                onChangeText={setNewBudgetAmount}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleCreateBudget}
                disabled={budgetLoading}
              >
                <Text style={styles.buttonText}>
                  {budgetLoading ? "Creating..." : "Add Budget"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Existing Budgets List */}
            {budgets.length > 0 && (
              <View style={styles.budgetListSection}>
                <Text style={styles.budgetListTitle}>Current Budgets</Text>

                {budgets.map((budget) => {
                  const isEditing = editingBudgetId === budget.id;

                  return (
                    <View key={budget.id}>
                      <View style={styles.budgetListItem}>
                        <View style={styles.budgetListItemLeft}>
                          <Text style={styles.budgetListItemCategory}>
                            {budget.category_name || "Unknown"}
                          </Text>
                          {!isEditing && (
                            <Text style={styles.budgetListItemAmount}>
                              Rs {budget.allocated_amount.toLocaleString()}
                            </Text>
                          )}
                        </View>

                        {!isEditing && (
                          <View style={styles.budgetListItemActions}>
                            <TouchableOpacity
                              style={styles.budgetEditButton}
                              onPress={() =>
                                startEditingBudget(
                                  budget.id!,
                                  budget.allocated_amount
                                )
                              }
                            >
                              <Text style={styles.budgetActionButtonText}>
                                Edit
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.budgetDeleteButton}
                              onPress={() => handleDeleteBudget(budget.id!)}
                              disabled={budgetLoading}
                            >
                              <Text style={styles.budgetActionButtonText}>
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      {isEditing && (
                        <View style={styles.budgetEditForm}>
                          <Text style={styles.budgetEditFormTitle}>
                            Edit Amount
                          </Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter new amount"
                            placeholderTextColor="#666"
                            value={editingBudgetAmount}
                            onChangeText={setEditingBudgetAmount}
                            keyboardType="numeric"
                          />
                          <View style={styles.budgetEditFormButtons}>
                            <TouchableOpacity
                              style={styles.budgetSaveButton}
                              onPress={() => handleUpdateBudget(budget.id!)}
                              disabled={budgetLoading}
                            >
                              <Text style={styles.budgetActionButtonText}>
                                {budgetLoading ? "Saving..." : "Save"}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.budgetCancelEditButton}
                              onPress={cancelEditingBudget}
                            >
                              <Text style={styles.budgetActionButtonText}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default Budget;
