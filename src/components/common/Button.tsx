"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "outline" | "ghost"
  size?: "small" | "medium" | "large"
  icon?: string
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return "#ccc"
    switch (variant) {
      case "primary":
        return theme.primary
      case "outline":
      case "ghost":
        return "transparent"
      default:
        return theme.primary
    }
  }

  const getTextColor = () => {
    if (disabled) return "#666"
    switch (variant) {
      case "primary":
        return "#fff"
      case "outline":
      case "ghost":
        return theme.primary
      default:
        return "#fff"
    }
  }

  const getBorderColor = () => {
    if (disabled) return "#ccc"
    switch (variant) {
      case "outline":
        return theme.primary
      default:
        return "transparent"
    }
  }

  const getHeight = () => {
    switch (size) {
      case "small":
        return 36
      case "medium":
        return 48
      case "large":
        return 56
      default:
        return 48
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          height: getHeight(),
          borderWidth: variant === "outline" ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && (
            <Ionicons name={icon as any} size={size === "small" ? 16 : 20} color={getTextColor()} style={styles.icon} />
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: size === "small" ? 14 : size === "large" ? 18 : 16,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  text: {
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
})

export default Button

