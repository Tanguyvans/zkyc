import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet  } from 'react-native';

// const mockCompanyData = {
//   zeph: { name: 'Zeph', description: 'AI BFF for health & wellness' },
//   roflbot: { name: 'RoflBot', description: 'Oracle bot for ROFL protocol' },
//   walletai: { name: 'WalletAI', description: 'AI-powered crypto wallet manager' },
// };

const mockCompanyData = [
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
]

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

export default function CompanyDetail() {
  const { id } = useLocalSearchParams();

  // If id is 0, show all companies
  if (Number(id) === 0) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#f7f7f7' }}>
        <View style={{ position: 'relative', flex: 1 }}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>

          <Text style={styles.header}>All Companies</Text>

          <View style={{ flex: 1 ,  padding: 20}}>
            {mockCompanyData.map((company) => (
              <TouchableOpacity 
                key={company.id} 
                style={styles.companyCard}
                onPress={() => router.push(`/(company)/${company.id}`)}
              >
                <View style={styles.companyHeader}>
                  <View style={styles.companyLogo}>
                    <Text style={styles.companyLogoText}>{company.logo}</Text>
                  </View>
                  <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{company.name}</Text>
                    <Text style={styles.companyKycLevel}>{company.kycLevel}</Text>
                    <Text style={styles.companyLastAccess}>
                      Last accessed: {company.lastAccess}
                    </Text>
                  </View>
                  <View style={styles.companyStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(company.status) }]}>
                      <Ionicons 
                        name={getStatusIcon(company.status)} 
                        size={12} 
                        color="#fff" 
                      />
                      <Text style={styles.statusText}>
                        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const company = mockCompanyData.find(company => company.id === Number(id));

  if (!company) {
    return <Text>Company not found</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#f7f7f7' }}>
      <View style={{ position: 'relative', flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.header}>{company.name}</Text>

        <View style={{ flex: 1,  borderRadius: 14, padding: 18 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>KYC Level</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{company.kycLevel}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Last Access</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{company.lastAccess}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Permissions</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{company.permissions.join(', ')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
      companyCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      },
      companyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      companyLogo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
      },
      companyLogoText: {
        fontSize: 24,
      },
      companyInfo: {
        flex: 1,
      },
      companyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
      },
      companyKycLevel: {
        fontSize: 14,
        color: '#2196F3',
        marginTop: 2,
      },
      companyLastAccess: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
      },
      companyStatus: {
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
});