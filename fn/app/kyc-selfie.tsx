import React from 'react'
import { SafeAreaView, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import CameraCapture from '../components/CameraCapture'

const KycSelfie = () => {
  const handleSelfieCapture = (imageUri: string) => {
    Alert.alert(
      'Selfie Captured!',
      'Your identity verification is complete. Proceeding to proof generation.',
      [
        {
          text: 'Continue',
          onPress: () => {
            // Store the selfie URI (in a real app, you'd upload it to your server)
            console.log('Selfie captured:', imageUri)
            router.push('/proof-workflow')
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraCapture
        title="Take Your Selfie"
        subtitle="Look directly at the camera and make sure your face is clearly visible within the circle. Remove any glasses or accessories that might obscure your face."
        captureMode="selfie"
        overlayText="Position your face within the circle"
        onCapture={handleSelfieCapture}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default KycSelfie 