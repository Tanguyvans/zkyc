import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Camera, CameraView } from 'expo-camera'
import * as FileSystem from 'expo-file-system'

const KYCselfie = () => {
  const cameraRef = useRef<CameraView>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [captured, setCaptured] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const takeSelfie = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        })
        
        console.log('Selfie captured:', photo.uri)
        
        // Verify the file exists
        const fileInfo = await FileSystem.getInfoAsync(photo.uri)
        console.log('Selfie file info:', fileInfo)
        
        if (!fileInfo.exists) {
          throw new Error('Failed to save selfie file')
        }
        
        setCaptured(true)
        
        // Go to ID photo screen with selfie URI
        router.push({
          pathname: '/kyc-id-photo',
          params: { selfieUri: photo.uri }
        })
        
      } catch (error) {
        console.error('Error taking selfie:', error)
        Alert.alert('Error', 'Failed to take selfie. Please try again.')
      }
    }
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text>Camera permission denied</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera}
        ref={cameraRef}
        facing="front"
      >
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>📸 Take a Selfie</Text>
          <Text style={styles.instructionsSubtext}>Position your face in the center</Text>
        </View>

        {/* Capture Button */}
        <View style={styles.captureContainer}>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takeSelfie}
            disabled={captured}
          >
            <Ionicons name="camera" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructionsContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  instructionsSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default KYCselfie