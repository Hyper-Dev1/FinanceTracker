import styles from "@/style/AppStyles";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const explore = () => {
  const insets = useSafeAreaInsets();

  const ledgerDetails = [
    {
      ledgerId: 1,
      ledgerName: "Groceries",
    },
  ];

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

      {ledgerDetails.map((l) => (
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
