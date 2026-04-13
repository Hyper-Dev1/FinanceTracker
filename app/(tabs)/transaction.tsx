import { account, category, transaction } from "@/components/type";
import {
  getAllAccounts,
  getAllCategory,
  getAllTransaction,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import {
  buildAccountMap,
  buildCategoryMap,
  filterAndParseTransactions,
} from "@/utils/Formatter";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TransactionItem from "../../components/home/TransactionItem";
import TransactionDetailModal from "../../components/pages/TransactionDetailModal";

const Transaction = () => {
  const insets = useSafeAreaInsets();

  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [accounts, setAccounts] = useState<account[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const [recordAccounts, setRecordAccounts] = useState<Record<string, string>>(
    {},
  );
  const [recordCategories, setRecordCategories] = useState<
    Record<string, string>
  >({});

  const [selectedLedger, setSelectedLedger] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const accData = await getAllAccounts();
        const recordAccData = buildAccountMap(accData);
        const catData = await getAllCategory();
        const recordCatData = buildCategoryMap(catData);
        setAccounts(accData);
        setRecordAccounts(recordAccData);
        setRecordCategories(recordCatData);
        setCategories(catData);
        setIsDataLoaded(true);
      } catch (err) {
        // console.error("Error loading static data:", err);
      }
    };

    loadStaticData();
  }, []);

  // Fetch transactions whenever filters change
  const loadTransactions = async () => {
    try {
      const now = new Date();

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      switch (selectedDateRange) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          endDate = now;
          break;

        case "week":
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          endDate = now;
          break;

        case "month":
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          endDate = now;
          break;

        case "year":
          startDate = new Date(now);
          startDate.setFullYear(startDate.getFullYear() - 1);
          endDate = now;
          break;

        case "all":
        default:
          startDate = undefined;
          endDate = undefined;
          break;
      }

      const filter = {
        categoryId: selectedLedger,
        accountId: selectedBank,
        startDate: startDate,
        endDate: endDate,
      };

      const txData = await getAllTransaction();
      const parsedTxData = filterAndParseTransactions(
        txData,
        recordAccounts,
        recordCategories,
        filter,
      );

      setTransactions(parsedTxData);
    } catch (error) {
      // console.error("Error loading transactions:", error);
    }
  };

  useEffect(() => {
    if (!isDataLoaded) return;
    loadTransactions();
  }, [selectedLedger, selectedBank, selectedDateRange, isDataLoaded]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      <View style={styles.transactiontPageHeader}>
        <Text style={styles.transactionPageHeaderText}>Transactions</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {/* Ledger / Category */}
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Ledger</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedLedger}
              onValueChange={setSelectedLedger}
              style={styles.pickerCont}
            >
              <Picker.Item label="All Ledgers" value="" />
              {categories.map((c) => (
                <Picker.Item
                  key={c.id}
                  label={c.category_name}
                  value={c.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Bank / Account */}
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Bank</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedBank}
              onValueChange={setSelectedBank}
              style={styles.pickerCont}
            >
              <Picker.Item label="All Banks" value="" />
              {accounts.map((a) => (
                <Picker.Item
                  key={a.id}
                  label={`${a.anotation} - ${a.account_type}`}
                  value={a.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Date Range */}
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Date Range</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedDateRange}
              onValueChange={setSelectedDateRange}
              style={styles.pickerCont}
            >
              <Picker.Item label="All Time" value="" />
              <Picker.Item label="Today" value="today" />
              <Picker.Item label="Last 7 Days" value="week" />
              <Picker.Item label="Last 30 Days" value="month" />
              <Picker.Item label="Last Year" value="year" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Results count */}
      <View style={styles.resultsCount}>
        <Text style={styles.resultsCountText}>
          {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Transaction list */}
      <View style={styles.transactionCardGroup}>
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionItem
              data={tx}
              key={tx.id}
              onPress={(id) => {
                setSelectedTransactionId(id);
                setDetailVisible(true);
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found</Text>
          </View>
        )}
      </View>

      <TransactionDetailModal
        visible={detailVisible}
        transactionId={selectedTransactionId}
        onClose={() => setDetailVisible(false)}
        onEdit={(id) => {
          setDetailVisible(false);
          // TODO: Will be handled in next phase
        }}
        onDeleted={() => {
          setDetailVisible(false);
          loadTransactions();
        }}
      />
    </ScrollView>
  );
};

export default Transaction;
