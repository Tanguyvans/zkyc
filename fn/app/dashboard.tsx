import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Line } from 'react-native-svg'
import { router } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import { StatCard } from '../components'

const { width, height } = Dimensions.get('window')

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)
  
  const [userKycStatus] = useState({
    verified: true,
    verificationDate: '2024-01-15',
    level: 'Level 2',
    documents: ['ID Card', 'Selfie', 'Proof of Address']
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
      name: 'CryptoExchange Pro',
      logo: '🏦',
      status: 'approved',
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
      status: 'rejected',
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

  const copyWalletAddress = async () => {
    try {
      await Clipboard.setStringAsync(verificationDetails.walletAddress)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (error) {
      console.error('Failed to copy wallet address:', error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top User Greeting Card */}
      <View style={styles.greetingCard}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/44.jpg' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.goodMorning}>Good Morning</Text>
          <Text style={styles.userName}>Hi, Tanguy Vansnick</Text>
        </View>
        <TouchableOpacity style={{ marginLeft: 'auto' }}>
          <Ionicons name="menu" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Credit Card Glassmorphism Featured Card */}
      <TouchableOpacity style={styles.creditCardContainer} activeOpacity={0.9} onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={['rgba(30, 30, 30, 0.9)', 'rgb(10, 10, 10)']}
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

          {/* Circuitry lines (SVG) */}
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
              <Ionicons name="checkmark-circle" size={22} color="#4CAF50" style={{ marginRight: 6 }} />
              <Text style={styles.verifiedTag}>Verified</Text>
            </View>
            <Text style={styles.cardSubtitle}>0x1234567890abcdef1234567890abcdef12345678</Text>
            <Text style={styles.issuedText}>Issued: Jan 15, 2024</Text>
          </View>
          <View style={styles.playButton2}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>zKYC</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Proof Generation Buttons */}
      <View style={styles.proofButtonsContainer}>
        <TouchableOpacity style={styles.proofGenerationButton} onPress={() => router.push('/proof-generation')}>
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proofButtonGradient}
          >
            <Ionicons name="flash" size={24} color="#fff" />
            <Text style={styles.proofButtonText}>Quick Proof</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.proofGenerationButton} onPress={() => router.push('/proof-workflow')}>
          <LinearGradient
            colors={['#007AFF', '#0056CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proofButtonGradient}
          >
            <Ionicons name="shield-checkmark" size={24} color="#fff" />
            <Text style={styles.proofButtonText}>Guided Workflow</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView style={{ flex: 1 }}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="apps"
            iconColor="#2196F3"
            value={connectedApps.length}
            label="Connected"
            onPress={() => router.push('/(apps)/all')}
          />
          <StatCard
            icon="checkmark-circle"
            iconColor="#4CAF50"
            value={connectedApps.filter(app => app.status === 'approved').length}
            label="Approved"
            onPress={() => router.push('/(apps)/approved')}
          />
          <StatCard
            icon="time"
            iconColor="#FF9800"
            value={connectedApps.filter(app => app.status === 'pending').length}
            label="Pending"
            onPress={() => router.push('/(apps)/pending')}
          />
        </View>

        {/* Connected Apps Section */}
        <View style={styles.appsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Apps</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {connectedApps.map((app) => (
            <View key={app.id} style={styles.appCard}>
              <View style={styles.appIcon}>
                <Text style={styles.appIconText}>{app.logo}</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>{app.name}</Text>
                <Text style={styles.appAccess}>Last access: {app.lastAccess}</Text>
              </View>
              <View style={styles.appStatus}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
                  <Ionicons name={getStatusIcon(app.status)} size={16} color="#fff" />
                  <Text style={styles.statusText}>{app.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for verification details */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verification Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Wallet Address</Text>
              <TouchableOpacity onPress={copyWalletAddress} style={styles.addressContainer}>
                <Text style={styles.addressText}>{verificationDetails.walletAddress}</Text>
                <Ionicons name="copy" size={20} color="#666" />
              </TouchableOpacity>
              
              {copyFeedback && (
                <Text style={styles.copyFeedback}>Address copied to clipboard!</Text>
              )}
              
              <Text style={styles.modalLabel}>Issue Date</Text>
              <Text style={styles.modalValue}>{verificationDetails.issueDate}</Text>
              
              <Text style={styles.modalLabel}>Expiry Date</Text>
              <Text style={styles.modalValue}>{verificationDetails.expiryDate}</Text>
              
              <Text style={styles.modalLabel}>Verification Level</Text>
              <Text style={styles.modalValue}>{verificationDetails.verificationLevel}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  greetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  goodMorning: {
    fontSize: 16,
    color: '#666',
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
  },
  creditCardGradient: {
    height: 200,
    position: 'relative',
    padding: 20,
  },
  chipContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: '#ffd700',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
  },
  chipStripe: {
    width: 2,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  circuitryContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  cardContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  verifiedTag: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
  issuedText: {
    color: '#bbb',
    fontSize: 12,
  },
  playButton2: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  appsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  appCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  appIconText: {
    fontSize: 24,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appAccess: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  appStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    flex: 1,
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    marginTop: 15,
  },
  modalValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  copyFeedback: {
    color: '#4CAF50',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  proofButtonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  proofGenerationButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  proofButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  proofButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
})

export default Dashboard 