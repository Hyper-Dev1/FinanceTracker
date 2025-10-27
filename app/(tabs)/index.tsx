import HorizontalLine from "@/components/common/HorizontalLine";
import Accounts from "@/components/home/Accounts";
import { TotalFund } from "@/components/home/TotalFund";
import Transaction from "@/components/home/Transaction";
import styles from "@/style/AppStyles";
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
  const insets = useSafeAreaInsets();

  const [isVisible, setVisible] = useState(false);
  const [ledger, setLedger] = useState("");
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState("");
  const amountRef = useRef<TextInput>(null);

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        amountRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleAdd = () => {
    console.log({ ledger, bank, amount });
    setVisible(false);
    setLedger("");
    setBank("");
    setAmount("");
  };

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
            <Text style={[styles.text, { textAlign: "right" }]}>
              Sudip!{"\n"}
            </Text>
          </View>
        </View>
        <HorizontalLine />
        <TotalFund />
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
                <Text style={styles.label}>Ledger</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={ledger}
                    onValueChange={(itemValue) => setLedger(itemValue)}
                    style={styles.pickerCont}
                  >
                    <Picker.Item label="Select Ledger" value="" />
                    <Picker.Item label="Groceries" value="groceries" />
                    <Picker.Item label="Bills" value="bills" />
                    <Picker.Item label="Salary" value="salary" />
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
                    <Picker.Item label="Nabil Bank" value="nabil" />
                    <Picker.Item label="Global IME" value="global" />
                    <Picker.Item label="Prabhu Bank" value="prabhu" />
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

                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                  <Text
                    style={{ fontFamily: "SpaceMono_400Regular", fontSize: 16 }}
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
};
export default Index;
