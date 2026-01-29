import { transaction } from "@/components/type";
import {
  getAllAccounts,
  getAllCategory,
  getAllTransaction,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import { buildAccountMap, buildCategoryMap, filterAndParseTransactions } from "@/utils/Formatter";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import TransactionItem from "../../components/home/TransactionItem";

const Transaction = () => {
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [recordAccounts, setRecordAccounts] = useState<Record<string, string>>(
    {}
  );
  const [recordCategories, setRecordCategories] = useState<
    Record<string, string>
  >({});

  const [loading, setLoading] = useState(true);

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
        console.error("Error loading static data:", err);
      }
    };

    loadStaticData();
  }, []);

  // Fetch transactions whenever filters change
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const filter = {};

        const txData = await getAllTransaction();
        const parsedTxData = filterAndParseTransactions(
          txData,
          recordAccounts,
          recordCategories,
          filter
        );

        setTransactions(parsedTxData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading transactions:", error);
      }
    };

    loadTransactions();
  }, [recordAccounts, recordCategories, transactions]);

  if (loading) {
    return <Text>Loading transactions...</Text>;
  }

  return (
    <View>
      <View style={styles.transactiontHeader}>
        <Text style={styles.transactionHeaderText}>Transactions</Text>
      </View>

      <View style={styles.transactionCardGroup}>
        {transactions.length > 0 ? (
          transactions.map((tx) => <TransactionItem data={tx} key={tx.id} />)
        ) : (
          <Text>No transactions found</Text>
        )}
      </View>
    </View>
  );
};

export default Transaction;
