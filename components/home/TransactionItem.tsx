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
      <View style={styles.transactionCardLeft}>
        <Text style={styles.transactionCardCategory}>
          {data.category_name || "Uncategorized"}
        </Text>
        <Text style={styles.transactionCardAccount}>
          {data.account_name || "Unknown Account"}
        </Text>
      </View>
      <View style={styles.transactionCardRight}>
        <Text
          style={[
            styles.transactionCardAmount,
            data.is_deduct && styles.transactionCardAmountDeduct,
          ]}
        >
          {data.is_deduct ? "-" : "+"}Rs {data.amount}
        </Text>
        <Text style={styles.transactionCardDate}>
          {formatDate(data.createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default TransactionItem;
