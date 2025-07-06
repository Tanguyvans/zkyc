import { router } from "expo-router";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height:'100%'
      }}
    >
      <View style={{ flex: 1, justifyContent: "flex-end",  padding: 20, height:'50%', width:'100%' }}>
        <Text style={{ fontSize: 32,color: 'rgba(0,0,0,0.5)' }}>Verify Once,</Text>
        <Text style={{ fontSize: 32,color: 'rgba(0,0,0,0.5)'}}>Prove Anything,</Text>
        <Text style={{ fontSize: 32, color: 'rgba(0,0,0,0.5)' }}>Reveal Nothing.</Text>
        <Text style={{ fontSize: 32, color: 'rgba(0,0,0,1)', fontWeight: 'bold' }}>Own Your Identity.</Text>
      </View>
      <View style={{ flex: 1,  justifyContent: "flex-end", alignItems: "flex-end", padding: 20, height:'50%', width:'100%' }}>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => {
            // Navigate to login first, then login will handle going to KYC
            router.push('/(auth)/login');
          }}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
