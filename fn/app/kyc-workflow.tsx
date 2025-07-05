import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View, ScrollView, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Header, WorkflowContainer, CameraCapture, AttributeCard, ProofCard, WorkflowStepData } from '../components'

const KycWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [idPhotoUri, setIdPhotoUri] = useState<string | null>(null)
  const [selfieUri, setSelfieUri] = useState<string | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProof, setGeneratedProof] = useState('')
  const [proofGeneratedAt, setProofGeneratedAt] = useState<Date | null>(null)

  const workflowSteps: WorkflowStepData[] = [
    {
      id: 'id-photo',
      title: 'Capture ID Document',
      description: 'Take a photo of your government-issued ID',
      icon: 'card',
      status: 'pending'
    },
    {
      id: 'selfie',
      title: 'Take Selfie',
      description: 'Capture a selfie for identity verification',
      icon: 'person',
      status: 'pending'
    },
    {
      id: 'select-attributes',
      title: 'Select Attributes',
      description: 'Choose which attributes to prove',
      icon: 'checkmark-circle',
      status: 'pending'
    },
    {
      id: 'generate-proof',
      title: 'Generate Proof',
      description: 'Create zero-knowledge proof',
      icon: 'shield-checkmark',
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Your zKYC proof is ready',
      icon: 'trophy',
      status: 'pending'
    }
  ]

  const availableAttributes = [
    { id: 'age', label: 'Age Verification', description: 'Prove you are over 18 without revealing exact age' },
    { id: 'identity', label: 'Identity Verification', description: 'Prove your identity without revealing personal details' },
    { id: 'address', label: 'Address Verification', description: 'Prove your address without revealing exact location' },
    { id: 'nationality', label: 'Nationality', description: 'Prove your nationality without revealing other details' },
  ]

  const handleIdPhotoCapture = (imageUri: string) => {
    setIdPhotoUri(imageUri)
    setCurrentStep(1)
    Alert.alert('Success!', 'ID document captured successfully')
  }

  const handleSelfieCapture = (imageUri: string) => {
    setSelfieUri(imageUri)
    setCurrentStep(2)
    Alert.alert('Success!', 'Selfie captured successfully')
  }

  const toggleAttribute = (attributeId: string) => {
    setSelectedAttributes(prev => 
      prev.includes(attributeId) 
        ? prev.filter(id => id !== attributeId)
        : [...prev, attributeId]
    )
  }

  const handleNext = () => {
    if (currentStep === 2) {
      if (selectedAttributes.length === 0) {
        Alert.alert('Error', 'Please select at least one attribute to proceed')
        return
      }
      setCurrentStep(3)
      generateProof()
    } else if (currentStep === 4) {
      // Reset workflow or navigate back
      setCurrentStep(0)
      setIdPhotoUri(null)
      setSelfieUri(null)
      setSelectedAttributes([])
      setGeneratedProof('')
      setProofGeneratedAt(null)
    }
  }

  const generateProof = async () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockProof = `zk-kyc-proof-${Math.random().toString(36).substring(7)}-${Date.now()}`
      setGeneratedProof(mockProof)
      setProofGeneratedAt(new Date())
      setIsGenerating(false)
      setCurrentStep(4)
      
      Alert.alert(
        'KYC Proof Generated!', 
        'Your zero-knowledge KYC proof has been successfully generated.',
        [{ text: 'OK', onPress: () => {} }]
      )
    }, 3000)
  }

  const handleShare = () => {
    Alert.alert(
      'Share KYC Proof',
      'Would you like to share this proof with a third party?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => {
          Alert.alert('Shared!', 'KYC proof has been shared successfully')
        }}
      ]
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.cameraContainer}>
            <CameraCapture
              title="Capture ID Document"
              subtitle="Please position your ID document within the frame. Make sure all text is clearly visible and not blurred."
              captureMode="document"
              overlayText="Position your ID document within the frame"
              onCapture={handleIdPhotoCapture}
            />
          </View>
        )
      
      case 1:
        return (
          <View style={styles.cameraContainer}>
            <CameraCapture
              title="Take Your Selfie"
              subtitle="Look directly at the camera and make sure your face is clearly visible within the circle."
              captureMode="selfie"
              overlayText="Position your face within the circle"
              onCapture={handleSelfieCapture}
            />
          </View>
        )
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Attributes to Prove</Text>
            <Text style={styles.stepDescription}>
              Choose which attributes you want to prove with your zKYC
            </Text>
            
            <ScrollView style={styles.attributesList}>
              {availableAttributes.map(attribute => (
                <AttributeCard
                  key={attribute.id}
                  id={attribute.id}
                  label={attribute.label}
                  description={attribute.description}
                  isSelected={selectedAttributes.includes(attribute.id)}
                  onToggle={toggleAttribute}
                />
              ))}
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={handleNext}
              >
                <LinearGradient
                  colors={['#007AFF', '#0056CC']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Generate Proof</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )
      
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Generating zKYC Proof</Text>
            <Text style={styles.stepDescription}>
              Creating zero-knowledge proof with your documents and selected attributes
            </Text>
            
            <View style={styles.generatingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing your documents...</Text>
              <Text style={styles.loadingSubtext}>This may take a few moments</Text>
              
              <View style={styles.processingSteps}>
                <Text style={styles.processingStep}>✓ Document analysis</Text>
                <Text style={styles.processingStep}>✓ Identity verification</Text>
                <Text style={styles.processingStep}>⏳ Generating zk-proof...</Text>
              </View>
            </View>
          </View>
        )
      
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>zKYC Proof Complete!</Text>
            <Text style={styles.stepDescription}>
              Your zero-knowledge KYC proof is ready to use
            </Text>
            
            <ScrollView style={styles.proofContainer}>
              {generatedProof && proofGeneratedAt && (
                <ProofCard
                  proof={generatedProof}
                  attributes={selectedAttributes}
                  generatedAt={proofGeneratedAt}
                  onShare={handleShare}
                />
              )}
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={handleNext}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Start New KYC</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )
      
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Complete KYC Workflow" />
      
      {currentStep < 2 ? (
        renderStepContent()
      ) : (
        <WorkflowContainer
          title="zKYC Generation Process"
          steps={workflowSteps}
          currentStepIndex={currentStep}
        >
          {renderStepContent()}
        </WorkflowContainer>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  cameraContainer: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  attributesList: {
    flex: 1,
  },
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 30,
  },
  processingSteps: {
    alignItems: 'flex-start',
  },
  processingStep: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  proofContainer: {
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default KycWorkflow 