import { transaction } from "@/components/type";
import {
  deleteTransaction,
  getAllAccounts,
  getAllCategory,
  getAllTransaction,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EditTransactionModal from "./EditTransactionModal";

interface Props {
  visible: boolean;
  transactionId: string | null;
  onClose: () => void;
  onEdit: (transactionId: string) => void;
  onDeleted: () => void;
}

const TransactionDetailModal: React.FC<Props> = ({
  visible,
  transactionId,
  onClose,
  onEdit,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<transaction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    if (visible && transactionId) {
      loadTransaction();
    }
  }, [visible, transactionId]);

  const loadTransaction = async () => {
    if (!transactionId) return;

    try {
      setLoading(true);
      const transactions = await getAllTransaction();
      const categories = await getAllCategory();
      const accounts = await getAllAccounts();

      // Find the transaction
      const found = transactions.find((t) => t.id === transactionId);
      if (!found) {
        Alert.alert("Error", "Transaction not found");
        onClose();
        return;
      }

      // Enrich with category and account names
      const category = categories.find((c) => c.id === found.category_id);
      const account = accounts.find((a) => a.id === found.account_id);

      const enrichedTransaction: transaction = {
        ...found,
        category_name: category?.category_name || "Unknown",
        account_name: account?.account_name || "Unknown",
      };

      setTransaction(enrichedTransaction);
    } catch (error) {
      console.error("Error loading transaction:", error);
      Alert.alert("Error", "Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!transaction) return;
    setEditModalVisible(true);
  };

  const handleDelete = () => {
    if (!transaction) return;

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete this transaction? This will adjust the account balance by ${transaction.is_deduct ? "adding back" : "removing"} Rs ${transaction.amount}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    if (!transaction) return;

    try {
      setDeleting(true);
      await deleteTransaction(transaction);
      Alert.alert("Success", "Transaction deleted successfully", [
        {
          text: "OK",
          onPress: () => {
            onDeleted();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message || "Failed to delete transaction");
    } finally {
      setDeleting(false);
    }
  };

  if (!visible || !transactionId) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header with close button */}
          <View style={styles.detailHeader}>
            <Text style={styles.detailHeaderTitle}>Transaction Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 40,
              }}
            >
              <ActivityIndicator size="large" color="#fffff" />
              <Text
                style={{
                  color: "#999",
                  marginTop: 12,
                  fontFamily: "SpaceMono_400Regular",
                }}
              >
                Loading...
              </Text>
            </View>
          ) : !transaction ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 40,
              }}
            >
              <Text style={styles.errorText}>Transaction not found</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.detailContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Action Buttons */}
              <View style={styles.detailActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={handleEdit}
                  disabled={deleting}
                  activeOpacity={0.8}
                >
                  {/* <Pencil size={20} color="#000000" /> */}
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={handleDelete}
                  disabled={deleting}
                  activeOpacity={0.8}
                >
                  {/* <Trash2 size={20} color="#FFFFFF" /> */}
                  <Text style={styles.actionButtonText}>
                    {deleting ? "Deleting..." : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Transaction Details */}
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      transaction.is_deduct
                        ? styles.deductText
                        : styles.addText,
                    ]}
                  >
                    {transaction.is_deduct ? "Expense" : "Income"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      styles.amountText,
                      transaction.is_deduct
                        ? styles.deductText
                        : styles.addText,
                    ]}
                  >
                    {transaction.is_deduct ? "−" : "+"}Rs{" "}
                    {transaction.amount.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>
                    {transaction.category_name}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account</Text>
                  <Text style={styles.detailValue}>
                    {transaction.account_name}
                  </Text>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>
                    {transaction.createdAt
                      ? new Date(
                          transaction.createdAt.toDate(),
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Unknown"}
                  </Text>
                </View>
              </View>
            </ScrollView>
          )}

          {/* Edit Transaction Modal */}
          <EditTransactionModal
            visible={editModalVisible}
            transactionId={transaction?.id || null}
            onClose={() => setEditModalVisible(false)}
            onSaved={() => {
              setEditModalVisible(false);
              loadTransaction(); // Reload transaction data
              onEdit(transaction!.id); // Still call parent callback if needed
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default TransactionDetailModal;
