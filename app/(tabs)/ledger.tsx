import { ledger } from "@/components/type";
import { getAllLedgers } from "@/database/operation";
import styles from "@/style/AppStyles";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const explore = () => {
  const insets = useSafeAreaInsets();

  const [ledgers, setLedgers] = useState<account[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const accData = getAllLedgers() as ledger[];

      setLedgers(accData);
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
        <Text style={styles.pageHeaderText}>Ledger</Text>
      </View>

      {ledgers.map((l) => (
        <View key={l.ledgerId}>
          <View style={styles.ledgerItem}>
            <Text style={styles.ledgerText}>{l.ledgerName}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default explore;
