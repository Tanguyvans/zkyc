import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View, ScrollView, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Header, WorkflowContainer, AttributeCard, ProofCard, WorkflowStepData } from '../components'

const ProofWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProof, setGeneratedProof] = useState('')
  const [proofGeneratedAt, setProofGeneratedAt] = useState<Date | null>(null)

  const workflowSteps: WorkflowStepData[] = [
    {
      id: 'select',
      title: 'Select Attributes',
      description: 'Choose which attributes you want to prove',
      icon: 'checkmark-circle',
      status: 'pending'
    },
    {
      id: 'generate',
      title: 'Generate Proof',
      description: 'Create zero-knowledge proof for selected attributes',
      icon: 'shield-checkmark',
      status: 'pending'
    },
    {
      id: 'verify',
      title: 'Verify & Share',
      description: 'Verify proof and share with third parties',
      icon: 'share',
      status: 'pending'
    }
  ]

  const availableAttributes = [
    { id: 'age', label: 'Age Verification', description: 'Prove you are over 18 without revealing exact age' },
    { id: 'identity', label: 'Identity Verification', description: 'Prove your identity without revealing personal details' },
    { id: 'address', label: 'Address Verification', description: 'Prove your address without revealing exact location' },
    { id: 'nationality', label: 'Nationality', description: 'Prove your nationality without revealing other details' },
    { id: 'income', label: 'Income Range', description: 'Prove income range without revealing exact amount' }
  ]

  const toggleAttribute = (attributeId: string) => {
    setSelectedAttributes(prev => 
      prev.includes(attributeId) 
        ? prev.filter(id => id !== attributeId)
        : [...prev, attributeId]
    )
  }

  const handleNext = () => {
    if (currentStep === 0) {
      if (selectedAttributes.length === 0) {
        Alert.alert('Error', 'Please select at least one attribute to proceed')
        return
      }
      setCurrentStep(1)
    } else if (currentStep === 1) {
      generateProof()
    } else if (currentStep === 2) {
      // Reset workflow or navigate back
      setCurrentStep(0)
      setSelectedAttributes([])
      setGeneratedProof('')
      setProofGeneratedAt(null)
    }
  }

  const generateProof = async () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const mockProof = `zk-proof-${Math.random().toString(36).substring(7)}-${Date.now()}`
      setGeneratedProof(mockProof)
      setProofGeneratedAt(new Date())
      setIsGenerating(false)
      setCurrentStep(2)
      
      Alert.alert(
        'Proof Generated!', 
        'Your zero-knowledge proof has been successfully generated.',
        [{ text: 'OK', onPress: () => {} }]
      )
    }, 3000)
  }

  const handleShare = () => {
    Alert.alert(
      'Share Proof',
      'Would you like to share this proof with a third party?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => {
          Alert.alert('Shared!', 'Proof has been shared successfully')
        }}
      ]
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Attributes to Prove</Text>
            <Text style={styles.stepDescription}>
              Choose which attributes you want to prove without revealing the actual values
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
          </View>
        )
      
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Generate Zero-Knowledge Proof</Text>
            <Text style={styles.stepDescription}>
              Creating proof for: {selectedAttributes.join(', ')}
            </Text>
            
            <View style={styles.generatingContainer}>
              {isGenerating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.loadingText}>Generating proof...</Text>
                  <Text style={styles.loadingSubtext}>This may take a few moments</Text>
                </View>
              ) : (
                <View style={styles.readyContainer}>
                  <Ionicons name="shield-checkmark" size={48} color="#4CAF50" />
                  <Text style={styles.readyText}>Ready to generate proof</Text>
                </View>
              )}
            </View>
          </View>
        )
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Proof Generated Successfully!</Text>
            <Text style={styles.stepDescription}>
              Your zero-knowledge proof is ready to share
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
          </View>
        )
      
      default:
        return null
    }
  }

  const getButtonText = () => {
    switch (currentStep) {
      case 0: return 'Continue'
      case 1: return isGenerating ? 'Generating...' : 'Generate Proof'
      case 2: return 'Start New Proof'
      default: return 'Next'
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="ZK Proof Workflow" />
      
      <WorkflowContainer
        title="Proof Generation Process"
        steps={workflowSteps}
        currentStepIndex={currentStep}
      >
        {renderStepContent()}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.nextButton, isGenerating && styles.disabledButton]}
            onPress={handleNext}
            disabled={isGenerating}
          >
            <LinearGradient
              colors={isGenerating ? ['#ccc', '#999'] : ['#007AFF', '#0056CC']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{getButtonText()}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </WorkflowContainer>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  loadingContainer: {
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
  },
  readyContainer: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
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
  disabledButton: {
    opacity: 0.6,
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

export default ProofWorkflow 