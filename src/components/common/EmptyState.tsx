"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface EmptyStateProps {
  title: string
  message: string
  icon: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon }) => {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={80} color={theme.primary} style={styles.icon} />
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    minHeight: 300,
  },
  icon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
})

export default EmptyState

