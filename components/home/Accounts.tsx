import styles from "@/style/AppStyles";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const Accounts = () => {
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
    <View>
      <View style={styles.accountHeader}>
        <Text style={styles.accountHeaderText}>Accounts</Text>
        {/* <Pressable
          style={styles.addAccountButton}
          onPress={() => console.log("Accounts pressed")}
        >
          <Text style={styles.accountHeaderText}>Add Accounts/&gt;</Text>
        </Pressable> */}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.accountCardGroup}
      >
        {accountDetails.map((acc) => (
          <View style={styles.accountCard} key={acc.id}>
            <Text style={styles.accountCardText}>{acc.anotation}</Text>
            <Text style={styles.accountCardText}>Rs {acc.amount}</Text>
            <Text style={styles.accountCardText}>[-6%]</Text>
            <Text style={styles.accountCardText}>{acc.type}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Accounts;
