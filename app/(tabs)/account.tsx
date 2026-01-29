import HorizontalLine from "@/components/common/HorizontalLine";
import { account } from "@/components/type";
import {
  createAccounts,
  deleteAccounts,
  getAllAccounts,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import { Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Accounts = () => {
  const insets = useSafeAreaInsets();

  const [accounts, setAccounts] = useState<account[]>([]);

  const [accountName, setAccountName] = useState<string>("");
  const [annotation, setAnnotation] = useState<string>("");
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [accountType, setAccountType] = useState<string>("");
  const [modelVisible, setModelVisible] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const accData = await getAllAccounts();

      setAccounts(accData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAdd = () => {
    try {
      createAccounts({
        account_name: accountName,
        anotation: annotation,
        opening_balance: openingBalance,
        account_type: accountType,
      });
      loadData();
      setModelVisible(false);
      setAccountName("");
      setAnnotation("");
      setAccountType("");
      setOpeningBalance(0);
    } catch {
      console.log("Error adding accounts");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete item?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteItem({ id: id }),
        style: "destructive",
      },
    ]);
  };
  const deleteItem = ({ id }: { id: string }) => {
    try {
      deleteAccounts(id);
      loadData();
      console.log("Deleted");
    } catch {
      console.log("Error Deleting Ledger");
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderText}>Accounts</Text>
          <Pressable></Pressable>
        </View>

        {accounts.map((a) => (
          <TouchableOpacity
            key={a.id}
            onLongPress={() => handleDelete(a.id)}
            delayLongPress={250}
          >
            <View key={a.id}>
              <View style={styles.ledgerItem}>
                <Text style={styles.ledgerText}>
                  {a.account_name}({a.anotation})
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
        onPress={() => setModelVisible(true)}
      >
        <Plus color="#000" size={26} />
      </TouchableOpacity>
      <Modal
        transparent
        animationType="slide"
        visible={modelVisible}
        onRequestClose={() => setModelVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Account</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModelVisible(false)}
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
                    placeholderTextColor="#999"
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
                    placeholderTextColor="#999"
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
                    placeholderTextColor="#999"
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
                    placeholderTextColor="#999"
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
                  onPress={() => setModelVisible(false)}
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
    </>
  );
};

export default Accounts;
