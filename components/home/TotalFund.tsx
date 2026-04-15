import PFHSCard from "@/components/common/PFHSCard";
import {
  getAllCategory,
  getAllTransaction,
  getBudgetsForMonth,
} from "@/database/firebaseOperation";
import { subscribeToAccounts } from "@/sevices/subscription/account.sub";
import styles from "@/style/AppStyles";
import { filterTransactionsByMonth, getCurrentMonth } from "@/utils/BudgetCalculations";
import { formatCurrency } from "@/utils/Formatter";
import { calculatePFHS, PFHSCategoryInput, PFHSResult } from "@/utils/PFHS";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export const TotalFund = () => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [pfhs, setPfhs] = useState<PFHSResult | null>(null);
  const [pfhsLoading, setPfhsLoading] = useState(true);

  const computePFHS = async () => {
    try {
      const currentMonth = getCurrentMonth();
      const [allTransactions, categories, monthBudgets] = await Promise.all([
        getAllTransaction(),
        getAllCategory(),
        getBudgetsForMonth(currentMonth),
      ]);

      const monthTransactions = filterTransactionsByMonth(
        allTransactions,
        currentMonth,
      );

      const income = monthTransactions
        .filter((t) => t.is_deduct === false)
        .reduce((sum, t) => sum + t.amount, 0);

      const expenseTransactions = monthTransactions.filter((t) => t.is_deduct === true);

      const actualByCategory = new Map<string, number>();
      expenseTransactions.forEach((txn) => {
        actualByCategory.set(
          txn.category_id,
          (actualByCategory.get(txn.category_id) || 0) + txn.amount,
        );
      });

      const expenseCategories = categories.filter((c) => c.is_deduct === true);
      const expenseCategoryMap = new Map(expenseCategories.map((c) => [c.id, c]));

      const budgetByCategory = new Map(
        monthBudgets.map((b) => [b.category_id, b.allocated_amount]),
      );

      const allCategoryIds = new Set<string>([
        ...expenseCategories.map((c) => c.id),
        ...budgetByCategory.keys(),
        ...actualByCategory.keys(),
      ]);

      if (allCategoryIds.size === 0) {
        setPfhs(null);
        return;
      }

      const pfhsCategories: PFHSCategoryInput[] = Array.from(allCategoryIds).map(
        (categoryId) => {
          const categoryData = expenseCategoryMap.get(categoryId);
          const budget = budgetByCategory.get(categoryId) || 0;
          const actual = actualByCategory.get(categoryId) || 0;

          return {
            name: categoryData?.category_name || "Unknown",
            budget,
            actual,
          };
        },
      );

      const score = calculatePFHS({
        income,
        categories: pfhsCategories,
      });
      setPfhs(score);
    } catch (error) {
      console.error("Error calculating PFHS:", error);
      setPfhs(null);
    } finally {
      setPfhsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAccounts(
      (accounts) => {
        const total = accounts.reduce(
          (acc, account) => acc + (account.running_balance || 0),
          0,
        );
        setAmount(total);
        setLoading(false);
        void computePFHS();
      },
      (error) => {
        console.error("Error fetching accounts:", error);
        setLoading(false);
        setPfhsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <View style={styles.homeHeader}>
        <Text style={styles.homeHeaderLabel}>Total Balance</Text>
        <Text style={styles.homeHeaderAmount}>
          Rs {loading ? "0" : formatCurrency(amount)}
        </Text>
      </View>
      <PFHSCard result={pfhs} loading={pfhsLoading} />
    </View>
  );
};
