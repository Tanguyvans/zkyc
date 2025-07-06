import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const KYC = () => {
    const [isStarted, setIsStarted] = useState(false)

    const handleStartVerification = () => {
        setIsStarted(true)
        // Start with selfie, then proceed to ID
        router.push('/(onboarding)/kyc-selfie')
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#f8f9fa', '#e9ecef']}
                style={styles.gradient}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <View style={styles.logoContainer}>
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.logoGradient}
                            >
                                <Ionicons name="shield-checkmark" size={60} color="#fff" />
                            </LinearGradient>
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.title}>Identity Verification</Text>
                            <Text style={styles.subtitle}>
                                Secure your account with zero-knowledge proof verification
                            </Text>
                        </View>
                    </View>

                    {/* Verification Steps Info */}
                    <View style={styles.stepsContainer}>
                        <Text style={styles.stepsTitle}>Verification Process</Text>
                        <Text style={styles.stepsDescription}>
                            We'll guide you through a quick 2-step process to verify your identity
                        </Text>
                        
                        {/* Step 1: Selfie */}
                        <View style={styles.stepInfo}>
                            <View style={styles.stepIconContainer}>
                                <View style={[styles.stepIcon, { backgroundColor: 'rgba(102, 126, 234, 0.1)' }]}>
                                    <Ionicons name="camera" size={24} color="#667eea" />
                                </View>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Step 1: Take a Selfie</Text>
                                <Text style={styles.stepDescription}>
                                    Take a clear photo of yourself for facial recognition
                                </Text>
                                <View style={styles.stepFeatures}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="people" size={16} color="#667eea" />
                                        <Text style={styles.featureText}>Face detection</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="shield-checkmark" size={16} color="#667eea" />
                                        <Text style={styles.featureText}>Secure processing</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Step 2: ID */}
                        <View style={styles.stepInfo}>
                            <View style={styles.stepIconContainer}>
                                <View style={[styles.stepIcon, { backgroundColor: 'rgba(102, 126, 234, 0.1)' }]}>
                                    <Ionicons name="card" size={24} color="#667eea" />
                                </View>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Step 2: Photo ID Verification</Text>
                                <Text style={styles.stepDescription}>
                                    Take a photo of your government-issued ID document
                                </Text>
                                <View style={styles.stepFeatures}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="document-text" size={16} color="#667eea" />
                                        <Text style={styles.featureText}>Document scan</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="eye-off" size={16} color="#667eea" />
                                        <Text style={styles.featureText}>Privacy protected</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Start Verification Button */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity 
                            style={styles.startButton}
                            onPress={handleStartVerification}
                            disabled={isStarted}
                        >
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.startButtonGradient}
                            >
                                <Ionicons name="camera" size={20} color="#fff" />
                                <Text style={styles.startButtonText}>
                                    {isStarted ? 'Verification Started...' : 'Start Verification'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.securityNote}>
                            <Ionicons name="lock-closed" size={16} color="#6c757d" />
                            <Text style={styles.securityNoteText}>
                                Your data is encrypted and never stored on our servers
                            </Text>
                        </View>

                        <View style={styles.timeEstimate}>
                            <Ionicons name="time" size={16} color="#6c757d" />
                            <Text style={styles.timeEstimateText}>
                                Estimated time: 2-3 minutes
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    gradient: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        marginBottom: 20,
    },
    logoGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerText: {
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212529',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 24,
    },
    stepsContainer: {
        marginBottom: 40,
    },
    stepsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 8,
        textAlign: 'center',
    },
    stepsDescription: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    stepInfo: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    stepIconContainer: {
        marginRight: 16,
    },
    stepIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 20,
        marginBottom: 8,
    },
    stepFeatures: {
        flexDirection: 'row',
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: 12,
        color: '#667eea',
        fontWeight: '500',
    },
    actionContainer: {
        alignItems: 'center',
        gap: 16,
    },
    startButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        gap: 8,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
    },
    securityNoteText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        flex: 1,
    },
    timeEstimate: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
    },
    timeEstimateText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        flex: 1,
    },
})

export default KYC