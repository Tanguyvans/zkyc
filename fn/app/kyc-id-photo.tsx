import React from 'react'
import { SafeAreaView, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import CameraCapture from '../components/CameraCapture'

const KycIdPhoto = () => {
  const handlePhotoCapture = (imageUri: string) => {
    Alert.alert(
      'Photo Captured!',
      'Your ID document has been captured successfully.',
      [
        {
          text: 'Continue',
          onPress: () => {
            // Store the image URI (in a real app, you'd upload it to your server)
            console.log('ID Photo captured:', imageUri)
            router.push('/kyc-selfie')
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraCapture
        title="Capture ID Document"
        subtitle="Please position your ID document within the frame. Make sure all text is clearly visible and not blurred."
        captureMode="document"
        overlayText="Position your ID document within the frame"
        onCapture={handlePhotoCapture}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default KycIdPhoto 