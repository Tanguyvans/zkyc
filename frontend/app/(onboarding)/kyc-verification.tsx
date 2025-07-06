import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { apiService } from '../../services/apiService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

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
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={32} color="#fff" />
            </View>
            <Text style={styles.title}>Identity Verification</Text>
            {loading && <Text style={styles.subtitle}>Processing your documents securely...</Text>}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
              style={styles.loadingCard}
            >
              <ActivityIndicator size="large" color="#667eea" />
              <Text style={styles.loadingText}>{step}</Text>
              <View style={styles.loadingSteps}>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepDot, { backgroundColor: '#667eea' }]} />
                  <Text style={styles.stepText}>Uploading</Text>
                </View>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepDot, { backgroundColor: loading ? '#667eea' : '#e0e0e0' }]} />
                  <Text style={styles.stepText}>Processing</Text>
                </View>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepDot, { backgroundColor: result ? '#4CAF50' : '#e0e0e0' }]} />
                  <Text style={styles.stepText}>Complete</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <LinearGradient
              colors={['rgba(244, 67, 54, 0.1)', 'rgba(244, 67, 54, 0.05)']}
              style={styles.errorCard}
            >
              <View style={styles.errorIcon}>
                <Ionicons name="close-circle" size={48} color="#F44336" />
              </View>
              <Text style={styles.errorTitle}>Verification Failed</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={verifyIdentity}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.retryButtonGradient}
                >
                  <Ionicons name="refresh" size={20} color="#fff" />
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Success State */}
        {result && !loading && !error && (
          <View style={styles.resultsContainer}>
            
            {/* Success Status Card */}
            <View style={styles.statusContainer}>
              <LinearGradient
                colors={result.face_verified ? ['#4CAF50', '#45a049'] : ['#F44336', '#e53935']}
                style={styles.statusCard}
              >
                <Ionicons 
                  name={result.face_verified ? "checkmark-circle" : "close-circle"} 
                  size={48} 
                  color="#fff" 
                />
                <Text style={styles.statusTitle}>
                  {result.face_verified ? "Identity Verified!" : "Verification Failed"}
                </Text>
                <Text style={styles.statusSubtitle}>
                  {result.face_verified ? "Your identity has been successfully verified" : "Please try again with clearer images"}
                </Text>
              </LinearGradient>
            </View>

            {/* Verification Details */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Verification Details</Text>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="finger-print" size={20} color="#667eea" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Verification ID</Text>
                  <Text style={styles.detailValue}>{result.verification_id}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="people" size={20} color="#667eea" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Face Match</Text>
                  <View style={styles.matchResult}>
                    <Ionicons 
                      name={result.face_verified ? "checkmark-circle" : "close-circle"} 
                      size={16} 
                      color={result.face_verified ? "#4CAF50" : "#F44336"} 
                    />
                    <Text style={[styles.matchText, { color: result.face_verified ? "#4CAF50" : "#F44336" }]}>
                      {result.face_verified ? "Match" : "No Match"}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="analytics" size={20} color="#667eea" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Confidence Score</Text>
                  <Text style={styles.detailValue}>{Math.round(result.face_confidence * 100)}%</Text>
                </View>
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
                        <Ionicons name="document-text" size={20} color="#667eea" />
                        <Text style={styles.rawText}>{extractedData.rawText}</Text>
                      </View>
                    )
                  }
                  
                  return (
                    <View style={styles.extractedDataContainer}>
                      {Object.entries(extractedData).map(([key, value]) => (
                        <View key={key} style={styles.extractedItem}>
                          <Text style={styles.extractedLabel}>{key}</Text>
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
              <View style={styles.securityItems}>
                <View style={styles.securityItem}>
                  <View style={styles.securityIcon}>
                    <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.securityText}>All data processed securely</Text>
                </View>
                <View style={styles.securityItem}>
                  <View style={styles.securityIcon}>
                    <Ionicons name="lock-closed" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.securityText}>Images deleted after processing</Text>
                </View>
                <View style={styles.securityItem}>
                  <View style={styles.securityIcon}>
                    <Ionicons name="eye-off" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.securityText}>Zero-knowledge proof generated</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.primaryButtonGradient}
                >
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Continue to Dashboard</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={handleRetry}>
                <View style={styles.secondaryButtonContent}>
                  <Ionicons name="refresh" size={20} color="#667eea" />
                  <Text style={styles.secondaryButtonText}>Verify Again</Text>
                </View>
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
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -15,
  },
  loadingContainer: {
    marginBottom: 20,
  },
  loadingCard: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    fontWeight: '600',
  },
  loadingSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorCard: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultsContainer: {
    gap: 20,
    paddingBottom: 40,
  },
  statusContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusCard: {
    padding: 30,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  statusSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  matchResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  extractedCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rawTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  rawText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  extractedDataContainer: {
    gap: 12,
  },
  extractedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  securityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  securityItems: {
    gap: 12,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
})

export default kycVerification