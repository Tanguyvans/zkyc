import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

interface ExtractedInfo {
  name?: string | null
  surname?: string | null
  idNumber?: string | null
  dateOfBirth?: string | null
  nationality?: string | null
  documentType?: string | null
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState('')

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
      
      // Extract info from verification result
      const extractedInfo = getExtractedInfo(verificationResult)
      
      const newUserData: UserData = {
        name: existingUserData?.name || extractedInfo.name || 'User',
        verificationResult: verificationResult,
        isVerified: verificationResult?.face_verified || false,
        verificationDate: verificationResult?.timestamp 
          ? new Date(verificationResult.timestamp).toLocaleDateString() 
          : ''
      }
      
      setUserData(newUserData)
      
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getExtractedInfo = (verificationResult: VerificationResult | null): ExtractedInfo => {
    if (verificationResult?.extracted_info) {
      try {
        // Clean up markdown formatting if present
        let cleanedInfo = verificationResult.extracted_info.trim()
        
        // Remove markdown code block markers
        if (cleanedInfo.startsWith('```json')) {
          cleanedInfo = cleanedInfo.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanedInfo.startsWith('```')) {
          cleanedInfo = cleanedInfo.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
        
        console.log('Parsing cleaned extracted info:', cleanedInfo)
        const info = JSON.parse(cleanedInfo)
        
        return {
          name: info.Name || info.name || info.full_name || info.firstName || null,
          surname: info.Surname || info.surname || info.lastName || null,
          idNumber: info['ID Number'] || info.id_number || info.documentNumber || null,
          dateOfBirth: info['Date of Birth'] || info.dateOfBirth || info.dob || null,
          nationality: info.Nationality || info.nationality || null,
          documentType: info['Document Type'] || info.documentType || null
        }
      } catch (e) {
        console.log('Failed to parse extracted info:', e)
        return {}
      }
    }
    return {}
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear()
              router.replace('/')
            } catch (error) {
              console.error('Error during logout:', error)
            }
          },
        },
      ]
    )
  }

  const clearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all your verification data. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear()
              setUserData(null)
              router.replace('/')
            } catch (error) {
              console.error('Error clearing data:', error)
            }
          },
        },
      ]
    )
  }

  const settingsOptions = [
    {
      id: 1,
      title: 'Re-verify Identity',
      icon: 'refresh-outline' as const,
      color: '#2196F3',
      onPress: () => router.push('/(onboarding)/kyc')
    },
    {
      id: 2,
      title: 'Security Settings',
      icon: 'shield-checkmark-outline' as const,
      color: '#4CAF50',
      onPress: () => console.log('Security Settings')
    },
    {
      id: 3,
      title: 'Privacy & Data',
      icon: 'lock-closed-outline' as const,
      color: '#FF9800',
      onPress: () => console.log('Privacy & Data')
    },
    {
      id: 4,
      title: 'Clear All Data',
      icon: 'trash-outline' as const,
      color: '#F44336',
      onPress: clearData
    },
    {
      id: 5,
      title: 'Help & Support',
      icon: 'help-circle-outline' as const,
      color: '#607D8B',
      onPress: () => console.log('Help & Support')
    }
  ]

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const extractedInfo = getExtractedInfo(userData?.verificationResult || null)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      <View style={{ position: 'relative', flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.header}>Profile</Text>

        <View style={styles.container}>
          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              {editingName ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <View style={styles.nameEditButtons}>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={async () => {
                        if (tempName.trim()) {
                          const updatedUserData = { 
                            ...userData, 
                            name: tempName.trim() 
                          } as UserData
                          setUserData(updatedUserData)
                          await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData))
                          setEditingName(false)
                        }
                      }}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => {
                        setEditingName(false)
                        setTempName('')
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{userData?.name || 'User'}</Text>
                  <TouchableOpacity 
                    style={styles.editNameButton}
                    onPress={() => {
                      setTempName(userData?.name || '')
                      setEditingName(true)
                    }}
                  >
                    <Ionicons name="pencil" size={16} color="#2196F3" />
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Only show verification status if we have data */}
              {userData?.verificationResult && (
                <View style={styles.kycBadge}>
                  <Ionicons 
                    name={userData.isVerified ? "checkmark-circle" : "time"} 
                    size={16} 
                    color={userData.isVerified ? "#4CAF50" : "#FF9800"} 
                  />
                  <Text style={styles.kycText}>
                    {userData.isVerified ? 'Verified' : 'Pending'}
                  </Text>
                </View>
              )}
              
              {/* Only show verification date if we have it */}
              {userData?.verificationDate && (
                <Text style={styles.verificationDate}>
                  Verified: {userData.verificationDate}
                </Text>
              )}
            </View>
          </View>

          {/* Verification Details Card - Only show if we have verification data */}
          {userData?.verificationResult && (
            <View style={styles.verificationCard}>
              <Text style={styles.cardTitle}>Verification Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Verification ID:</Text>
                <Text style={styles.detailValue}>{userData.verificationResult.verification_id}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence:</Text>
                <Text style={styles.detailValue}>
                  {Math.round(userData.verificationResult.face_confidence * 100)}%
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={styles.detailValue}>{userData.verificationResult.status}</Text>
              </View>
            </View>
          )}

          {/* Extracted Information Card - Only show if we have extracted data */}
          {extractedInfo && Object.keys(extractedInfo).some(key => extractedInfo[key]) && (
            <View style={styles.extractedCard}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              
              {extractedInfo.name && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{extractedInfo.name}</Text>
                </View>
              )}
              
              {extractedInfo.surname && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Surname:</Text>
                  <Text style={styles.infoValue}>{extractedInfo.surname}</Text>
                </View>
              )}
              
              {extractedInfo.dateOfBirth && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date Of Birth:</Text>
                  <Text style={styles.infoValue}>{extractedInfo.dateOfBirth}</Text>
                </View>
              )}
              
              {extractedInfo.idNumber && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ID Number:</Text>
                  <Text style={styles.infoValue}>{extractedInfo.idNumber}</Text>
                </View>
              )}
              
              {extractedInfo.nationality && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nationality:</Text>
                  <Text style={styles.infoValue}>{extractedInfo.nationality}</Text>
                </View>
              )}
              
              {extractedInfo.documentType && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Document Type:</Text>
                  <Text style={styles.infoValue}>{extractedInfo.documentType}</Text>
                </View>
              )}
            </View>
          )}

          {/* Settings Options */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {settingsOptions.map((option) => (
              <TouchableOpacity key={option.id} style={styles.settingItem} onPress={option.onPress}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                    <Ionicons name={option.icon} size={20} color={option.color} />
                  </View>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#F44336" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 18,
    textAlign: 'center',
    color: '#222',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  kycText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  verificationDate: {
    fontSize: 12,
    color: '#666',
  },
  verificationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  extractedCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
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
    flex: 1,
    textAlign: 'right',
  },
  settingsSection: {
    marginTop: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 16,
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#F44336',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameEditContainer: {
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  nameEditButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
  },
  editNameButton: {
    padding: 4,
  },
  debugCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
})