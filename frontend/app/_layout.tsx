import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import React from "react";

// Import safe polyfills only
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
    </>
  )
}