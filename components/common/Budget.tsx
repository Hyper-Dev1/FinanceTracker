import { subscribeToAccounts } from "@/sevices/subscription/account.sub";
import styles from "@/style/AppStyles";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

type CategoryDetail = {
  category: string;
  spent: number;
  budget: number;
};

const Budgets = () => {
  const [accountDetails, setAccountDetails] = useState<any[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetail[]>([
    {
      category: "Food",
      spent: 12000,
      budget: 13,
    },
    {
      category: "Rent",
      spent: 25000,
      budget: 25000,
    },
    {
      category: "Entertainment",
      spent: 4000,
      budget: 8000,
    },
  ]);

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
    return <Text>Loading Spending Summary...</Text>;
  }

  return (
    <View>
      <View style={styles.accountHeader}>
        <Text style={styles.accountHeaderText}>Spending Summary</Text>
        {/* Optional Add button */}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.accountCardGroup}
      >
        {categoryDetails.length > 0 ? (
          categoryDetails.map((b, index) => (
            <View style={styles.budgetCard} key={index}>
              <Text style={styles.budgetCardText}>{b.category}</Text>
              <Text style={styles.budgetCardText}>Rs {b.budget}</Text>
            </View>
          ))
        ) : (
          <Text>No accounts found</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Budgets;
