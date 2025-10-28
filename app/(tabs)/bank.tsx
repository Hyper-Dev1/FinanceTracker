import { account } from "@/components/type";
import { getAllAccounts } from "@/database/operation";
import styles from "@/style/AppStyles";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const explore = () => {
  const insets = useSafeAreaInsets();

  const [accounts, setAccounts] = useState<account[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const accData = getAllAccounts() as account[];

      setAccounts(accData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 100,
      }}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderText}>Bank</Text>
        <Pressable></Pressable>
      </View>

      {accounts.map((a) => (
        <View key={a.id}>
          <View style={styles.ledgerItem}>
            <Text style={styles.ledgerText}>
              {a.bankName}({a.anotation})
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default explore;
