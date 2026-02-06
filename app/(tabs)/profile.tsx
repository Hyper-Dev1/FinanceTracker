import Category from "@/components/pages/Category";
import { User } from "@/components/type";
import { auth } from "@/config/firebase";
import { getCurrentUser } from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const [user, setUser] = useState<User>();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();

            await signOut(auth);

            router.replace("/(onboarding)");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 100,
      }}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderText}>Profile</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.profileSection}>
        <Text style={styles.profileSectionTitle}>Account Information</Text>
        <View style={styles.profileInfoItem}>
          <Text style={styles.profileInfoLabel}>Name</Text>
          <Text style={styles.profileInfoValue}>{user?.name || "—"}</Text>
        </View>
        <View style={[styles.profileInfoItem, styles.profileInfoItemLast]}>
          <Text style={styles.profileInfoLabel}>Email</Text>
          <Text style={styles.profileInfoValue}>{user?.email || "—"}</Text>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.profileSection}>
        <Text style={styles.profileSectionTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={styles.profileButtonText}>Manage Category</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <Category onClose={() => setCategoryModalVisible(false)} />
      </Modal>
    </ScrollView>
  );
};

export default Profile;
