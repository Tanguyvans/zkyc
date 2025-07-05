import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'

interface ProofCardProps {
  proof: string
  attributes: string[]
  generatedAt: Date
  onShare?: () => void
}

const ProofCard: React.FC<ProofCardProps> = ({ 
  proof, 
  attributes, 
  generatedAt, 
  onShare 
}) => {
  const copyProof = async () => {
    await Clipboard.setStringAsync(proof)
    Alert.alert('Copied!', 'Proof has been copied to clipboard')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated Proof</Text>
      
      <View style={styles.proofContainer}>
        <Text style={styles.proofText}>{proof}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={copyProof}>
            <Ionicons name="copy" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Copy</Text>
          </TouchableOpacity>
          
          {onShare && (
            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
              <Ionicons name="share" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailTitle}>Proof Details:</Text>
        <Text style={styles.detailItem}>• Attributes: {attributes.join(', ')}</Text>
        <Text style={styles.detailItem}>• Generated: {generatedAt.toLocaleString()}</Text>
        <Text style={styles.detailItem}>• Validity: 24 hours</Text>
        <Text style={styles.detailItem}>• Zero-knowledge: ✓ No personal data revealed</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  proofContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  proofText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  actions: {
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
  details: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
})

export default ProofCard 