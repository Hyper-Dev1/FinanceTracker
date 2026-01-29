import { SpaceMono_400Regular, useFonts } from "@expo-google-fonts/space-mono";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
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
    <>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Slot />
      </View>
    </>
  );
}
