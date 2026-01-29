import styles from "@/style/AppStyles";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const Index = () => {
  const router = useRouter();
  const handleGetStarted = () => {
    console.log("Navigate to login");
    router.push("/(onboarding)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Track money without{"\n"}losing your mind
        </Text>

        <Text style={styles.subtitle}>Simple tracking. Clear numbers.</Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Free forever. No credit card required.
        </Text>
      </View>
    </View>
  );
};

export default Index;
