import { account, ledger, transaction } from "@/components/type";
import {
  getAllAccounts,
  getAllLedgers,
  getAllTransactions,
} from "@/database/operation";
import styles from "@/style/AppStyles";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TransactionItem from "../../components/home/TransactionItem";

const Transaction = () => {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [accounts, setAccounts] = useState<account[]>([]);
  const [ledgers, setLedgers] = useState<ledger[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const txData = getAllTransactions() as transaction[];
      const accData = getAllAccounts() as account[];
      const ledgerData = getAllLedgers() as ledger[];

      setTransactions(txData);
      setAccounts(accData);
      setLedgers(ledgerData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const [selectedLedger, setSelectedLedger] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");

  const parsedTransactionDetails = useMemo(() => {
    return transactions.map((tx) => {
      const ledger = ledgers.find((l) => l.ledgerId === tx.ledgerId);
      const account = accounts.find((a) => a.id === tx.accountId);

      const dateObj = new Date(tx.date);
      const formattedDate = `${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;

      return {
        transactionId: tx.transactionId,
        ledgerId: tx.ledgerId,
        ledgerName: ledger?.ledgerName || "Unknown Ledger",
        accountId: tx.accountId,
        accountName: account?.anotation || "Unknown Account",
        accountType: account?.type || "Unknown",
        amount: tx.amount,
        type: tx.type,
        date: formattedDate,
        dateObj: dateObj,
      };
    });
  }, []);

  const filteredTransactions = useMemo(() => {
    let filtered = [...parsedTransactionDetails];

    if (selectedLedger) {
      filtered = filtered.filter(
        (tx) => parseInt(tx.ledgerId) === parseInt(selectedLedger)
      );
    }

    if (selectedBank) {
      filtered = filtered.filter(
        (tx) => tx.accountId === parseInt(selectedBank)
      );
    }

    if (selectedDateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((tx) => {
        const txDate = new Date(
          tx.dateObj.getFullYear(),
          tx.dateObj.getMonth(),
          tx.dateObj.getDate()
        );

        switch (selectedDateRange) {
          case "today":
            return txDate.getTime() === today.getTime();
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return txDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return txDate >= monthAgo;
          case "year":
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return txDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [
    parsedTransactionDetails,
    selectedLedger,
    selectedBank,
    selectedDateRange,
  ]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 100,
      }}
    >
      <View style={styles.transactiontPageHeader}>
        <Text style={styles.transactionPageHeaderText}>Transactions</Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Ledger</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedLedger}
              onValueChange={(value) => setSelectedLedger(value)}
              style={styles.pickerCont}
            >
              <Picker.Item label="All Ledgers" value="" />
              {ledgers.map((ledger) => (
                <Picker.Item
                  key={ledger.ledgerId}
                  label={ledger.ledgerName}
                  value={ledger.ledgerId.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Bank</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedBank}
              onValueChange={(value) => setSelectedBank(value)}
              style={styles.pickerCont}
            >
              <Picker.Item label="All Banks" value="" />
              {accounts.map((account) => (
                <Picker.Item
                  key={account.id}
                  label={`${account.anotation} - ${account.type}`}
                  value={account.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Date Range</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedDateRange}
              onValueChange={(value) => setSelectedDateRange(value)}
              style={styles.pickerCont}
            >
              <Picker.Item label="All Time" value="" />
              <Picker.Item label="Today" value="today" />
              <Picker.Item label="Last 7 Days" value="week" />
              <Picker.Item label="Last 30 Days" value="month" />
              <Picker.Item label="Last Year" value="year" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.resultsCount}>
        <Text style={styles.resultsCountText}>
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <View style={styles.transactionCardGroup}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((acc) => (
            <TransactionItem data={acc} key={acc.transactionId} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Transaction;
