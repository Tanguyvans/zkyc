import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const KYC = () => {
    const [validId, setValidId] = useState(false)
    const [validSelfie, setValidSelfie] = useState(false)

    const handleValidId = () => {
        router.push('/(onboarding)/kyc-id')
        setValidId(true)
    }

    const handleValidSelfie = () => {
        router.push('/(onboarding)/kyc-selfie')
        setValidSelfie(true)
    }

    const handleVerify = () => {
        // Handle verification logic here
        // console.log('Verifying KYC...')
        // You can add navigation to next screen or API call here
        router.push('/(onboarding)/kyc-verification')
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "flex-end", alignItems: 'center', padding: 20, height:'50%', width:'100%' }}>
        <Image
          source={require('../../assets/images/react-logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={{gap: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>Let's verify KYC</Text>
            <Text style={{fontSize: 18, textAlign: 'center'}}>Please submit the following documents to verify your profile.</Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10, height:'50%', width:'100%' }}>
        <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }]} onPress={() => {handleValidId()}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 }}>
            <Ionicons name="card" size={24} color="#000" />
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Take a picture of your valid ID</Text>
              <Text style={styles.buttonTextSmall}>To check you rpersonal information is correct</Text>
            </View>
          </View>
          {validId ? <Ionicons name="checkmark-circle-outline" size={24} color="rgb(33, 162, 35)" /> : <Ionicons name="chevron-forward" size={24} color="#000" />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }]} onPress={() => {handleValidSelfie()}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 }}>
            <Ionicons name="camera" size={24} color="#000" />
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Take a selfie of yourself</Text>
              <Text style={styles.buttonTextSmall}>To match your face to your photo ID</Text>
            </View>
          </View>
          {validSelfie ? <Ionicons name="checkmark-circle-outline" size={24} color="rgb(33, 162, 35)" /> : <Ionicons name="chevron-forward" size={24} color="#000" />}
        </TouchableOpacity>
        
        {validId && validSelfie && (
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => router.push('/kyc-selfie')}
        >
          <Text style={styles.startButtonText}>Start Verification</Text>
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
  image: {
    width: 100,
    height: 100,
  },
  bottomHalf: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 10
  },
  button: {
    // backgroundColor: '#111',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    // gap: 5
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
    // backgroundColor: '#f8f8f8',
  },
  buttonText: {
    // color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSmall: {
    // color: '#fff',
    fontSize: 16,
    fontWeight: 'light',
  },
  verifyButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default KYC