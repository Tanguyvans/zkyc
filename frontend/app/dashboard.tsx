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
    issueDate: userData.verificationDate,
    expiryDate: '2025-01-15',
    verificationLevel: 'Level 2',
    zkProofHash: userData.verificationResult?.verification_id || '0x9876543210fedcba',
    proofVerified: userData.isVerified,
    confidence: userData.verificationResult?.face_confidence || 0,
    extractedInfo: userData.verificationResult?.extracted_info || 'No data extracted',
    documents: [
      { 
        name: 'Government ID', 
        status: userData.verificationResult?.status === 'success' ? 'verified' : 'pending', 
        date: userData.verificationDate
      },
      { 
        name: 'Selfie Verification', 
        status: userData.isVerified ? 'verified' : 'pending', 
        date: userData.verificationDate
      }
    ],
    permissions: ['Identity Verification', 'Address Verification', 'Age Verification']
  })

  const [connectedApps] = useState([
    {
      id: 1,
      name: 'CryptoExchange Pro',
      logo: '🏦',
      status: userData.isVerified ? 'approved' : 'pending',
      lastAccess: '2024-01-20',
      permissions: ['Identity Verification', 'Address Verification'],
      kycLevel: 'Level 2'
    },
    {
      id: 2,
      name: 'DeFi Lending',
      logo: '💰',
      status: 'pending',
      lastAccess: '2024-01-18',
      permissions: ['Identity Verification'],
      kycLevel: 'Level 1'
    },
    {
      id: 4,
      name: 'Gaming Platform',
      logo: '🎮',
      status: userData.isVerified ? 'approved' : 'rejected',
      lastAccess: '2024-01-16',
      permissions: ['Age Verification'],
      kycLevel: 'Level 1'
    }
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

  const copyVerificationId = async () => {
    try {
      if (userData.verificationResult?.verification_id) {
        await Clipboard.setStringAsync(userData.verificationResult.verification_id)
        setCopyFeedback(true)
        setTimeout(() => setCopyFeedback(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy verification ID:', error)
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
      {/* Top User Greeting Card - Updated without avatar */}
      <View style={styles.greetingCardCentered}>
        <View style={styles.greetingContent}>
          <Text style={styles.goodMorning}>Good Morning</Text>
          <Text style={styles.userName}>Hi, {userData.name}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="menu" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Verification Status Card */}
      <TouchableOpacity style={styles.creditCardContainer} activeOpacity={0.9} onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={userData.isVerified ? 
            ['rgba(76, 175, 80, 0.9)', 'rgba(56, 142, 60, 1)'] : 
            ['rgba(255, 152, 0, 0.9)', 'rgba(245, 124, 0, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.creditCardGradient}
        >
          {/* Card chip icon */}
          <View style={styles.chipContainer}>
            <View style={styles.chip}>
              <View style={styles.chipStripe} />
              <View style={styles.chipStripe} />
              <View style={styles.chipStripe} />
            </View>
          </View>

          {/* Circuitry lines */}
          <View style={styles.circuitryContainer}>
            <Svg height="60" width="80">
              <Line x1="0" y1="10" x2="60" y2="10" stroke="#bbb" strokeWidth="2" />
              <Line x1="60" y1="10" x2="80" y2="30" stroke="#bbb" strokeWidth="2" />
              <Line x1="0" y1="30" x2="40" y2="30" stroke="#bbb" strokeWidth="2" />
              <Line x1="40" y1="30" x2="80" y2="50" stroke="#bbb" strokeWidth="2" />
            </Svg>
          </View>

          {/* Card content */}
          <View style={styles.cardContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons 
                name={userData.isVerified ? "checkmark-circle" : "time"} 
                size={22} 
                color="#fff" 
                style={{ marginRight: 6 }} 
              />
              <Text style={styles.verifiedTag}>
                {userData.isVerified ? 'Verified' : 'Pending'}
              </Text>
            </View>
            <Text style={styles.cardSubtitle}>
              Verification ID: {userData.verificationResult?.verification_id || 'N/A'}
            </Text>
            <Text style={styles.issuedText}>
              Confidence: {Math.round((userData.verificationResult?.face_confidence || 0) * 100)}%
            </Text>
          </View>
          <View style={styles.playButton2}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>zKYC</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Scrollable content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(apps)/all')}>
            <Ionicons name="apps" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{connectedApps.length}</Text>
            <Text style={styles.statLabel}>Connected</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(apps)/approved')}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>
              {connectedApps.filter(app => app.status === 'approved').length}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(apps)/pending')}>
            <Ionicons name="time" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>
              {connectedApps.filter(app => app.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
        </View>

        {/* Verification Details Section */}
        {userData.verificationResult && (
          <View style={styles.verificationSection}>
            <Text style={styles.sectionTitle}>Verification Details</Text>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, { color: userData.isVerified ? '#4CAF50' : '#FF9800' }]}>
                  {userData.isVerified ? 'Verified' : 'Pending'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence:</Text>
                <Text style={styles.detailValue}>{Math.round((userData.verificationResult.face_confidence || 0) * 100)}%</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Verification ID:</Text>
                <TouchableOpacity onPress={copyVerificationId} style={styles.copyContainer}>
                  <Text style={styles.detailValue}>{userData.verificationResult.verification_id}</Text>
                  <Ionicons 
                    name={copyFeedback ? "checkmark" : "copy"} 
                    size={16} 
                    color={copyFeedback ? "#4CAF50" : "#666"} 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{userData.verificationDate}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Connected Apps Section */}
        <View style={styles.appsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Apps</Text>
            <TouchableOpacity onPress={() => router.push(`/(company)/0`)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.appsScrollView}>
            {connectedApps.map((app) => (
              <TouchableOpacity 
                key={app.id} 
                style={styles.appCard}
                onPress={() => router.push(`/(company)/${app.id}`)}
              >
                <View style={styles.appHeader}>
                  <Text style={styles.appLogo}>{app.logo}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
                    <Ionicons name={getStatusIcon(app.status)} size={12} color="#fff" />
                  </View>
                </View>
                <Text style={styles.appName}>{app.name}</Text>
                <Text style={styles.appKycLevel}>{app.kycLevel}</Text>
                <Text style={styles.appLastAccess}>Last: {app.lastAccess}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modal for verification details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verification Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {userData.verificationResult && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Verification Status</Text>
                    <Text style={styles.modalText}>
                      Status: {userData.isVerified ? 'Verified ✅' : 'Pending ⏳'}
                    </Text>
                    <Text style={styles.modalText}>
                      Confidence: {Math.round((userData.verificationResult.face_confidence || 0) * 100)}%
                    </Text>
                    <Text style={styles.modalText}>
                      Verification ID: {userData.verificationResult.verification_id}
                    </Text>
                  </View>
                  
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Extracted Information</Text>
                    <Text style={styles.modalText}>
                      {userData.verificationResult.extracted_info || 'No data extracted'}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingCardCentered: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  greetingContent: {
    flex: 1,
  },
  goodMorning: {
    fontSize: 14,
    color: '#888',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  creditCardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  creditCardGradient: {
    padding: 20,
    height: 160,
    justifyContent: 'space-between',
  },
  chipContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },
  chipStripe: {
    width: 2,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  circuitryContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  verifiedTag: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  issuedText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  playButton2: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  verificationSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  appsScrollView: {
    paddingVertical: 8,
  },
  appCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appLogo: {
    fontSize: 24,
  },
  statusBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  appKycLevel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  appLastAccess: {
    fontSize: 10,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    maxHeight: 400,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
})

export default Dashboard