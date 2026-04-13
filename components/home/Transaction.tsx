import { transaction } from "@/components/type";
import {
  getAllAccounts,
  getAllCategory,
  getAllTransaction,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import {
  buildAccountMap,
  buildCategoryMap,
  filterAndParseTransactions,
} from "@/utils/Formatter";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import TransactionItem from "../../components/home/TransactionItem";
import TransactionDetailModal from "../pages/TransactionDetailModal";

const Transaction = () => {
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [recordAccounts, setRecordAccounts] = useState<Record<string, string>>(
    {},
  );
  const [recordCategories, setRecordCategories] = useState<
    Record<string, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const accData = await getAllAccounts();
        const recordAccData = buildAccountMap(accData);
        const catData = await getAllCategory();
        const recordCatData = buildCategoryMap(catData);
        setRecordAccounts(recordAccData);
        setRecordCategories(recordCatData);
      } catch (err) {
        // console.error("Error loading static data:", err);
      }
    };

    loadStaticData();
  }, []);

  const loadTransactions = async () => {
    try {
      const filter = {};

      const txData = await getAllTransaction();
      const parsedTxData = filterAndParseTransactions(
        txData,
        recordAccounts,
        recordCategories,
        filter,
      );

      setTransactions(parsedTxData);
      setLoading(false);
    } catch (error) {
      // console.error("Error loading transactions:", error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [recordAccounts, recordCategories]);

  if (loading) {
    return (
      <View>
        <Text style={styles.transactionEmptyText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.transactiontHeader}>
        <Text style={styles.transactionHeaderText}>Recent Transactions</Text>
      </View>

      <View style={styles.transactionCardGroup}>
        {transactions.length > 0 ? (
          transactions
            .slice(0, 5)
            .map((tx) => (
              <TransactionItem
                data={tx}
                key={tx.id}
                onPress={(id) => {
                  setSelectedTransactionId(id);
                  setDetailVisible(true);
                }}
              />
            ))
        ) : (
          <Text style={styles.transactionEmptyText}>No transactions yet</Text>
        )}
      </View>

      <TransactionDetailModal
        visible={detailVisible}
        transactionId={selectedTransactionId}
        onClose={() => setDetailVisible(false)}
        onEdit={(id) => {
          setDetailVisible(false);
          // TODO: Will be handled in next phase
        }}
        onDeleted={() => {
          setDetailVisible(false);
          loadTransactions();
        }}
      />
    </View>
  );
};

export default Transaction;
