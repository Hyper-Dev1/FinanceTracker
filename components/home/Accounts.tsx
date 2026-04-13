import HorizontalLine from "@/components/common/HorizontalLine";
import { createAccounts, transferBetweenAccounts } from "@/database/firebaseOperation";
import { subscribeToAccounts } from "@/sevices/subscription/account.sub";
import styles from "@/style/AppStyles";
import { Plus, X, ArrowLeftRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const Accounts = () => {
  const [accountDetails, setAccountDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  // Form state
  const [accountName, setAccountName] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [accountType, setAccountType] = useState("");

  // Transfer form state
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferError, setTransferError] = useState("");

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

  const handleAdd = () => {
    try {
      createAccounts({
        account_name: accountName,
        anotation: annotation,
        opening_balance: openingBalance,
        account_type: accountType,
      });
      setModalVisible(false);
      setAccountName("");
      setAnnotation("");
      setAccountType("");
      setOpeningBalance(0);
    } catch {
      console.log("Error adding accounts");
    }
  };

  const handleTransfer = async () => {
    setTransferError("");

    // Validation
    const amount = parseFloat(transferAmount);
    
    if (!sourceAccountId || !destinationAccountId) {
      setTransferError("Please select both source and destination accounts");
      return;
    }

    if (sourceAccountId === destinationAccountId) {
      setTransferError("Source and destination accounts must be different");
      return;
    }

    if (!transferAmount || isNaN(amount) || amount <= 0) {
      setTransferError("Amount must be greater than 0");
      return;
    }

    // Check source account balance
    const sourceAccount = accountDetails.find(acc => acc.id === sourceAccountId);
    if (sourceAccount && amount > sourceAccount.running_balance) {
      setTransferError(`Insufficient balance. Available: Rs ${formatBalance(sourceAccount.running_balance)}`);
      return;
    }

    try {
      await transferBetweenAccounts({
        sourceAccountId,
        destinationAccountId,
        amount,
      });
      
      Alert.alert("Success", "Transfer completed successfully");
      setTransferModalVisible(false);
      resetTransferForm();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to transfer");
    }
  };

  const resetTransferForm = () => {
    setSourceAccountId("");
    setDestinationAccountId("");
    setTransferAmount("");
    setTransferError("");
  };

  const formatBalance = (balance: number) => {
    return balance?.toLocaleString() || "0";
  };

  const getSourceAccountBalance = () => {
    if (!sourceAccountId) return null;
    const account = accountDetails.find(acc => acc.id === sourceAccountId);
    return account ? account.running_balance : null;
  };

  if (loading) {
    return (
      <View>
        <Text style={styles.accountEmptyText}>Loading accounts...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.accountHeader}>
        <Text style={styles.accountHeaderText}>Accounts</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.addAccountButton}
            onPress={() => setTransferModalVisible(true)}
          >
            <ArrowLeftRight color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addAccountButton}
            onPress={() => setModalVisible(true)}
          >
            <Plus color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.accountCardGroup}
      >
        {accountDetails.length > 0 ? (
          accountDetails.map((acc) => (
            <View style={styles.accountCard} key={acc.id}>
              <Text style={styles.accountCardAnnotation}>{acc.anotation}</Text>
              <Text style={styles.accountCardBalance}>
                Rs {formatBalance(acc.running_balance)}
              </Text>
              <Text style={styles.accountCardType}>{acc.account_type}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.accountEmptyText}>No accounts added</Text>
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Account</Text>
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
                <HorizontalLine />
                <Text style={styles.label}>Account Name</Text>
                <View>
                  <TextInput
                    style={styles.pageInput}
                    placeholder="Enter Account Name (Eg: Prabhu Bank)"
                    value={accountName}
                    onChangeText={setAccountName}
                    returnKeyType="done"
                    placeholderTextColor="#666"
                  />
                </View>
                <Text style={styles.label}>Account Name Annotation</Text>
                <View>
                  <TextInput
                    style={styles.pageInput}
                    placeholder="Enter annotation (Eg: PBL)"
                    value={annotation}
                    onChangeText={setAnnotation}
                    returnKeyType="done"
                    placeholderTextColor="#666"
                  />
                </View>
                <Text style={styles.label}>Account Type</Text>
                <View>
                  <TextInput
                    style={styles.pageInput}
                    placeholder="Enter account type (Eg: Current, Salary)"
                    value={accountType}
                    onChangeText={setAccountType}
                    returnKeyType="done"
                    placeholderTextColor="#666"
                  />
                </View>
                <Text style={styles.label}>Account Opening Balance</Text>
                <View>
                  <TextInput
                    style={styles.pageInput}
                    placeholder="Enter opening balance (Rs)"
                    value={openingBalance.toString()}
                    onChangeText={(text) => setOpeningBalance(Number(text))}
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholderTextColor="#666"
                  />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
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

      {/* Transfer Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={transferModalVisible}
        onRequestClose={() => {
          setTransferModalVisible(false);
          resetTransferForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transfer Between Accounts</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setTransferModalVisible(false);
                  resetTransferForm();
                }}
              >
                <X size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.modalContainer}
              >
                <HorizontalLine />
                
                <Text style={styles.label}>Source Account</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={sourceAccountId}
                    onValueChange={(itemValue) => {
                      setSourceAccountId(itemValue);
                      setTransferError("");
                    }}
                    style={styles.pickerCont}
                  >
                    <Picker.Item label="Select Source Account" value="" />
                    {accountDetails.map((acc) => (
                      <Picker.Item
                        label={`${acc.anotation} - Rs ${formatBalance(acc.running_balance)}`}
                        value={acc.id}
                        key={acc.id}
                      />
                    ))}
                  </Picker>
                </View>

                {sourceAccountId && (
                  <Text style={[styles.label, { fontSize: 12, color: '#888', marginBottom: 15 }]}>
                    Available Balance: Rs {formatBalance(getSourceAccountBalance() || 0)}
                  </Text>
                )}

                <Text style={styles.label}>Destination Account</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={destinationAccountId}
                    onValueChange={(itemValue) => {
                      setDestinationAccountId(itemValue);
                      setTransferError("");
                    }}
                    style={styles.pickerCont}
                  >
                    <Picker.Item label="Select Destination Account" value="" />
                    {accountDetails
                      .filter(acc => acc.id !== sourceAccountId)
                      .map((acc) => (
                        <Picker.Item
                          label={`${acc.anotation} - ${acc.account_type}`}
                          value={acc.id}
                          key={acc.id}
                        />
                      ))}
                  </Picker>
                </View>

                <Text style={styles.label}>Transfer Amount</Text>
                <View>
                  <TextInput
                    style={styles.pageInput}
                    placeholder="Enter amount (Rs)"
                    value={transferAmount}
                    onChangeText={(text) => {
                      setTransferAmount(text);
                      setTransferError("");
                    }}
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholderTextColor="#666"
                  />
                </View>

                {transferError ? (
                  <Text style={[styles.errorText, { marginBottom: 15, textAlign: 'left' }]}>
                    {transferError}
                  </Text>
                ) : null}

                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={handleTransfer}
                >
                  <Text
                    style={{
                      fontFamily: "SpaceMono_400Regular",
                      fontSize: 16,
                    }}
                  >
                    Transfer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setTransferModalVisible(false);
                    resetTransferForm();
                  }}
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
};

export default Accounts;
