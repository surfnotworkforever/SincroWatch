"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface ProfileItemProps {
  icon: string
  title: string
  value?: string
  right?: React.ReactNode
  onPress?: () => void
  danger?: boolean
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, title, value, right, onPress, danger = false }) => {
  const { theme } = useTheme()

  return (
    <TouchableOpacity
      style={[styles.container, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.leftContent}>
        <Ionicons name={icon as any} size={22} color={danger ? theme.error : theme.primary} style={styles.icon} />
        <Text style={[styles.title, { color: danger ? theme.error : theme.text }]}>{title}</Text>
      </View>

      <View style={styles.rightContent}>
        {value && <Text style={[styles.value, { color: theme.text }]}>{value}</Text>}
        {right}
        {onPress && (
          <Ionicons name="chevron-forward" size={20} color={danger ? theme.error : theme.text} style={styles.chevron} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    opacity: 0.7,
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
})

export default ProfileItem

