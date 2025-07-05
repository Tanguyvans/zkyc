import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export interface WorkflowStepData {
  id: string
  title: string
  description: string
  icon: keyof typeof Ionicons.glyphMap
  status: 'pending' | 'active' | 'completed'
}

interface WorkflowStepProps {
  step: WorkflowStepData
  isLast?: boolean
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, isLast = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50'
      case 'active': return '#007AFF'
      case 'pending': return '#ccc'
      default: return '#ccc'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle'
      case 'active': return 'radio-button-on'
      case 'pending': return 'radio-button-off'
      default: return 'radio-button-off'
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <View style={[styles.iconContainer, { backgroundColor: getStatusColor(step.status) }]}>
          <Ionicons 
            name={getStatusIcon(step.status)} 
            size={24} 
            color="#fff" 
          />
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: getStatusColor(step.status) }]} />}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: step.status === 'pending' ? '#ccc' : '#333' }]}>
          {step.title}
        </Text>
        <Text style={[styles.description, { color: step.status === 'pending' ? '#ccc' : '#666' }]}>
          {step.description}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  line: {
    width: 2,
    height: 40,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
})

export default WorkflowStep 