import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockApps = [
  { id: '1', name: 'Zeph', status: 'approved' },
  { id: '2', name: 'RoflBot', status: 'pending' },
  { id: '3', name: 'WalletAI', status: 'approved' },
  { id: '4', name: 'TaxSaver', status: 'pending' },
];

export default function FilteredAppsScreen() {
  const { filter } = useLocalSearchParams(); // Comes from the route e.g. /apps/approved

  // Only show approved apps
  const approvedApps = mockApps.filter(app => app.status === 'approved');
  const pendingApps = mockApps.filter(app => app.status === 'pending');
  const allApps = mockApps;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      <View style={{ position: 'relative', flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>{filter === 'approved' ? 'Approved' : filter === 'pending' ? 'Pending' : 'All'} Apps</Text>
        <FlatList
          data={filter === 'approved' ? approvedApps : filter === 'pending' ? pendingApps : allApps}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => {
            // Determine badge color, icon, and text based on item.status
            let badgeBg = '#e0e0e0';
            let icon = 'help-circle';
            let iconColor = '#aaa';
            let statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
            let textColor = '#888';

            if (item.status === 'approved') {
              badgeBg = '#e8f5e9';
              icon = 'checkmark-circle';
              iconColor = '#4CAF50';
              textColor = '#4CAF50';
            } else if (item.status === 'pending') {
              badgeBg = '#ffe0b2';
              icon = 'time';
              iconColor = '#FF9800';
              textColor = '#FF9800';
            } else if (item.status === 'rejected') {
              badgeBg = '#ffebee';
              icon = 'close-circle';
              iconColor = '#F44336';
              textColor = '#F44336';
            }

            return (
              <View style={styles.appCard}>
                <Text style={styles.appName}>{item.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                  <Ionicons name={icon as any} size={16} color={iconColor} />
                  <Text style={[styles.statusText, { color: textColor }]}>{statusText}</Text>
                </View>
              </View>
            );
          }}
        />
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
  appCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#e8f5e9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    // color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 13,
  },
});
