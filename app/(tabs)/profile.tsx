import { User } from "@/components/type";
import { auth } from "@/config/firebase";
import { getCurrentUser } from "@/database/firebaseOperation";
import styles from "@/style/AppStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };

    fetchUser();
  }, []);

  const handleDelete = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              
              await signOut(auth);
              
              router.replace('/(onboarding)');

            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ]
    );
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

      <TouchableOpacity
        onLongPress={handleDelete}
        delayLongPress={250}
      >
        <View>
          <View style={styles.ledgerItem}>
            <Text style={styles.ledgerText}>
              {user?.email}({user?.name})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;