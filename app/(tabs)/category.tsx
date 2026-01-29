import HorizontalLine from "@/components/common/HorizontalLine";
import { category } from "@/components/type";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
} from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import { Plus, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Category = () => {
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<category[]>([]);
  const amountRef = useRef<TextInput>(null);
  const [categoryName, setCategoryName] = useState("");
  const [modelView, setModelView] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const category = await getAllCategory();
      setCategory(category);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAdd = () => {
    try {
      createCategory(categoryName);
      loadData();
      setModelView(false);
      setCategoryName("");
    } catch {
      console.log("Error adding category");
    }
  };

  const handleDelete = ({ id }: { id: string }) => {
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
      deleteCategory(id);
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
          <Text style={styles.pageHeaderText}>Category</Text>
        </View>
        {category.map((c) => (
          <TouchableOpacity
            key={c.id}
            onLongPress={() => handleDelete({ id: c.id })}
            delayLongPress={250}
          >
            <View>
              <View style={styles.ledgerItem}>
                <Text style={styles.ledgerText}>{c.category_name}</Text>
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
        onPress={() => setModelView(true)}
      >
        <Plus color="#000" size={26} />
      </TouchableOpacity>
      <Modal
        transparent
        animationType="slide"
        visible={modelView}
        onRequestClose={() => setModelView(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModelView(false)}
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
                <Text style={styles.label}>Add Category</Text>
                <View>
                  <TextInput
                    ref={amountRef}
                    style={styles.pageInput}
                    placeholder="Enter Category Name"
                    value={categoryName}
                    onChangeText={setCategoryName}
                    // keyboardType="numeric"
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
                  onPress={() => setModelView(false)}
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

export default Category;
