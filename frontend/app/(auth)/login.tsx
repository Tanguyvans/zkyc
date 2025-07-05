import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const ConnectWallet = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHalf}>
        <Ionicons name="wallet" size={100} color="#111" />
        <View style={{gap: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>Connect Your Wallet</Text>
            <Text style={{fontSize: 18, textAlign: 'center'}}>Your verification will be tied to this address and usable across all compatible dApps.</Text>
        </View>
      </View>
      <View style={styles.bottomHalf}>
        {/* <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.button} onPress={() => {router.push('/dashboard')}}> */}
        <TouchableOpacity style={styles.button} onPress={() => {router.push('/(onboarding)/kyc')}}>
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bottomHalf: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 10
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default ConnectWallet