import { SpaceMono_400Regular, useFonts } from "@expo-google-fonts/space-mono";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  CreditCard,
  GalleryHorizontalIcon,
  Home,
  Landmark,
  User,
} from "lucide-react-native";
import React, { useCallback } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono_400Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1e1e1e",
            height: 105,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            shadowRadius: 3,
            elevation: 5,
            borderColor: "#1e1e1e",
          },
          tabBarLabelStyle: {
            fontFamily: "SpaceMono_400Regular",
            fontSize: 10,
            color: "white",
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} strokeWidth={1.8} />
            ),
          }}
        />
        <Tabs.Screen
          name="category"
          options={{
            title: "Category",
            tabBarIcon: ({ color, size }) => (
              <GalleryHorizontalIcon
                color={color}
                size={size}
                strokeWidth={1.8}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color, size }) => (
              <Landmark color={color} size={size} strokeWidth={1.8} />
            ),
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: "Transaction",
            tabBarIcon: ({ color, size }) => (
              <CreditCard color={color} size={size} strokeWidth={1.8} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size} strokeWidth={1.8} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
