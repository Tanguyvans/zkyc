import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser'

const ConnectWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  // Navigate to KYC when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      const timer = setTimeout(() => {
        router.push('/(onboarding)/kyc')
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, walletAddress])

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    
    try {
      // Try to open MetaMask deep link
      const result = await WebBrowser.openBrowserAsync('https://metamask.app.link/dapp/zkyc.app')
      
      if (result.type === 'dismiss') {
        // User dismissed, show mock connection option
        Alert.alert(
          "Connect Wallet",
          "Would you like to connect with a demo wallet for testing?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Connect Demo Wallet", 
              onPress: () => {
                const mockAddress = '0x1234567890abcdef1234567890abcdef12345678'
                setWalletAddress(mockAddress)
                setIsConnected(true)
                Alert.alert(
                  "Demo Wallet Connected!", 
                  `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`
                )
              }
            }
          ]
        )
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      
      // Fallback to mock connection
      Alert.alert(
        "Connect Demo Wallet",
        "Real wallet connection is not available. Would you like to use a demo wallet?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Use Demo Wallet", 
            onPress: () => {
              const mockAddress = '0x1234567890abcdef1234567890abcdef12345678'
              setWalletAddress(mockAddress)
              setIsConnected(true)
            }
          }
        ]
      )
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSkip = () => {
    Alert.alert(
      "Skip Wallet Connection",
      "Are you sure you want to continue without connecting a wallet? Your KYC verification won't be tied to a blockchain address.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => router.push('/(onboarding)/kyc') }
      ]
    )
  }

  const handleDisconnect = () => {
    setWalletAddress('')
    setIsConnected(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <View style={styles.topHalf}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={80} color="#fff" />
            {isConnected && (
              <View style={styles.connectedIndicator}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {isConnected ? 'Wallet Connected!' : 'Connect Your Wallet'}
            </Text>
            <Text style={styles.subtitle}>
              {isConnected 
                ? `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : 'Your verification will be tied to this address and usable across all compatible dApps.'
              }
            </Text>
          </View>
        </View>
        
        <View style={styles.bottomHalf}>
          {!isConnected ? (
            <>
              <TouchableOpacity 
                style={[styles.button, isConnecting && styles.buttonDisabled]} 
                onPress={handleConnectWallet}
                disabled={isConnecting}
              >
                <View style={styles.buttonContent}>
                  {isConnecting ? (
                    <>
                      <Ionicons name="sync" size={20} color="#667eea" />
                      <Text style={styles.buttonTextSecondary}>Connecting...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="wallet-outline" size={20} color="#667eea" />
                      <Text style={styles.buttonTextSecondary}>Connect Wallet</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successContainer}>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => router.push('/(onboarding)/kyc')}
              >
                <Text style={styles.continueButtonText}>Continue to KYC</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.disconnectButton}
                onPress={handleDisconnect}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  connectedIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomHalf: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 30,
    gap: 15,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonTextSecondary: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  successContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disconnectButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  disconnectButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
})

export default ConnectWallet