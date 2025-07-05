import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import WorkflowStep, { WorkflowStepData } from './WorkflowStep'

interface WorkflowContainerProps {
  title: string
  steps: WorkflowStepData[]
  currentStepIndex: number
  children?: React.ReactNode
}

const WorkflowContainer: React.FC<WorkflowContainerProps> = ({ 
  title, 
  steps, 
  currentStepIndex, 
  children 
}) => {
  // Update step statuses based on current step
  const stepsWithStatus = steps.map((step, index) => ({
    ...step,
    status: (index < currentStepIndex ? 'completed' : 
            index === currentStepIndex ? 'active' : 'pending') as 'completed' | 'active' | 'pending'
  }))

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <ScrollView style={styles.stepsContainer}>
        {stepsWithStatus.map((step, index) => (
          <WorkflowStep
            key={step.id}
            step={step}
            isLast={index === stepsWithStatus.length - 1}
          />
        ))}
      </ScrollView>
      
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  stepsContainer: {
    paddingHorizontal: 20,
    maxHeight: 300,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
})

export default WorkflowContainer 