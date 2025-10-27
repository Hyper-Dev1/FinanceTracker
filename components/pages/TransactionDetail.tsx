import React from "react";
import { Text, View } from "react-native";

const TransactionPage = ({ transactionId }: { transactionId: string }) => {
  return (
    <View>
      <Text>{transactionId}</Text>
    </View>
  );
};

export default TransactionPage;
