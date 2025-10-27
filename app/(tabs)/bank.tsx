import styles from "@/style/AppStyles";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const explore = () => {
  const insets = useSafeAreaInsets();

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
        <Pressable>
          
        </Pressable>
      </View>

      {accountDetails.map((a) => (
        <View key={a.id}>
          <View style={styles.ledgerItem}>
            <Text style={styles.ledgerText}>{a.bankName}({a.anotation})</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default explore;
