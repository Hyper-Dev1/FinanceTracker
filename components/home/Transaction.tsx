import styles from "@/style/AppStyles";
import React from "react";
import { Text, View } from "react-native";
import TransactionItem from "./TransactionItem";

const Transaction = () => {
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

  const parsedTransactionDetails = transactionDetails.map((tx) => {
    const ledger = ledgerDetails.find((l) => l.ledgerId === tx.ledgerId);
    const account = accountDetails.find((a) => a.id === tx.accountId);

    const dateObj = new Date(tx.date);
    const formattedDate = `${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;

    return {
      transactionId: tx.transactionId,
      ledgerName: ledger?.ledgerName || "Unknown Ledger",
      accountName: account?.anotation || "Unknown Account",
      accountType: account?.type || "Unknown",
      amount: tx.amount,
      type: tx.type,
      date: formattedDate,
    };
  });

  return (
    <View>
      <View style={styles.transactiontHeader}>
        <Text style={styles.transactionHeaderText}> Transactions</Text>
      </View>
      <View style={styles.transactionCardGroup}>
        {parsedTransactionDetails.map((acc) => (
          <TransactionItem data={acc} key={acc.transactionId} />
        ))}
      </View>
    </View>
  );
};

export default Transaction;
