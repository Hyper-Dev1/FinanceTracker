import { subscribeToAccounts } from "@/sevices/subscription/account.sub";
import styles from "@/style/AppStyles";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const Accounts = () => {
  const [accountDetails, setAccountDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = subscribeToAccounts(
      (accounts) => {
        setAccountDetails(accounts);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching accounts:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading accounts...</Text>;
  }

  return (
    <View>
      <View style={styles.accountHeader}>
        <Text style={styles.accountHeaderText}>Accounts</Text>
        {/* Optional Add button */}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.accountCardGroup}
      >
        {accountDetails.length > 0 ? (
          accountDetails.map((acc) => (
            <View style={styles.accountCard} key={acc.id}>
              <Text style={styles.accountCardText}>{acc.anotation}</Text>
              <Text style={styles.accountCardText}>
                Rs {acc.running_balance}
              </Text>
              <Text style={styles.accountCardText}>{acc.account_type}</Text>
            </View>
          ))
        ) : (
          <Text>No accounts found</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Accounts;
