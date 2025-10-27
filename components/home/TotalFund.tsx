import React from "react";
import { Text, View } from "react-native";
import styles from "@/style/AppStyles";
import { formatCurrency } from "@/utils/Formatter";

export const TotalFund = () => {
  const amount = formatCurrency(12000);
  return (
    <View style={styles.homeHeader}>
      <Text style={styles.homeHeaderAmount}>Rs {amount}</Text>
    </View>
  );
};
