import { router } from "expo-router";
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Simple animation delay
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#4c63d2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background decorative elements */}
        <View style={styles.backgroundElements}>
          <View style={[styles.floatingElement, styles.element1]} />
          <View style={[styles.floatingElement, styles.element2]} />
          <View style={[styles.floatingElement, styles.element3]} />
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Logo/Icon Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.logoGradient}
              >
                <Ionicons name="shield-checkmark" size={60} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.appName}>zKYC</Text>
          </View>

          {/* Hero text */}
          <View style={styles.heroSection}>
            <View style={styles.heroText}>
              <Text style={[styles.heroLine, styles.heroLine1]}>Verify Once,</Text>
              <Text style={[styles.heroLine, styles.heroLine2]}>Prove Anything,</Text>
              <Text style={[styles.heroLine, styles.heroLine3]}>Reveal Nothing.</Text>
              <Text style={[styles.heroLine, styles.heroMainLine]}>Own Your Identity.</Text>
            </View>
            
            <Text style={styles.subtitle}>
              Zero-knowledge identity verification for the decentralized world
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <View style={styles.feature}>
              <Ionicons name="eye-off" size={20} color="rgba(255,255,255,0.9)" />
              <Text style={styles.featureText}>Privacy First</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="shield-checkmark" size={20} color="rgba(255,255,255,0.9)" />
              <Text style={styles.featureText}>Secure Proofs</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="infinite" size={20} color="rgba(255,255,255,0.9)" />
              <Text style={styles.featureText}>Reusable</Text>
            </View>
          </View>
        </View>

        {/* Action button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.startButton, animationComplete && styles.startButtonAnimated]}
            onPress={() => {
              router.push('/(auth)/login');
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.learnMoreButton}
            onPress={() => {
              // Could link to about page or documentation
              router.push('/(auth)/login');
            }}
          >
            <Text style={styles.learnMoreText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  element1: {
    width: 120,
    height: 120,
    top: '10%',
    right: '15%',
  },
  element2: {
    width: 80,
    height: 80,
    top: '25%',
    left: '10%',
  },
  element3: {
    width: 60,
    height: 60,
    bottom: '30%',
    right: '20%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    zIndex: 1,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  heroSection: {
    marginBottom: 40,
  },
  heroText: {
    marginBottom: 20,
  },
  heroLine: {
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 40,
    marginBottom: 4,
  },
  heroLine1: {
    color: 'rgba(255,255,255,0.7)',
  },
  heroLine2: {
    color: 'rgba(255,255,255,0.8)',
  },
  heroLine3: {
    color: 'rgba(255,255,255,0.9)',
  },
  heroMainLine: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    textAlign: 'left',
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  feature: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  actionSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
    gap: 16,
  },
  startButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 0.95 }],
  },
  startButtonAnimated: {
    transform: [{ scale: 1 }],
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  learnMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  learnMoreText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textDecorationLine: 'underline',
  },
});
