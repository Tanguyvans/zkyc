import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Dimensions } from 'react-native'
import { CameraView, Camera } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

interface CameraCaptureProps {
  title: string
  subtitle?: string
  onCapture: (imageUri: string) => void
  captureMode?: 'document' | 'selfie'
  overlayText?: string
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  title,
  subtitle,
  onCapture,
  captureMode = 'document',
  overlayText
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const cameraRef = useRef<CameraView>(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        })
        console.log('Photo taken:', photo.uri)
        onCapture(photo.uri)
      } catch (error) {
        console.error('Error taking photo:', error)
        Alert.alert('Error', 'Failed to take picture. Please try again.')
      }
    }
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="camera" size={64} color="#ccc" />
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="close-circle" size={64} color="#F44336" />
          <Text style={styles.permissionText}>Camera access denied</Text>
          <Text style={styles.permissionSubtext}>Please enable camera access in Settings</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (captureMode === 'document') {
    // Document capture layout (like ID card)
    const rectangleWidth = width * 0.8
    const rectangleHeight = rectangleWidth * 0.6
    const rectangleX = (width - rectangleWidth) / 2
    const rectangleY = (height - rectangleHeight) / 2

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef}>
          {/* Title overlay */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          {/* Top black overlay */}
          <View style={[styles.overlay, { 
            top: 0, 
            left: 0, 
            right: 0, 
            height: rectangleY,
          }]} />
          
          {/* Left black overlay */}
          <View style={[styles.overlay, { 
            top: rectangleY, 
            left: 0, 
            width: rectangleX,
            height: rectangleHeight,
          }]} />
          
          {/* Right black overlay */}
          <View style={[styles.overlay, { 
            top: rectangleY, 
            right: 0, 
            width: rectangleX,
            height: rectangleHeight,
          }]} />
          
          {/* Bottom black overlay */}
          <View style={[styles.overlay, { 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: height - rectangleY - rectangleHeight,
          }]} />
          
          {/* Rectangle border */}
          <View style={{
            position: 'absolute',
            top: rectangleY,
            left: rectangleX,
            width: rectangleWidth,
            height: rectangleHeight,
            borderWidth: 2,
            borderColor: 'white',
            borderRadius: 8,
          }} />
          
          {/* Corner indicators */}
          <View style={[styles.corner, {
            top: rectangleY - 2,
            left: rectangleX - 2,
            borderTopWidth: 4,
            borderLeftWidth: 4,
            borderTopLeftRadius: 8,
          }]} />
          <View style={[styles.corner, {
            top: rectangleY - 2,
            right: width - rectangleX - rectangleWidth - 2,
            borderTopWidth: 4,
            borderRightWidth: 4,
            borderTopRightRadius: 8,
          }]} />
          <View style={[styles.corner, {
            bottom: height - rectangleY - rectangleHeight - 2,
            left: rectangleX - 2,
            borderBottomWidth: 4,
            borderLeftWidth: 4,
            borderBottomLeftRadius: 8,
          }]} />
          <View style={[styles.corner, {
            bottom: height - rectangleY - rectangleHeight - 2,
            right: width - rectangleX - rectangleWidth - 2,
            borderBottomWidth: 4,
            borderRightWidth: 4,
            borderBottomRightRadius: 8,
          }]} />
          
          {/* Instruction text */}
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              {overlayText || 'Position your ID document within the frame'}
            </Text>
          </View>
          
          {/* Shutter button */}
          <View style={styles.shutterContainer}>
            <TouchableOpacity onPress={takePhoto} style={styles.shutterButton}>
              <View style={styles.shutterButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    )
  } else {
    // Selfie capture layout
    const faceFrameSize = Math.min(width, height) * 0.6
    const faceFrameX = (width - faceFrameSize) / 2
    const faceFrameY = (height - faceFrameSize) / 2

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing="front">
          {/* Title overlay */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          {/* Top overlay */}
          <View style={[styles.overlay, { height: faceFrameY }]} />
          
          {/* Left overlay */}
          <View style={[styles.overlay, { 
            position: 'absolute',
            top: faceFrameY,
            left: 0,
            width: faceFrameX,
            height: faceFrameSize,
          }]} />
          
          {/* Right overlay */}
          <View style={[styles.overlay, { 
            position: 'absolute',
            top: faceFrameY,
            right: 0,
            width: faceFrameX,
            height: faceFrameSize,
          }]} />
          
          {/* Bottom overlay */}
          <View style={[styles.overlay, { 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: height - faceFrameY - faceFrameSize,
          }]} />
          
          {/* Circular face frame border */}
          <View style={{
            position: 'absolute',
            top: faceFrameY,
            left: faceFrameX,
            width: faceFrameSize,
            height: faceFrameSize,
            borderRadius: faceFrameSize / 2,
            borderWidth: 3,
            borderColor: '#fff',
          }} />
          
          {/* Instruction text */}
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              {overlayText || 'Position your face within the circle'}
            </Text>
          </View>
          
          {/* Shutter button */}
          <View style={styles.shutterContainer}>
            <TouchableOpacity onPress={takePhoto} style={styles.shutterButton}>
              <View style={styles.shutterButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    )
  }
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
    backgroundColor: '#f8f9fa',
  },
  titleContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#333',
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
})

export default CameraCapture 