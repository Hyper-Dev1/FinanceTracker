import { auth } from "@/config/firebase";
import styles from "@/style/AppStyles";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      Alert.alert("Success", "Loggin in Successful!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error: any) {
      console.log("Signup error:", error);

      // Handle specific Firebase errors
      let errorMessage = "An error occurred during signup";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid Credential";
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
      // router.replace("/(onboarding)");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : "padding"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.loginPageTitle}>Sign in</Text>

            <View style={styles.formWrapper}>
              <Text style={styles.formLabel}>Email Address</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                textContentType="emailAddress"
                placeholderTextColor="#999"
                editable={!loading}
              />

              <Text style={styles.formLabel}>Password</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                textContentType="password"
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>
            <Pressable
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.formUrl}
              onPress={() => router.replace("/(onboarding)/register")}
            >
              <Text style={styles.formUrlText}>
                Don’t have an account? Sign Up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
