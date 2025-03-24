"use client"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

const LoadingScreen = () => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default LoadingScreen

