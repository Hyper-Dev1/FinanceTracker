import HorizontalLine from "@/components/common/HorizontalLine";
import { createAccounts } from "@/database/firebaseOperation";
import { subscribeToAccounts } from "@/sevices/subscription/account.sub";
import styles from "@/style/AppStyles";
import { Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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

const Accounts = () => {
  const [accountDetails, setAccountDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [accountName, setAccountName] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [accountType, setAccountType] = useState("");

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

  const formatBalance = (balance: number) => {
    return balance?.toLocaleString() || "0";
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
        <TouchableOpacity
          style={styles.addAccountButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus color="#fff" size={20} />
        </TouchableOpacity>
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

            <View style={styles.modalFormContainer}>
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
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
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
