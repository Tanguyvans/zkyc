import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image, Modal, Animated, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useCameraPermissions } from 'expo-camera'

const { height: screenHeight } = Dimensions.get('window')

const kycId = () => {

  const [hasPermission, requestPermission] = useCameraPermissions()

  async function requestCameraPermission() {
    const cameraStatus = await requestPermission()
    if(!cameraStatus.granted) {
      alert('We need your permission to show the camera')
      return false
    }
    return true
  }

  async function handleContinue() {
    setIsModalVisible(false)
    const hasPermission = await requestCameraPermission()
    if(hasPermission) {
      router.push('/(onboarding)/kyc-id-photo')
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const slideAnim = useRef(new Animated.Value(screenHeight)).current

  const handlePhotoId = () => {
    setIsModalVisible(true)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false)
    })
  }

  const handlePassport = () => {
    console.log('Passport')
  }

  const handleDriversLicense = () => {
    console.log('Drivers License')
  }

  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end", alignItems: 'center', padding: 20, height:'50%', width:'100%' }}>
        <Image 
          source={require('../../assets/images/react-logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={{gap: 10, alignItems: 'flex-start'}}>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>Proof of Identity</Text>
            <Text style={{fontSize: 18, textAlign: 'center'}}>Please submit one of the following documents.</Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10, height:'50%', width:'100%' }}>
        <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }]} onPress={() => {handlePhotoId()}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 }}>
            <Ionicons name="card" size={24} color="#000" />
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Photo ID</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }]} onPress={() => {handlePassport()}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 }}>
            <Ionicons name="camera" size={24} color="#000" />
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Passport</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />

          {/* {validSelfie ? <Ionicons name="checkmark-circle-outline" size={24} color="rgb(33, 162, 35)" /> : <Ionicons name="chevron-forward" size={24} color="#000" />} */}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }]} onPress={() => {handleDriversLicense()}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 }}>
            <Ionicons name="camera" size={24} color="#000" /> 
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Drivers License</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />

          {/* {validSelfie ? <Ionicons name="checkmark-circle-outline" size={24} color="rgb(33, 162, 35)" /> : <Ionicons name="chevron-forward" size={24} color="#000" />} */}
        </TouchableOpacity>
{/*         
        {validId && validSelfie && (
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        )} */}
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={closeModal}
          />
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Photo ID Upload</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                Please upload a clear photo of your government-issued photo ID.
              </Text>
              <TouchableOpacity style={styles.uploadButton} onPress={handleContinue}>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="images" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
    image: {
      width: 100,
      height: 100,
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
    // Modal styles
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingBottom: 40,
      maxHeight: '70%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: '#e0e0e0',
      borderRadius: 2,
      position: 'absolute',
      top: -10,
      left: '50%',
      marginLeft: -20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    closeButton: {
      padding: 5,
    },
    modalBody: {
      padding: 20,
      gap: 20,
    },
    modalText: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666',
      lineHeight: 24,
    },
    uploadButton: {
      backgroundColor: '#000',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      gap: 10,
    },
    uploadButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    
})

export default kycId