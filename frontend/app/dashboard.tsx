import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Line } from 'react-native-svg'
import { router } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width, height } = Dimensions.get('window')

interface VerificationResult {
  verification_id: string;
  face_verified: boolean;
  face_confidence: number;
  extracted_info: string;
  status: string;
  message: string;
  timestamp: string;
}

interface UserData {
  name: string;
  verificationResult: VerificationResult | null;
  isVerified: boolean;
  verificationDate: string;
}

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // User data state
  const [userData, setUserData] = useState<UserData>({
    name: 'User',
    verificationResult: null,
    isVerified: false,
    verificationDate: new Date().toLocaleDateString()
  })

  // Load user data from storage
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const storedResult = await AsyncStorage.getItem('verificationResult')
      const storedUser = await AsyncStorage.getItem('userData')
      
      let verificationResult = null
      let existingUserData = null
      
      if (storedResult) {
        verificationResult = JSON.parse(storedResult)
      }
      
      if (storedUser) {
        existingUserData = JSON.parse(storedUser)
      }
      
      // Extract name from verification result if available
      const extractedName = getNameFromVerification(verificationResult)
      
      const newUserData: UserData = {
        name: existingUserData?.name || extractedName || 'User',
        verificationResult: verificationResult,
        isVerified: verificationResult?.face_verified || false,
        verificationDate: verificationResult?.timestamp 
          ? new Date(verificationResult.timestamp).toLocaleDateString() 
          : new Date().toLocaleDateString()
      }
      
      setUserData(newUserData)
      
      // Save updated user data
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData))
      
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNameFromVerification = (verificationResult: VerificationResult | null) => {
    if (verificationResult?.extracted_info) {
      console.log('Extracting name from:', verificationResult.extracted_info)
      
      try {
        // Clean up markdown formatting if present
        let cleanedInfo = verificationResult.extracted_info.trim()
        
        // Remove markdown code block markers
        if (cleanedInfo.startsWith('```json')) {
          cleanedInfo = cleanedInfo.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanedInfo.startsWith('```')) {
          cleanedInfo = cleanedInfo.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        
        console.log('Cleaned info for parsing:', cleanedInfo)
        
        // Try parsing as JSON
        const info = JSON.parse(cleanedInfo)
        console.log('Parsed verification info:', info)
        
        // Try multiple possible name fields
        const possibleNameFields = [
          'Name', 'name', 'full_name', 'fullName', 'Full Name',
          'firstName', 'first_name', 'First Name',
          'given_name', 'givenName', 'Given Name',
          'nom', 'nombre', 'nome', 'naam'
        ]
        
        for (const field of possibleNameFields) {
          if (info[field] && typeof info[field] === 'string') {
            console.log('Found name in field:', field, '=', info[field])
            return info[field].trim()
          }
        }
        
        // If no name field found, check if it's an object with nested properties
        for (const key in info) {
          if (typeof info[key] === 'object' && info[key] !== null) {
            for (const field of possibleNameFields) {
              if (info[key][field]) {
                console.log('Found nested name:', info[key][field])
                return info[key][field].trim()
              }
            }
          }
        }
        
      } catch (e) {
        console.log('JSON parse failed, trying text extraction:', e)
        
        // If JSON parsing fails, try regex patterns on raw text
        const text = verificationResult.extracted_info
        const namePatterns = [
          /Name[:\s]+([A-Za-z\s]+?)(?:\n|$|[,;])/i,
          /Full Name[:\s]+([A-Za-z\s]+?)(?:\n|$|[,;])/i,
          /First Name[:\s]+([A-Za-z\s]+?)(?:\n|$|[,;])/i,
          /Given Name[:\s]+([A-Za-z\s]+?)(?:\n|$|[,;])/i,
          /Nom[:\s]+([A-Za-z\s]+?)(?:\n|$|[,;])/i,
          /Nombre[:\s]+([A-Za-z\s]+?)(?:\n|$|[,;])/i,
        ]
        
        for (const pattern of namePatterns) {
          const match = text.match(pattern)
          if (match && match[1] && match[1].trim().length > 1) {
            const extractedName = match[1].trim()
            console.log('Extracted name from text pattern:', extractedName)
            return extractedName
          }
        }
      }
    }
    
    console.log('No name found, returning null')
    return null
  }

  const [userKycStatus] = useState({
    verified: userData.isVerified,
    verificationDate: userData.verificationDate,
    level: 'Level 2',
    documents: ['ID Card', 'Selfie']
  })

  const [verificationDetails] = useState({
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    verificationLevel: 'Level 2',
    zkProofHash: '0x9876543210fedcba9876543210fedcba98765432',
    proofVerified: true,
    documents: [
      { name: 'Government ID', status: 'verified', date: '2024-01-10' },
      { name: 'Selfie Verification', status: 'verified', date: '2024-01-12' },
      { name: 'Proof of Address', status: 'verified', date: '2024-01-14' }
    ],
    permissions: ['Identity Verification', 'Address Verification', 'Age Verification']
  })

  const [connectedApps] = useState([
    {
      id: 1,
      name: 'Zeph',
      logo: '🚀',
      status: 'approved',
      lastAccess: '2024-01-20',
      permissions: ['Identity Verification', 'Address Verification'],
      kycLevel: 'Level 2'
    },
    {
      id: 2,
      name: 'RoflBot',
      logo: '🤖',
      status: 'pending',
      lastAccess: '2024-01-18',
      permissions: ['Identity Verification'],
      kycLevel: 'Level 1'
    },
    {
      id: 3,
      name: 'WalletAI',
      logo: '🧠',
      status: 'approved',
      lastAccess: '2024-01-22',
      permissions: ['Identity Verification', 'Address Verification'],
      kycLevel: 'Level 2'
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4CAF50'
      case 'pending': return '#FF9800'
      case 'rejected': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'checkmark-circle'
      case 'pending': return 'time'
      case 'rejected': return 'close-circle'
      default: return 'help-circle'
    }
  }

  const copyWalletAddress = async () => {
    try {
      await Clipboard.setStringAsync(verificationDetails.walletAddress)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (error) {
      console.error('Failed to copy wallet address:', error)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userAddress}>0x1234...5678</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/profile')}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* KYC Status Card */}
        <TouchableOpacity 
          style={styles.kycCard} 
          activeOpacity={0.9} 
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={['rgba(76, 175, 80, 0.1)', 'rgba(76, 175, 80, 0.05)']}
            style={styles.kycCardGradient}
          >
            <View style={styles.kycCardHeader}>
              <View style={styles.kycStatusBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                <Text style={styles.kycStatusText}>Verified</Text>
              </View>
              <TouchableOpacity style={styles.kycCardAction}>
                <Ionicons name="eye-outline" size={20} color="#667eea" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.kycCardContent}>
              <Text style={styles.kycCardTitle}>Zero-Knowledge Identity</Text>
              <Text style={styles.kycCardSubtitle}>
                Your identity is verified without exposing personal data
              </Text>
              <View style={styles.kycCardDetails}>
                <View style={styles.kycDetail}>
                  <Text style={styles.kycDetailLabel}>Issue Date</Text>
                  <Text style={styles.kycDetailValue}>{verificationDetails.issueDate}</Text>
                </View>
                <View style={styles.kycDetail}>
                  <Text style={styles.kycDetailLabel}>Level</Text>
                  <Text style={styles.kycDetailValue}>{verificationDetails.verificationLevel}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard} 
            onPress={() => router.push('/(apps)/all')}
          >
            <View style={[styles.statIcon, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
              <Ionicons name="apps" size={24} color="#2196F3" />
            </View>
            <Text style={styles.statNumber}>{connectedApps.length}</Text>
            <Text style={styles.statLabel}>Connected Apps</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statCard} 
            onPress={() => router.push('/(apps)/approved')}
          >
            <View style={[styles.statIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.statNumber}>
              {connectedApps.filter(app => app.status === 'approved').length}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statCard} 
            onPress={() => router.push('/(apps)/pending')}
          >
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
              <Ionicons name="time" size={24} color="#FF9800" />
            </View>
            <Text style={styles.statNumber}>
              {connectedApps.filter(app => app.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Apps Section */}
        <View style={styles.appsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Apps</Text>
            <TouchableOpacity onPress={() => router.push('/(apps)/all')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {connectedApps.slice(0, 3).map((app) => (
            <TouchableOpacity 
              key={app.id} 
              style={styles.appCard} 
              onPress={() => router.push(`/(company)/${app.id}`)}
            >
              <View style={styles.appHeader}>
                <View style={styles.appLogo}>
                  <Text style={styles.appLogoText}>{app.logo}</Text>
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appLastAccess}>
                    Last accessed: {app.lastAccess}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
                  <Ionicons 
                    name={getStatusIcon(app.status)} 
                    size={12} 
                    color="#fff" 
                  />
                  <Text style={styles.statusText}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="add-circle" size={24} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>Connect App</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                <Ionicons name="document-text" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>View Proofs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="settings" size={24} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                <Ionicons name="help-circle" size={24} color="#F44336" />
              </View>
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Verification Details Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={['#1a1a1a', '#2d2d2d']}
            style={styles.modalGradient}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Verification Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Verification Status */}
              <View style={styles.modalStatusCard}>
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.modalStatusGradient}
                >
                  <Ionicons name="shield-checkmark" size={48} color="#fff" />
                  <Text style={styles.modalStatusTitle}>Verified Identity</Text>
                  <Text style={styles.modalStatusSubtitle}>Zero-Knowledge Proof</Text>
                </LinearGradient>
              </View>

              {/* Wallet Address */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Wallet Address</Text>
                <TouchableOpacity style={styles.walletCard} onPress={copyWalletAddress}>
                  <Ionicons name="wallet" size={20} color="#2196F3" />
                  <Text style={styles.walletAddress}>
                    0x1234...5678
                  </Text>
                  <Ionicons 
                    name={copyFeedback ? "checkmark" : "copy"} 
                    size={16} 
                    color={copyFeedback ? "#4CAF50" : "#ccc"} 
                  />
                </TouchableOpacity>
              </View>

              {/* ZK Proof */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Zero-Knowledge Proof</Text>
                <View style={styles.proofCard}>
                  <View style={styles.proofHeader}>
                    <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                    <Text style={styles.proofStatus}>Proof Verified</Text>
                  </View>
                  <Text style={styles.proofDescription}>
                    This cryptographic proof verifies your identity without revealing any personal information
                  </Text>
                </View>
              </View>

              {/* Documents */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Verified Documents</Text>
                {verificationDetails.documents.map((doc, index) => (
                  <View key={index} style={styles.documentCard}>
                    <Ionicons name="document-text" size={20} color="#4CAF50" />
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentDate}>Verified on {doc.date}</Text>
                    </View>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    </View>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Ionicons name="download" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Download Proof</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Ionicons name="share" size={20} color="#2196F3" />
                  <Text style={styles.secondaryButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userAddress: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  kycCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  kycCardGradient: {
    padding: 20,
    backgroundColor: '#fff',
  },
  kycCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  kycStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
  },
  kycStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 6,
  },
  kycCardAction: {
    padding: 8,
  },
  kycCardContent: {
    
  },
  kycCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  kycCardSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  kycCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kycDetail: {
    
  },
  kycDetailLabel: {
    fontSize: 12,
    color: '#999',
  },
  kycDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  appsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  appCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appLogoText: {
    fontSize: 20,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appLastAccess: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  quickActions: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalStatusCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalStatusGradient: {
    padding: 24,
    alignItems: 'center',
  },
  modalStatusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  modalStatusSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  walletAddress: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
  },
  proofCard: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  proofHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  proofStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  proofDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  documentDate: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 12,
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    marginLeft: 8,
  },
})

export default Dashboard