"use client"

import type React from "react"
import { View, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface AvatarProps {
  uri?: string
  size?: number
  onPress?: () => void
}

const Avatar: React.FC<AvatarProps> = ({ uri, size = 80, onPress }) => {
  const { theme } = useTheme()

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <Ionicons name="person" size={size * 0.6} color={theme.text} />
      )}

      {onPress && (
        <View style={[styles.editButton, { backgroundColor: theme.primary }]}>
          <Ionicons name="pencil" size={size * 0.2} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    resizeMode: "cover",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "30%",
    height: "30%",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Avatar

