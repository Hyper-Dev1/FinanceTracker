import ForecastCard from "@/components/common/ForecastCard";
import HorizontalLine from "@/components/common/HorizontalLine";
import Accounts from "@/components/home/Accounts";
import Summary from "@/components/home/Summary";
import { TotalFund } from "@/components/home/TotalFund";
import Transaction from "@/components/home/Transaction";
import { User } from "@/components/type";
import {
  createTransaction,
  getAllAccounts,
  getAllCategory,
  getAllTransaction,
  getCurrentUser,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import {
  calculateBalanceForecast,
  ForecastResult,
} from "@/utils/BalanceForecast";
import { DateNow } from "@/utils/Formatter";
import { Picker } from "@react-native-picker/picker";
import { Plus, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Index = () => {
  // const [isDbReady, setDbReady] = useState(false);
  const [bankDetails, setBankDetails] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [transactionType, setTransactionType] = useState<"deduct" | "add">(
    "deduct",
  );
  const [user, setUser] = useState<User>();
  const [forecast, setForecast] = useState<ForecastResult | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const banks = await getAllAccounts();
        const category = await getAllCategory();
        const allTransactions = await getAllTransaction();

        setBankDetails(banks);
        setCategoryList(category);

        // Calculate forecast
        const totalBalance = banks.reduce(
          (sum, b) => sum + (b.running_balance || 0),
          0,
        );
        const prediction = calculateBalanceForecast(
          allTransactions,
          totalBalance,
        );
        setForecast(prediction);
      } catch (error) {
        console.error("Database initialization failed:", error);
      }
    };

    setupDatabase();
  }, []);

  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState("");
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState("");
  const amountRef = useRef<TextInput>(null);

  const [isModalVisible, setModalVisible] = useState(false);

  const handleAdd = () => {
    if (!category || !bank || !amount) {
      console.log("All fields are required.");
      return;
    }

    try {
      const is_deduct = transactionType === "deduct" ? true : false;

      createTransaction({
        category_id: category,
        amount: Number(amount),
        is_deduct: is_deduct,
        account_id: bank,
      });

      setAmount("");
      setCategory("");
      setBank("");
      setModalVisible(false);

      console.log("Transaction added successfully");
    } catch (error) {
      console.error("Error inserting transaction:", error);
    }
  };

  if (user) {
    return (
      <View style={{ flex: 1, position: "relative" }}>
        <ScrollView
          style={styles.container}
          // contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100,
          }}
        >
          <View style={styles.containerHeader}>
            <Text style={styles.text}>
              <DateNow />
            </Text>
            <View>
              <Text style={[styles.subtext, { textAlign: "right" }]}>
                Welcome Back,
              </Text>
              <Text
                style={[
                  styles.text,
                  { textAlign: "right", textTransform: "capitalize" },
                ]}
              >
                {user.name}!{"\n"}
              </Text>
            </View>
          </View>
          <HorizontalLine />
          <TotalFund />

          {forecast && (
            <View style={{ marginTop: 20 }}>
              <ForecastCard forecast={forecast} />
            </View>
          )}

          <HorizontalLine />
          <Summary />
          <HorizontalLine />
          <Accounts />
          <HorizontalLine />
          <Transaction />
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.floatButton,
            {
              position: "absolute",
              bottom: insets.bottom + 65,
              right: 20,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Plus color="#000" size={26} />
        </TouchableOpacity>

        <Modal
          transparent
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Transaction</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <X size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 20 }}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                  style={styles.modalContainer}
                >
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.toggleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        transactionType === "deduct" &&
                          styles.toggleButtonActive,
                      ]}
                      onPress={() => setTransactionType("deduct")}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          transactionType === "deduct" &&
                            styles.toggleButtonTextActive,
                        ]}
                      >
                        Deduct
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        transactionType === "add" && styles.toggleButtonActive,
                      ]}
                      onPress={() => setTransactionType("add")}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          transactionType === "add" &&
                            styles.toggleButtonTextActive,
                        ]}
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={category}
                      onValueChange={(itemValue) => setCategory(itemValue)}
                      style={styles.pickerCont}
                    >
                      <Picker.Item label="Select Ledger" value="" />

                      {categoryList.map((c) => {
                        return (
                          <Picker.Item
                            label={c.category_name}
                            value={c.id}
                            key={c.id}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  <Text style={styles.label}>Bank</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={bank}
                      onValueChange={(v) => setBank(v)}
                      style={styles.pickerCont}
                    >
                      <Picker.Item label="Select Bank" value="" />
                      {bankDetails.map((b) => {
                        return (
                          <Picker.Item
                            label={b.account_name}
                            value={b.id}
                            key={b.id}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  <Text style={styles.label}>Amount</Text>
                  <TextInput
                    ref={amountRef}
                    style={styles.input}
                    placeholder="Enter amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholderTextColor="#999"
                  />

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAdd}
                  >
                    <Text
                      style={{
                        fontFamily: "SpaceMono_400Regular",
                        fontSize: 16,
                      }}
                    >
                      Add
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text
                      style={{
                        fontFamily: "SpaceMono_400Regular",
                        fontSize: 16,
                        color: "#999",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (
      <View>
        <Text>fasdjf;l</Text>
      </View>
    );
  }
};
export default Index;
