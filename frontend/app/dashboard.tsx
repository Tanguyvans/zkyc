import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Line } from 'react-native-svg'
import { router } from 'expo-router'
import * as Clipboard from 'expo-clipboard'

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
    issueDate: verificationResult?.timestamp ? new Date(verificationResult.timestamp).toLocaleDateString() : '2024-01-15',
    expiryDate: '2025-01-15',
    verificationLevel: 'Level 2',
    zkProofHash: verificationResult?.verification_id || '0x9876543210fedcba',
    proofVerified: verificationResult?.face_verified || false,
    confidence: verificationResult?.face_confidence || 0,
    extractedInfo: verificationResult?.extracted_info || 'No data extracted',
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
    // {
    //   id: 3,
    //   name: 'NFT Marketplace',
    //   logo: '🎨',
    //   status: 'approved',
    //   lastAccess: '2024-01-22',
    //   permissions: ['Identity Verification', 'Address Verification', 'Age Verification'],
    //   kycLevel: 'Level 2'
    // },
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
          <Text style={styles.userName}>Hi, Kunal Bhatia</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')} style={{ marginLeft: 'auto' }}>
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
          {/* Glass overlay */}
          <View style={{}} />

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
            {/* <Ionicons name="play" size={28} color="#fff" /> */}
            {/* <Image source={require('../assets/images/play.png')} style={{ width: 28, height: 28 }} /> */}
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>zKYC</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Scrollable content */}
      <View style={{ flex: 1 }}>
        <View>
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

          {/* Connected Apps Section */}
          <View style={styles.appsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Apps</Text>
              <TouchableOpacity onPress={() => router.push(`/(company)/0`)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {connectedApps.map((app) => (
              <TouchableOpacity key={app.id} style={styles.appCard} onPress={() => router.push(`/(company)/${app.id}`)}>
                <View style={styles.appHeader}>
                  <View style={styles.appLogo}>
                    <Text style={styles.appLogoText}>{app.logo}</Text>
                  </View>
                  <View style={styles.appInfo}>
                    <Text style={styles.appName}>{app.name}</Text>
                    {/* <Text style={styles.appKycLevel}>{app.kycLevel}</Text> */}
                    <Text style={styles.appLastAccess}>
                      Last accessed: {app.lastAccess}
                    </Text>
                  </View>
                  <View style={styles.appStatus}>
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
                </View>
                
                {/* <View style={styles.permissionsSection}>
                  <Text style={styles.permissionsTitle}>Permissions:</Text>
                  <View style={styles.permissionsList}>
                    {app.permissions.map((permission, index) => (
                      <View key={index} style={styles.permissionItem}>
                        <Ionicons name="key" size={12} color="#666" />
                        <Text style={styles.permissionText}>{permission}</Text>
                      </View>
                    ))}
                  </View>
                </View> */}
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          {/* <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="add-circle" size={24} color="#2196F3" />
                <Text style={styles.actionText}>Connect New App</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="settings" size={24} color="#666" />
                <Text style={styles.actionText}>KYC Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="document-text" size={24} color="#666" />
                <Text style={styles.actionText}>View Reports</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      </View>

      {/* Full Screen Verification Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Verification Details</Text>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>

            <View style={styles.creditCardContainer2}>
                <LinearGradient
                colors={['rgba(30,30,30,0.95)', 'rgba(10,10,10,0.85)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.creditCardGradient}
                >
                {/* Glass overlay */}
                <View style={{}} />

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
                    {/* <Ionicons name="play" size={28} color="#fff" /> */}
                    {/* <Image source={require('../assets/images/play.png')} style={{ width: 28, height: 28 }} /> */}
                    <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>zKYC</Text>
                </View>
                </LinearGradient>
            </View>

            {/* Verification Status Card */}
            {/* <View style={styles.verificationStatusCard}> */}
              {/* <LinearGradient
                colors={['#4CAF50', '#45a049']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statusGradient} */}
              {/* > */}
                {/* <View style={styles.statusContent}>
                  <Ionicons name="checkmark-circle" size={48} color="#fff" />
                  <Text style={styles.statusTitle}>Verified</Text>
                  {/* <Text style={styles.statusSubtitle}>Level 2 Verification</Text> */}
                {/* </View> */} 
              {/* </LinearGradient> */}
            {/* </View> */}

            {/* Wallet Address Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Wallet Address</Text>
              <View style={styles.walletCard}>
                <Ionicons name="wallet" size={20} color="#2196F3" />
                <Text style={styles.walletAddress}>{verificationDetails.walletAddress}</Text>
                <TouchableOpacity style={styles.copyButton} onPress={() => {}}>
                  <Ionicons 
                    name={copyFeedback ? "checkmark" : "copy"} 
                    size={16} 
                    color={copyFeedback ? "#4CAF50" : "#fff"} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* zK Proof Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Zero-Knowledge Proof</Text>
              <View style={styles.proofCard}>
                <View style={styles.proofHeader}>
                  <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                  <Text style={styles.proofStatus}>Proof Verified</Text>
                </View>
                <Text style={styles.proofHash}>{verificationDetails.zkProofHash}</Text>
                <Text style={styles.proofDescription}>
                  This proof verifies your identity without revealing any personal information
                </Text>
              </View>
            </View>

            {/* Dates Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Verification Dates</Text>
              <View style={styles.datesContainer}>
                <View style={styles.dateCard}>
                  <Ionicons name="calendar" size={20} color="#FF9800" />
                  <Text style={styles.dateLabel}>Issue Date</Text>
                  <Text style={styles.dateValue}>{verificationDetails.issueDate}</Text>
                </View>
                <View style={styles.dateCard}>
                  <Ionicons name="time" size={20} color="#F44336" />
                  <Text style={styles.dateLabel}>Expiry Date</Text>
                  <Text style={styles.dateValue}>{verificationDetails.expiryDate}</Text>
                </View>
              </View>
            </View>

            {/* Documents Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Verified Documents</Text>
              {verificationDetails.documents.map((doc, index) => (
                <View key={index} style={styles.documentCard}>
                  <View style={styles.documentHeader}>
                    <Ionicons name="document-text" size={20} color="#4CAF50" />
                    <Text style={styles.documentName}>{doc.name}</Text>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark" size={12} color="#fff" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  </View>
                  <Text style={styles.documentDate}>Verified on {doc.date}</Text>
                </View>
              ))}
            </View>

            {/* Permissions Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Granted Permissions</Text>
              <View style={styles.permissionsContainer}>
                {verificationDetails.permissions.map((permission, index) => (
                  <View key={index} style={styles.permissionCard}>
                    <Ionicons name="key" size={16} color="#2196F3" />
                    <Text style={styles.permissionText}>{permission}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40}}>
              <TouchableOpacity style={styles.primaryButton}>
                <Ionicons name="download" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Download Proof</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="share" size={20} color="#2196F3" />
                <Text style={styles.secondaryButtonText}>Share Verification</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
  },
  goodMorning: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  userName: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  creditCardContainer: {
    marginHorizontal: 20,
    borderRadius: 24,
    marginBottom: 24,
    minHeight: 220,
    overflow: 'hidden',
    position: 'relative',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  creditCardContainer2: {
    marginHorizontal: 10,
    borderRadius: 24,
    marginBottom: 24,
    minHeight: 220,
    overflow: 'hidden',
    position: 'relative',
    elevation: 6,
    borderWidth: .2,
    borderColor: '#f0f0f0',
  },
  creditCardGradient: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'flex-end',
    minHeight: 200,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.11)',
    borderRadius: 24,
    zIndex: 1,
  },
  chipContainer: {
    position: 'absolute',
    top: 32,
    right: 32,
    zIndex: 3,
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#e0c97f',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  chipStripe: {
    width: 28,
    height: 3,
    backgroundColor: '#bfa14a',
    marginVertical: 2,
    borderRadius: 2,
  },
  circuitryContainer: {
    position: 'absolute',
    left: 18,
    top: 40,
    zIndex: 2,
    opacity: 0.5,
  },
  verifiedTag: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  issuedText: {
    color: '#bbb',
    fontSize: 13,
    marginTop: 10,
    fontStyle: 'italic',
  },
  cardContent: {
    zIndex: 2,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.6,
  },
  playButton2: {
    position: 'absolute',
    right: 20,
    bottom: 0,
    // backgroundColor: '#222',
    width: 54,
    height: 54,
    // borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    opacity: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
},
  appsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    // padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  appCard: {
    // borderWidth: 1,
    // borderColor: '#f0f0f0',
    padding: 5,
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appLogo: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  appLogoText: {
    fontSize: 24,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appKycLevel: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 2,
  },
  appLastAccess: {
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
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  permissionsSection: {
    marginTop: 8,
  },
  permissionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  permissionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 4,
  },
  permissionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  quickActions: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  modalContent: {
    padding: 15,
  },
  verificationStatusCard: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusGradient: {
    flex: 1,
    padding: 16,
  },
  statusContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 20,
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
  copyButton: {
    padding: 8,
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
  proofHash: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 8,
  },
  proofDescription: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 8,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateCard: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  documentCard: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  documentDate: {
    fontSize: 12,
    color: '#ccc',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  verifiedText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  permissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
    marginBottom: 8,
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