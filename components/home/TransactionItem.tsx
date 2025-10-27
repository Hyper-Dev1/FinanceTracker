import styles from "@/style/AppStyles";
import React from "react";
import { Text, View } from "react-native";

interface TransactionItems {
  transactionId: number;
  ledgerName: string;
  accountName: string;
  accountType: string;
  amount: number;
  type: string;
  date: string;
}

type Props = {
  data: TransactionItems;
};

const TransactionItem: React.FC<Props> = ({ data }) => {
  return (
    <View style={styles.transactionCard}>
      <View>
        <Text style={styles.transactionCardText}>{data.ledgerName}</Text>
        <Text style={styles.transactionCardText}>({data.accountName})</Text>
      </View>
      <View>
        <Text style={styles.transactionCardText}>
          {data.type === "deduct" ? "-" : ""}Rs {data.amount}
        </Text>
        <Text style={styles.transactionCardText}>{data.date}</Text>
      </View>
    </View>
  );
};

export default TransactionItem;
