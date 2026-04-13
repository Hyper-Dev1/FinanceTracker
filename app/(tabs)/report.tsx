import ForecastCard from "@/components/common/ForecastCard";
import HorizontalLine from "@/components/common/HorizontalLine";
import Budget from "@/components/pages/Budget";
import { budget, category, transaction } from "@/components/type";
import {
  getAllCategory,
  getAllTransaction,
  getBudgetsForMonth,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import {
  calculateBalanceForecast,
  ForecastResult,
} from "@/utils/BalanceForecast";
import {
  calculateBudgetStatus,
  filterTransactionsByMonth,
  formatMonthDisplay,
  getBudgetStatusColor,
  getCurrentMonth,
} from "@/utils/BudgetCalculations";
import {
  AlertCircle,
  ArrowLeft,
  Settings,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Grayscale colors for charts
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

type FilterType = "today" | "week" | "month" | "custom";

interface CategoryTotal {
  id: string;
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

const Report = () => {
  const insets = useSafeAreaInsets();

  // Data state
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const [budgets, setBudgets] = useState<budget[]>([]);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"income" | "spending">("income");
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);

  // Forecast State
  const [forecast, setForecast] = useState<ForecastResult | null>(null);

  // Budget Modal state
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txns, cats] = await Promise.all([
          getAllTransaction(),
          getAllCategory(),
        ]);
        setTransactions(txns);
        setCategories(cats);

        // Fetch budgets for current month
        await loadBudgets();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const loadBudgets = async () => {
    try {
      const currentMonth = getCurrentMonth();
      const monthBudgets = await getBudgetsForMonth(currentMonth);

      // Enrich budgets with category names
      const enrichedBudgets = monthBudgets.map((b) => ({
        ...b,
        category_name:
          categories.find((c) => c.id === b.category_id)?.category_name ||
          "Unknown",
      }));

      setBudgets(enrichedBudgets);
    } catch (error) {
      console.error("Error loading budgets:", error);
    }
  };

  // Get date range based on filter type
  const getDateRange = (): { start: Date; end: Date } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filterType) {
      case "today":
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
        };
      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return {
          start: weekStart,
          end: now,
        };
      case "month":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now,
        };
      case "custom":
        return {
          start: fromDate
            ? new Date(fromDate)
            : new Date(now.getFullYear(), now.getMonth(), 1),
          end: toDate ? new Date(toDate) : now,
        };
      default:
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now,
        };
    }
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    const { start, end } = getDateRange();
    return transactions.filter((txn) => {
      if (!txn.createdAt) return false;
      const txnDate = txn.createdAt.toDate();
      return txnDate >= start && txnDate <= end;
    });
  }, [transactions, filterType, fromDate, toDate]);

  // Calculate totals
  const { totalIncome, totalSpending, incomeLedger, spendingLedger } =
    useMemo(() => {
      let income = 0;
      let spending = 0;
      const incomeByCategory = new Map<string, number>();
      const spendingByCategory = new Map<string, number>();

      filteredTransactions.forEach((txn) => {
        if (txn.is_deduct) {
          spending += txn.amount;
          const current = spendingByCategory.get(txn.category_id) || 0;
          spendingByCategory.set(txn.category_id, current + txn.amount);
        } else {
          income += txn.amount;
          const current = incomeByCategory.get(txn.category_id) || 0;
          incomeByCategory.set(txn.category_id, current + txn.amount);
        }
      });

      const mapToLedger = (map: Map<string, number>) =>
        Array.from(map.entries()).map(([categoryId, amount]) => {
          const category = categories.find((c) => c.id === categoryId);
          return {
            id: categoryId,
            name: category?.category_name || "Unknown",
            amount,
          };
        });

      return {
        totalIncome: income,
        totalSpending: spending,
        incomeLedger: mapToLedger(incomeByCategory),
        spendingLedger: mapToLedger(spendingByCategory),
      };
    }, [filteredTransactions, categories]);

  // Calculate Forecast
  useEffect(() => {
    if (transactions.length > 0) {
      const currentBalance = totalIncome - totalSpending;
      // We use all transactions for better forecasting, not just filtered ones
      const prediction = calculateBalanceForecast(transactions, currentBalance);
      setForecast(prediction);
    }
  }, [transactions, totalIncome, totalSpending]);

  // Reload budgets when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      loadBudgets();
    }
  }, [categories]);

  // Calculate budget statuses for current month
  const budgetStatuses = useMemo(() => {
    const currentMonth = getCurrentMonth();
    const monthTransactions = filterTransactionsByMonth(
      transactions,
      currentMonth,
    );

    return budgets.map((budget) =>
      calculateBudgetStatus(budget, monthTransactions),
    );
  }, [budgets, transactions]);

  // Bar chart data
  const barData = [
    { value: totalIncome, label: "Income", frontColor: "#e0e0e0" },
    { value: totalSpending, label: "Spending", frontColor: "#666" },
  ];

  console.log("Total Income:", totalIncome);
  console.log("Total Spending:", totalSpending);
  console.log("Filtered Transactions:", filteredTransactions.length);
  console.log("Bar Data:", barData);

  const openModal = (type: "income" | "spending") => {
    setModalType(type);

    const ledger = type === "income" ? incomeLedger : spendingLedger;
    const total = type === "income" ? totalIncome : totalSpending;

    const totals: CategoryTotal[] = ledger.map((item, index) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      color: GRAYSCALE_COLORS[index % GRAYSCALE_COLORS.length],
      percentage: total > 0 ? (item.amount / total) * 100 : 0,
    }));

    setCategoryTotals(totals);
    setModalVisible(true);
  };

  const formatAmount = (amount: number) => `Rs ${amount.toLocaleString()}`;

  const pieData = categoryTotals.map((cat) => ({
    value: cat.amount,
    color: cat.color,
    text: `${cat.percentage.toFixed(0)}%`,
  }));

  const renderQuickFilter = (type: FilterType, label: string) => (
    <Pressable
      style={[
        styles.quickFilterButton,
        filterType === type && styles.quickFilterButtonActive,
      ]}
      onPress={() => setFilterType(type)}
    >
      <Text
        style={[
          styles.quickFilterText,
          filterType === type && styles.quickFilterTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  const renderLedgerCard = (
    item: { id: string; name: string; amount: number },
    type: "income" | "spending",
  ) => (
    <View key={item.id} style={styles.ledgerCard}>
      <View style={styles.ledgerCardLeft}>
        <View style={styles.ledgerCardIcon}>
          {type === "income" ? (
            <TrendingUp size={18} color="#e0e0e0" />
          ) : (
            <TrendingDown size={18} color="#888" />
          )}
        </View>
        <View>
          <Text style={styles.ledgerCardTitle}>{item.name}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.ledgerCardAmount,
          type === "income"
            ? styles.ledgerCardAmountIncome
            : styles.ledgerCardAmountSpending,
        ]}
      >
        {type === "spending" ? "-" : "+"}
        {formatAmount(item.amount)}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      <View style={styles.reportPageHeader}>
        <Text style={styles.reportPageHeaderText}>Reports</Text>
        <Pressable
          style={styles.settingsIconButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Settings size={22} color="#fff" />
        </Pressable>
      </View>

      {showFilters && (
        <View style={styles.dateFilterContainer}>
          <View style={styles.quickFilterContainer}>
            {renderQuickFilter("today", "Today")}
            {renderQuickFilter("week", "This Week")}
            {renderQuickFilter("month", "This Month")}
          </View>

          {filterType === "custom" || (
            <Pressable
              style={[styles.quickFilterButton, { marginTop: 10 }]}
              onPress={() => setFilterType("custom")}
            >
              <Text style={styles.quickFilterText}>Custom Range</Text>
            </Pressable>
          )}

          {filterType === "custom" && (
            <View style={{ marginTop: 15 }}>
              <View style={styles.dateFilterRow}>
                <Text style={styles.dateFilterLabel}>From</Text>
                <TextInput
                  style={styles.dateFilterInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#666"
                  value={fromDate}
                  onChangeText={setFromDate}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={[styles.dateFilterRow, { marginTop: 10 }]}>
                <Text style={styles.dateFilterLabel}>To</Text>
                <TextInput
                  style={styles.dateFilterInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#666"
                  value={toDate}
                  onChangeText={setToDate}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              {/* Optional: Show parsed dates for confirmation */}
              {(fromDate || toDate) && (
                <Text style={{ color: "#999", fontSize: 12, marginTop: 10 }}>
                  {fromDate &&
                    `From: ${new Date(fromDate).toLocaleDateString()}`}
                  {fromDate && toDate && " | "}
                  {toDate && `To: ${new Date(toDate).toLocaleDateString()}`}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      <HorizontalLine />

      {/* Budget Overview Section */}
      <View style={styles.budgetOverviewSection}>
        <View style={styles.budgetOverviewHeader}>
          <Text style={styles.budgetOverviewTitle}>
            Budget Overview - {formatMonthDisplay(getCurrentMonth())}
          </Text>
          <TouchableOpacity
            style={styles.manageBudgetButton}
            onPress={() => setBudgetModalVisible(true)}
          >
            <Text style={styles.manageBudgetButtonText}>
              <Settings size={20} stroke={"#ffffff"} />
            </Text>
          </TouchableOpacity>
        </View>

        {budgetStatuses.length > 0 ? (
          budgetStatuses.map((budgetStatus) => {
            const { budget, spentAmount, percentageUsed, status } =
              budgetStatus;
            const statusColor = getBudgetStatusColor(status);
            const progressWidth = Math.min(percentageUsed, 100);

            return (
              <View key={budget.id} style={styles.budgetItemCard}>
                <View style={styles.budgetItemHeader}>
                  <Text style={styles.budgetCategoryName}>
                    {budget.category_name || "Unknown"}
                  </Text>
                  <Text style={styles.budgetAmountText}>
                    Rs {spentAmount.toLocaleString()} / Rs{" "}
                    {budget.allocated_amount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.budgetProgressBarContainer}>
                  <View
                    style={[
                      styles.budgetProgressBar,
                      {
                        width: `${progressWidth}%`,
                        backgroundColor: statusColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.budgetPercentageText}>
                  {percentageUsed.toFixed(1)}% used
                </Text>
              </View>
            );
          })
        ) : (
          <View style={styles.budgetEmptyState}>
            <AlertCircle size={24} color="#666" />
            <Text style={styles.budgetEmptyStateText}>
              No budgets set for this month.{"\n"}Tap &ldquo;Manage&rdquo; to
              create budgets.
            </Text>
          </View>
        )}
      </View>

      <HorizontalLine />

      {/* AI Forecast Section */}
      {forecast && (
        <View style={styles.reportSection}>
          <ForecastCard forecast={forecast} />
        </View>
      )}

      {/* Bar Chart Section */}
      <View style={styles.reportSection}>
        <Text style={styles.reportSectionTitle}>Income vs Spending</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={barData}
            width={250}
            height={180}
            barWidth={50}
            spacing={40}
            noOfSections={4}
            maxValue={Math.max(totalIncome, totalSpending) * 1.1}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor="#444"
            yAxisTextStyle={{ color: "#999", fontSize: 10 }}
            xAxisLabelTextStyle={{ color: "#999", fontSize: 12 }}
            hideRules
            showValuesAsTopLabel
            topLabelTextStyle={{ color: "#999", fontSize: 10 }}
          />
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#e0e0e0" }]}
              />
              <Text style={styles.legendText}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#666" }]} />
              <Text style={styles.legendText}>Spending</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Total Summary */}
      <View style={styles.totalSummaryContainer}>
        <Pressable
          style={styles.totalSummaryItem}
          onPress={() => openModal("income")}
        >
          <Text style={styles.totalSummaryLabel}>Total Income</Text>
          <Text
            style={[styles.totalSummaryValue, styles.totalSummaryValueIncome]}
          >
            {formatAmount(totalIncome)}
          </Text>
        </Pressable>
        <Pressable
          style={styles.totalSummaryItem}
          onPress={() => openModal("spending")}
        >
          <Text style={styles.totalSummaryLabel}>Total Spending</Text>
          <Text
            style={[styles.totalSummaryValue, styles.totalSummaryValueSpending]}
          >
            {formatAmount(totalSpending)}
          </Text>
        </Pressable>
        <View style={styles.totalSummaryItem}>
          <Text style={styles.totalSummaryLabel}>Net Balance</Text>
          <Text style={styles.totalSummaryValue}>
            {formatAmount(totalIncome - totalSpending)}
          </Text>
        </View>
      </View>

      {/* Income Ledger */}
      <View style={styles.reportSection}>
        <Text style={styles.reportSectionTitle}>Income Transactions</Text>
        <View style={styles.ledgerSection}>
          {incomeLedger.length > 0 ? (
            incomeLedger.map((item) => renderLedgerCard(item, "income"))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No income transactions</Text>
            </View>
          )}
        </View>
      </View>

      {/* Spending Ledger */}
      <View style={styles.reportSection}>
        <Text style={styles.reportSectionTitle}>Spending Transactions</Text>
        <View style={styles.ledgerSection}>
          {spendingLedger.length > 0 ? (
            spendingLedger.map((item) => renderLedgerCard(item, "spending"))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No spending transactions
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Category Detail Modal */}
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
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#000",
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                          }}
                        >
                          <Text style={styles.summaryCardText}>Total</Text>
                          <Text style={styles.summaryCardText}>
                            {formatAmount(
                              modalType === "income"
                                ? totalIncome
                                : totalSpending,
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
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
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
                    No {modalType} transactions in this period
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Budget Management Modal */}
      <Budget
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
      />
    </ScrollView>
  );
};

export default Report;
