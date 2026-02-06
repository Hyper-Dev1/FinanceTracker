import { transaction } from "@/components/type";
import {
  getAllCategory,
  getAllTransaction,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import { ArrowLeft, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

// Grayscale colors for pie chart
const GRAYSCALE_COLORS = [
  "#ffffff",
  "#e0e0e0",
  "#c0c0c0",
  "#a0a0a0",
  "#808080",
  "#606060",
  "#404040",
  "#303030",
];

interface CategoryTotal {
  id: string;
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

const Summary = () => {
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [categories, setCategories] = useState<
    { id: string; category_name: string }[]
  >([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"income" | "spending">("income");
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txns, cats] = await Promise.all([
          getAllTransaction(),
          getAllCategory(),
        ]);
        setTransactions(txns);
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (transactions.length === 0) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for current month
    const monthlyTxns = transactions.filter((txn) => {
      if (!txn.createdAt) return false;
      const txnDate = txn.createdAt.toDate();
      return (
        txnDate.getMonth() === currentMonth &&
        txnDate.getFullYear() === currentYear
      );
    });

    // Calculate income and spending
    let income = 0;
    let spending = 0;

    monthlyTxns.forEach((txn) => {
      if (txn.is_deduct) {
        spending += txn.amount;
      } else {
        income += txn.amount;
      }
    });

    setMonthlyIncome(income);
    setMonthlySpending(spending);
  }, [transactions]);

  const openModal = (type: "income" | "spending") => {
    setModalType(type);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for current month and type
    const filteredTxns = transactions.filter((txn) => {
      if (!txn.createdAt) return false;
      const txnDate = txn.createdAt.toDate();
      const isCurrentMonth =
        txnDate.getMonth() === currentMonth &&
        txnDate.getFullYear() === currentYear;
      const isCorrectType =
        type === "spending" ? txn.is_deduct : !txn.is_deduct;
      return isCurrentMonth && isCorrectType;
    });

    // Group by category
    const categoryMap = new Map<string, number>();
    filteredTxns.forEach((txn) => {
      const current = categoryMap.get(txn.category_id) || 0;
      categoryMap.set(txn.category_id, current + txn.amount);
    });

    const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);

    // Create category totals with colors
    const totals: CategoryTotal[] = Array.from(categoryMap.entries()).map(
      ([categoryId, amount], index) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          id: categoryId,
          name: category?.category_name || "Unknown",
          amount,
          color: GRAYSCALE_COLORS[index % GRAYSCALE_COLORS.length],
          percentage: total > 0 ? (amount / total) * 100 : 0,
        };
      },
    );

    setCategoryTotals(totals);
    setModalVisible(true);
  };

  const formatAmount = (amount: number) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const pieData = categoryTotals.map((cat) => ({
    value: cat.amount,
    color: cat.color,
    text: `${cat.percentage.toFixed(0)}%`,
  }));

  return (
    <View>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryHeaderText}>Monthly Summary</Text>
      </View>
      <View style={styles.summaryCardGroup}>
        <Pressable
          style={styles.summaryCard}
          onPress={() => openModal("income")}
        >
          <Text style={styles.summaryCardLabel}>Income</Text>
          <Text style={styles.summaryCardValue}>
            {formatAmount(monthlyIncome)}
          </Text>
        </Pressable>
        <Pressable
          style={styles.summaryCard}
          onPress={() => openModal("spending")}
        >
          <Text style={styles.summaryCardLabel}>Spending</Text>
          <Text style={styles.summaryCardValue}>
            {formatAmount(monthlySpending)}
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.categoryModalOverlay}>
          <View style={styles.categoryModalContent}>
            <View style={styles.categoryModalHeader}>
              <View style={styles.categoryModalHeaderLeft}>
                <Pressable onPress={() => setModalVisible(false)}>
                  <ArrowLeft size={24} color="#fff" />
                </Pressable>
                <Text style={styles.categoryModalTitle}>
                  {modalType === "income" ? "Income" : "Spending"} by Category
                </Text>
              </View>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color="#fff" />
              </Pressable>
            </View>

            <ScrollView style={styles.categoryModalBody}>
              {categoryTotals.length > 0 ? (
                <>
                  <View style={styles.pieChartContainer}>
                    <PieChart
                      data={pieData}
                      donut
                      radius={100}
                      innerRadius={60}
                      innerCircleColor={"#000"}
                      centerLabelComponent={() => (
                        <View>
                          <Text style={styles.summaryCardLabel}>Total</Text>
                          <Text style={styles.summaryCardValue}>
                            {formatAmount(
                              modalType === "income"
                                ? monthlyIncome
                                : monthlySpending,
                            )}
                          </Text>
                        </View>
                      )}
                    />
                  </View>

                  {categoryTotals.map((cat) => (
                    <View key={cat.id} style={styles.categoryListItem}>
                      <View style={styles.categoryListLeft}>
                        <View
                          style={[
                            styles.categoryColorDot,
                            { backgroundColor: cat.color },
                          ]}
                        />
                        <Text style={styles.categoryName}>{cat.name}</Text>
                      </View>
                      <View style={styles.categoryListRight}>
                        <Text style={styles.categoryAmount}>
                          {formatAmount(cat.amount)}
                        </Text>
                        <Text style={styles.categoryPercentage}>
                          {cat.percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No {modalType} transactions this month
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Summary;
