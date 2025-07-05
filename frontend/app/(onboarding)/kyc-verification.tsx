import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { apiService } from '../../services/apiService'

const kycVerification = () => {
  const { selfieUri, idCardUri } = useLocalSearchParams()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState('Testing connection...')

  useEffect(() => {
    if (selfieUri && idCardUri) {
      verifyIdentity()
    } else {
      setError('Missing image URIs')
      setLoading(false)
    }
  }, [selfieUri, idCardUri])

  const verifyIdentity = async () => {
    try {
      setLoading(true)
      setError(null)

      // Step 1: Test connection
      setStep('Testing connection...')
      const isConnected = await apiService.testConnection()
      if (!isConnected) {
        throw new Error('Cannot connect to API server. Make sure Docker is running.')
      }

      // Step 2: Check health
      setStep('Checking API health...')
      const health = await apiService.healthCheck()
      console.log('Health check:', health)

      // Step 3: Verify identity
      setStep('Verifying identity...')
      const verificationResult = await apiService.verifyIDWithSelfie(
        idCardUri as string,
        selfieUri as string
      )
      
      console.log('Verification result:', verificationResult)
      setResult(verificationResult)
      
    } catch (err) {
      console.error('Verification error:', err)
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (result) {
      router.push('/dashboard')
    } else {
      // Go back to retry
      router.push('/kyc-selfie')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🔍</Text>
          <Text style={styles.title}>Verifying Identity</Text>
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

        {/* Success State */}
        {result && !loading && !error && (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Verification Complete!</Text>
            <Text style={styles.successMessage}>
              Your identity has been successfully verified.
            </Text>
            
            {/* Results */}
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Results:</Text>
              <Text style={styles.resultText}>
                Face Verified: {result.face_verified ? '✅ Yes' : '❌ No'}
              </Text>
              <Text style={styles.resultText}>
                Status: {result.status}
              </Text>
              <Text style={styles.resultText}>
                Confidence: {Math.round((result.face_confidence || 0) * 100)}%
              </Text>
              <Text style={styles.resultText}>
                Verification ID: {result.verification_id}
              </Text>
            </View>
          </View>
        )}

        {/* Continue Button */}
        {!loading && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>
              {result ? 'Continue to Dashboard' : 'Try Again'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    width: '100%',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default kycVerification