import { transaction } from "@/components/type";
import styles from "@/style/AppStyles";
import { formatDate } from "@/utils/Formatter";
import React from "react";
import { Text, View } from "react-native";


type Props = {
  data: transaction;
};

const TransactionItem: React.FC<Props> = ({ data }) => {
  return (
    <View style={styles.transactionCard}>
      <View>
        <Text style={styles.transactionCardText}>
          {data.category_name || "null"}
        </Text>
        <Text style={styles.transactionCardText}>
          ({data.account_name || "null"})
        </Text>
      </View>
      <View>
        <Text style={styles.transactionCardText}>
          {data.is_deduct ? "-" : ""}Rs {data.amount}
        </Text>
        <Text style={styles.transactionCardText}>{formatDate(data.createdAt)}</Text>
      </View>
    </View>
  );
};

export default TransactionItem;
