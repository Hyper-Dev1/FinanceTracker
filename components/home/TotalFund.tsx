import { subscribeToAccounts } from "@/sevices/subscription/account.sub";
import styles from "@/style/AppStyles";
import { formatCurrency } from "@/utils/Formatter";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export const TotalFund = () => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAccounts(
      (accounts) => {
        const total = accounts.reduce(
          (acc, account) => acc + (account.running_balance || 0),
          0,
        );
        setAmount(total);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching accounts:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.homeHeader}>
      <Text style={styles.homeHeaderLabel}>Total Balance</Text>
      <Text style={styles.homeHeaderAmount}>
        Rs {loading ? "0" : formatCurrency(amount)}
      </Text>
    </View>
  );
};
