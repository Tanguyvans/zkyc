import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import React from "react";

// Import polyfills for WalletConnect
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'text-encoding';

// Safely import WalletConnect with error handling
let AppKit: any = null;
let createAppKit: any = null;
let defaultConfig: any = null;

try {
  const walletImport = require("@reown/appkit-ethers5-react-native");
  AppKit = walletImport.AppKit;
  createAppKit = walletImport.createAppKit;
  defaultConfig = walletImport.defaultConfig;

  // 1. Get projectId from https://cloud.reown.com
  const projectId = "0d70fc8cf98c1a5ffdd6ac8da4ebc686";

  // 2. Create config
  const metadata = {
    name: "zKYC",
    description: "Zero-Knowledge KYC Verification",
    url: "https://zkyc.app",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
    redirect: {
      native: "zkyc://",
    },
  };

  const config = defaultConfig({ metadata });

  // 3. Define your chains
  const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  };

  const polygon = {
    chainId: 137,
    name: "Polygon",
    currency: "MATIC",
    explorerUrl: "https://polygonscan.com",
    rpcUrl: "https://polygon-rpc.com",
  };

  const chains = [mainnet, polygon];

  // 4. Create modal
  createAppKit({
    projectId,
    chains,
    config,
    enableAnalytics: true,
  });

  console.log('WalletConnect initialized successfully');
} catch (error) {
  console.warn('WalletConnect not available, running without wallet connection:', error);
}

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
      {AppKit && <AppKit />}
    </>
  )
}