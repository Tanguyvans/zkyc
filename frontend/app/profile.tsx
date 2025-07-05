import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const Profile = () => {
  const userInfo = {
    name: 'Kunal Bhatia',
    email: 'kunal.bhatia@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    kycLevel: 'Level 2',
    verificationDate: 'Jan 15, 2024'
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
          onPress: () => {
            // Handle logout logic here
            router.replace('/')
          },
        },
      ]
    )
  }

  const settingsOptions = [
    {
      id: 1,
      title: 'Personal Information',
      icon: 'person-outline' as const,
      color: '#2196F3',
      onPress: () => console.log('Personal Information')
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
    // {
    //   id: 4,
    //   title: 'Connected Apps',
    //   icon: 'apps-outline' as const,
    //   color: '#9C27B0',
    //   onPress: () => router.push('/(company)/0')
    // },
    // {
    //   id: 5,
    //   title: 'Notifications',
    //   icon: 'notifications-outline' as const,
    //   color: '#F44336',
    //   onPress: () => console.log('Notifications')
    // },
    {
      id: 6,
      title: 'Help & Support',
      icon: 'help-circle-outline' as const,
      color: '#607D8B',
      onPress: () => console.log('Help & Support')
    }
  ]

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
            <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
              <View style={styles.kycBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.kycText}>Verified</Text>
              </View>
              <Text style={styles.walletAddress}>{userInfo.walletAddress}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>

          {/* Wallet Address Card */}

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
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 14,
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
      },
      userInfo: {
        flex: 1,
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
      },
      userEmail: {
        fontSize: 14,
        color: '#666',
      },
      kycBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
      },
      kycText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
      },
      editButton: {
        padding: 8,
      },
      walletCard: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 14,
        marginTop: 16,
      },
      walletHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      walletTitle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      walletAddress: {
        fontSize: 12,
        marginTop: 10,
        color: '#666',
        opacity: 0.7,
      },
      verificationDate: {
        fontSize: 12,
        color: '#666',
      },
      settingsSection: {
        marginTop: 16,
        gap: 10,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 14,
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
      },
      logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius: 14,
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
      },
})