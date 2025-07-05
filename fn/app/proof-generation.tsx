import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import * as Clipboard from 'expo-clipboard'

const ProofGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProof, setGeneratedProof] = useState('')
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  
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

  const generateProof = async () => {
    if (selectedAttributes.length === 0) {
      Alert.alert('Error', 'Please select at least one attribute to generate proof')
      return
    }

    setIsGenerating(true)
    
    // Simulate proof generation process
    setTimeout(() => {
      const mockProof = `zk-proof-${Math.random().toString(36).substring(7)}-${Date.now()}`
      setGeneratedProof(mockProof)
      setIsGenerating(false)
      
      Alert.alert(
        'Proof Generated!', 
        'Your zero-knowledge proof has been successfully generated.',
        [{ text: 'OK', onPress: () => {} }]
      )
    }, 3000)
  }

  const copyProof = async () => {
    if (generatedProof) {
      await Clipboard.setStringAsync(generatedProof)
      Alert.alert('Copied!', 'Proof has been copied to clipboard')
    }
  }

  const shareProof = () => {
    if (generatedProof) {
      Alert.alert(
        'Share Proof',
        'Would you like to share this proof with a third party?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Share', onPress: () => {
            // Here you would implement actual sharing logic
            Alert.alert('Shared!', 'Proof has been shared successfully')
          }}
        ]
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate ZK Proof</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Attributes to Prove</Text>
          <Text style={styles.sectionDescription}>
            Choose which attributes you want to prove without revealing the actual values
          </Text>

          {availableAttributes.map(attribute => (
            <TouchableOpacity
              key={attribute.id}
              style={[
                styles.attributeCard,
                selectedAttributes.includes(attribute.id) && styles.selectedAttributeCard
              ]}
              onPress={() => toggleAttribute(attribute.id)}
            >
              <View style={styles.attributeContent}>
                <View style={styles.attributeHeader}>
                  <Text style={styles.attributeLabel}>{attribute.label}</Text>
                  <View style={[
                    styles.checkbox,
                    selectedAttributes.includes(attribute.id) && styles.checkedBox
                  ]}>
                    {selectedAttributes.includes(attribute.id) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                </View>
                <Text style={styles.attributeDescription}>{attribute.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.generateButton, isGenerating && styles.disabledButton]}
            onPress={generateProof}
            disabled={isGenerating}
          >
            <LinearGradient
              colors={isGenerating ? ['#ccc', '#999'] : ['#007AFF', '#0056CC']}
              style={styles.buttonGradient}
            >
              {isGenerating ? (
                <View style={styles.generatingContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Generating Proof...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Generate ZK Proof</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {generatedProof && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Generated Proof</Text>
            <View style={styles.proofContainer}>
              <Text style={styles.proofText}>{generatedProof}</Text>
              <View style={styles.proofActions}>
                <TouchableOpacity style={styles.actionButton} onPress={copyProof}>
                  <Ionicons name="copy" size={20} color="#007AFF" />
                  <Text style={styles.actionButtonText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={shareProof}>
                  <Ionicons name="share" size={20} color="#007AFF" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.proofDetails}>
              <Text style={styles.proofDetailTitle}>Proof Details:</Text>
              <Text style={styles.proofDetailItem}>• Attributes: {selectedAttributes.join(', ')}</Text>
              <Text style={styles.proofDetailItem}>• Generated: {new Date().toLocaleString()}</Text>
              <Text style={styles.proofDetailItem}>• Validity: 24 hours</Text>
              <Text style={styles.proofDetailItem}>• Zero-knowledge: ✓ No personal data revealed</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  attributeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedAttributeCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  attributeContent: {
    flex: 1,
  },
  attributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attributeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  attributeDescription: {
    fontSize: 14,
    color: '#666',
  },
  generateButton: {
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
  generatingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proofContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  proofText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  proofActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  proofDetails: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  proofDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  proofDetailItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
})

export default ProofGeneration 