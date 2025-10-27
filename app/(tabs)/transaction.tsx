import styles from "@/style/AppStyles";
import { Picker } from "@react-native-picker/picker";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TransactionItem from "../../components/home/TransactionItem";

const Transaction = () => {
  const insets = useSafeAreaInsets();

  // Filter states
  const [selectedLedger, setSelectedLedger] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");

  const accountDetails = [
    {
      id: 1,
      bankName: "Prabhu Bank",
      anotation: "PBL",
      amount: "99999.00",
      type: "Current",
    },
    {
      id: 2,
      bankName: "Nabil Bank",
      anotation: "NABIL",
      amount: "1201",
      type: "Salary",
    },
    {
      id: 3,
      bankName: "Agriculture Development Bank",
      anotation: "ADB",
      amount: "1202",
      type: "Saving",
    },
    {
      id: 4,
      bankName: "Nepal Investment Mega Bank",
      anotation: "NIMB",
      amount: "1200.00",
      type: "Investment",
    },
  ];

  const ledgerDetails = [
    {
      ledgerId: 1,
      ledgerName: "Groceries",
    },
  ];

  const transactionDetails = [
    {
      transactionId: 1,
      ledgerId: 1,
      amount: 12300,
      type: "add",
      accountId: 1,
      date: "2025-10-16 09:15:22",
    },
    {
      transactionId: 2,
      ledgerId: 1,
      amount: 2300,
      type: "deduct",
      accountId: 1,
      date: "2025-10-16 14:32:10",
    },
    {
      transactionId: 3,
      ledgerId: 1,
      amount: 45000,
      type: "add",
      accountId: 2,
      date: "2025-10-15 11:47:03",
    },
    {
      transactionId: 4,
      ledgerId: 1,
      amount: 1200,
      type: "deduct",
      accountId: 2,
      date: "2025-10-15 19:05:55",
    },
    {
      transactionId: 5,
      ledgerId: 1,
      amount: 5800,
      type: "deduct",
      accountId: 3,
      date: "2025-10-14 08:25:12",
    },
    {
      transactionId: 6,
      ledgerId: 1,
      amount: 32000,
      type: "add",
      accountId: 3,
      date: "2025-10-13 17:44:29",
    },
    {
      transactionId: 7,
      ledgerId: 1,
      amount: 7000,
      type: "deduct",
      accountId: 4,
      date: "2025-10-13 22:10:41",
    },
    {
      transactionId: 8,
      ledgerId: 1,
      amount: 15500,
      type: "add",
      accountId: 4,
      date: "2025-10-12 10:18:05",
    },
    {
      transactionId: 9,
      ledgerId: 1,
      amount: 9600,
      type: "add",
      accountId: 2,
      date: "2025-10-11 13:58:49",
    },
    {
      transactionId: 10,
      ledgerId: 1,
      amount: 4200,
      type: "deduct",
      accountId: 1,
      date: "2025-10-10 09:02:33",
    },
  ];

  const parsedTransactionDetails = useMemo(() => {
    return transactionDetails.map((tx) => {
      const ledger = ledgerDetails.find((l) => l.ledgerId === tx.ledgerId);
      const account = accountDetails.find((a) => a.id === tx.accountId);

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
        (tx) => tx.ledgerId === parseInt(selectedLedger)
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
              {ledgerDetails.map((ledger) => (
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
              {accountDetails.map((account) => (
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
