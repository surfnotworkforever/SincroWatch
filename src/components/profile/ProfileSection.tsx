"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface ProfileSectionProps {
  title: string
  children: React.ReactNode
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={[styles.content, { backgroundColor: theme.card, borderColor: theme.border }]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  content: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
})

export default ProfileSection

