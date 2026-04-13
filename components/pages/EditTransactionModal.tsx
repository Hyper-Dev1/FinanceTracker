import { transaction, category, account } from "@/components/type";
import styles from "@/style/AppStyles";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { X } from "lucide-react-native";
import {
  getAllTransaction,
  getAllCategory,
  getAllAccounts,
  updateTransaction,
} from "@/database/firebaseOperation";
import { Picker } from "@react-native-picker/picker";

interface Props {
  visible: boolean;
  transactionId: string | null;
  onClose: () => void;
  onSaved: () => void; // Called after successful save
}

const EditTransactionModal: React.FC<Props> = ({
  visible,
  transactionId,
  onClose,
  onSaved,
}) => {
  const amountRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [oldTransaction, setOldTransaction] = useState<transaction | null>(null);
  
  const [transactionType, setTransactionType] = useState<"deduct" | "add">("deduct");
  const [category, setCategory] = useState("");
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState("");
  
  const [categoryList, setCategoryList] = useState<category[]>([]);
  const [bankDetails, setBankDetails] = useState<account[]>([]);

  useEffect(() => {
    if (visible && transactionId) {
      loadTransactionData();
    } else if (!visible) {
      // Clear form state when modal closes
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, transactionId]);

  const resetForm = () => {
    setLoading(true);
    setSaving(false);
    setOldTransaction(null);
    setTransactionType("deduct");
    setCategory("");
    setBank("");
    setAmount("");
    setCategoryList([]);
    setBankDetails([]);
  };

  const loadTransactionData = async () => {
    if (!transactionId) return;

    try {
      setLoading(true);
      const [transactions, categories, accounts] = await Promise.all([
        getAllTransaction(),
        getAllCategory(),
        getAllAccounts(),
      ]);

      setCategoryList(categories);
      setBankDetails(accounts);

      const found = transactions.find((t) => t.id === transactionId);
      if (!found) {
        Alert.alert("Error", "Transaction not found");
        onClose();
        return;
      }

      setOldTransaction(found);
      setTransactionType(found.is_deduct ? "deduct" : "add");
      setCategory(found.category_id);
      setBank(found.account_id);
      setAmount(found.amount.toString());
    } catch (error) {
      console.error("Error loading transaction:", error);
      Alert.alert("Error", "Failed to load transaction data");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!category || !bank || !amount) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    Alert.alert(
      "Confirm Changes",
      "This will adjust account balances. Are you sure you want to save these changes?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: confirmSave },
      ]
    );
  };

  const confirmSave = async () => {
    if (!oldTransaction) return;

    try {
      setSaving(true);
      const amountNum = parseFloat(amount);

      await updateTransaction({
        id: oldTransaction.id,
        is_deduct: transactionType === "deduct",
        category_id: category,
        account_id: bank,
        amount: amountNum,
        oldTransaction,
      });

      Alert.alert("Success", "Transaction updated successfully", [
        {
          text: "OK",
          onPress: () => {
            onSaved();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      Alert.alert("Error", error.message || "Failed to update transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Header with close button */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Transaction</Text>
                <TouchableOpacity 
                  onPress={handleClose}
                  style={styles.modalCloseButton}
                  disabled={saving}
                >
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              ) : !oldTransaction ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text style={styles.errorText}>Transaction not found</Text>
                </View>
              ) : (
                <ScrollView style={styles.modalBody}>
                  <View style={{ paddingVertical: 20 }}>
                    <Text style={styles.label}>Type</Text>
                    <View style={styles.toggleContainer}>
                      <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          transactionType === "deduct" && styles.toggleButtonActive,
                        ]}
                        onPress={() => setTransactionType("deduct")}
                      >
                        <Text
                          style={[
                            styles.toggleButtonText,
                            transactionType === "deduct" && styles.toggleButtonTextActive,
                          ]}
                        >
                          Deduct
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          transactionType === "add" && styles.toggleButtonActive,
                        ]}
                        onPress={() => setTransactionType("add")}
                      >
                        <Text
                          style={[
                            styles.toggleButtonText,
                            transactionType === "add" && styles.toggleButtonTextActive,
                          ]}
                        >
                          Add
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Category</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                        style={styles.pickerCont}
                      >
                        <Picker.Item label="Select Ledger" value="" />
                        {categoryList.map((c) => {
                          return (
                            <Picker.Item
                              label={c.category_name}
                              value={c.id}
                              key={c.id}
                            />
                          );
                        })}
                      </Picker>
                    </View>

                    <Text style={styles.label}>Bank</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={bank}
                        onValueChange={(v) => setBank(v)}
                        style={styles.pickerCont}
                      >
                        <Picker.Item label="Select Bank" value="" />
                        {bankDetails.map((b) => {
                          return (
                            <Picker.Item
                              label={b.account_name}
                              value={b.id}
                              key={b.id}
                            />
                          );
                        })}
                      </Picker>
                    </View>

                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                      ref={amountRef}
                      style={styles.input}
                      placeholder="Enter amount"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                      returnKeyType="done"
                      placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                      style={[styles.addButton, saving && { opacity: 0.6 }]}
                      onPress={handleSave}
                      disabled={saving}
                    >
                      <Text
                        style={{
                          fontFamily: "SpaceMono_400Regular",
                          fontSize: 16,
                        }}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleClose}
                      disabled={saving}
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
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditTransactionModal;
