import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { apiService } from '../../services/apiService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

interface VerificationResult {
  verification_id: string;
  face_verified: boolean;
  face_confidence: number;
  extracted_info: string;
  status: string;
  message: string;
}

const kycVerification = () => {
  const params = useLocalSearchParams()
  const { selfieUri, idCardUri } = params
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [step, setStep] = useState<string>('')

  useEffect(() => {
    verifyIdentity()
  }, [])

  const verifyIdentity = async () => {
    if (!selfieUri || !idCardUri) {
      Alert.alert('Error', 'Missing required images')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setStep('Uploading images...')

      const response = await apiService.verifyIDWithSelfie(idCardUri as string, selfieUri as string)
      console.log('Verification result:', response)
      
      if (response.face_verified) {
        setResult(response)
        setStep('Verification complete!')
        
        // Save user data to AsyncStorage
        await saveUserData(response)
        
      } else {
        setError(`Verification failed: ${response.message}`)
      }
    } catch (error) {
      console.error('Verification error:', error)
      setError(`ID verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const saveUserData = async (verificationResult: VerificationResult) => {
    try {
      // Extract user information from the verification result
      const extractedData = parseExtractedInfo(verificationResult.extracted_info)
      
      // Get name from extracted data
      const name = extractedData.Name || extractedData.name || extractedData.full_name || extractedData.firstName || 'User'
      
      // Create user data object
      const userData = {
        name: name,
        verificationResult: verificationResult,
        isVerified: verificationResult.face_verified,
        verificationDate: new Date().toISOString()
      }
      
      console.log('Saving user data:', userData)
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData))
      
      console.log('User data saved successfully')
      
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  const parseExtractedInfo = (extractedInfo: string) => {
    try {
      const parsed = JSON.parse(extractedInfo)
      return parsed
    } catch (e) {
      return { rawText: extractedInfo }
    }
  }

  const handleContinue = () => {
    if (result) {
      router.push('/dashboard')
    } else {
      router.push('/kyc-selfie')
    }
  }

  const handleRetry = () => {
    router.push('/kyc-selfie')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🔍</Text>
          <Text style={styles.title}>Identity Verification</Text>
          {loading && <Text style={styles.subtitle}>Processing your documents...</Text>}
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>{step}</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.errorTitle}>Verification Failed</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={verifyIdentity}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Success State with Detailed Results */}
        {result && !loading && !error && (
          <View style={styles.resultsContainer}>
            
            {/* Overall Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons 
                  name={result.face_verified ? "checkmark-circle" : "close-circle"} 
                  size={48} 
                  color={result.face_verified ? "#4CAF50" : "#F44336"} 
                />
                <Text style={[styles.statusTitle, { color: result.face_verified ? "#4CAF50" : "#F44336" }]}>
                  {result.face_verified ? "Verification Successful" : "Verification Failed"}
                </Text>
              </View>
              <Text style={styles.statusMessage}>{result.message}</Text>
            </View>

            {/* Verification Details */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Verification Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Verification ID:</Text>
                <Text style={styles.detailValue}>{result.verification_id}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Face Match:</Text>
                <View style={styles.statusRow}>
                  <Ionicons 
                    name={result.face_verified ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={result.face_verified ? "#4CAF50" : "#F44336"} 
                  />
                  <Text style={[styles.statusText, { color: result.face_verified ? "#4CAF50" : "#F44336" }]}>
                    {result.face_verified ? "Match" : "No Match"}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence Score:</Text>
                <Text style={styles.detailValue}>{Math.round(result.face_confidence * 100)}%</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={styles.detailValue}>{result.status}</Text>
              </View>
            </View>

            {/* Extracted Information */}
            {result.extracted_info && (
              <View style={styles.extractedCard}>
                <Text style={styles.cardTitle}>Extracted Information</Text>
                {(() => {
                  const extractedData = parseExtractedInfo(result.extracted_info)
                  
                  if (extractedData.rawText) {
                    return (
                      <View style={styles.rawTextContainer}>
                        <Text style={styles.rawText}>{extractedData.rawText}</Text>
                      </View>
                    )
                  }
                  
                  return (
                    <View style={styles.extractedDataContainer}>
                      {Object.entries(extractedData).map(([key, value]) => (
                        <View key={key} style={styles.extractedRow}>
                          <Text style={styles.extractedLabel}>{key}:</Text>
                          <Text style={styles.extractedValue}>{String(value)}</Text>
                        </View>
                      ))}
                    </View>
                  )
                })()}
              </View>
            )}

            {/* Security Information */}
            <View style={styles.securityCard}>
              <Text style={styles.cardTitle}>Security & Privacy</Text>
              <View style={styles.securityRow}>
                <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                <Text style={styles.securityText}>All data processed securely</Text>
              </View>
              <View style={styles.securityRow}>
                <Ionicons name="lock-closed" size={20} color="#4CAF50" />
                <Text style={styles.securityText}>Images deleted after processing</Text>
              </View>
              <View style={styles.securityRow}>
                <Ionicons name="eye-off" size={20} color="#4CAF50" />
                <Text style={styles.securityText}>Zero-knowledge proof generated</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.continueButton]} 
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.retryButton]} 
                onPress={handleRetry}
              >
                <Text style={styles.retryButtonText}>Verify Again</Text>
              </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultsContainer: {
    gap: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  extractedCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rawTextContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  rawText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  extractedDataContainer: {
    gap: 12,
  },
  extractedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extractedLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  extractedValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  securityCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#2196F3',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  retryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default kycVerification