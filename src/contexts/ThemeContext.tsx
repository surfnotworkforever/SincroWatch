"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useColorScheme } from "react-native"

// Definir los colores para temas claro y oscuro
const lightTheme = {
  background: "#FFFFFF",
  text: "#000000",
  primary: "#0066CC",
  secondary: "#4ECDC4",
  accent: "#FF6B6B",
  card: "#F5F5F5",
  border: "#E0E0E0",
  notification: "#FF3B30",
  success: "#4CD964",
  warning: "#FF9500",
  error: "#FF3B30",
}

const darkTheme = {
  background: "#121212",
  text: "#FFFFFF",
  primary: "#2196F3",
  secondary: "#4ECDC4",
  accent: "#FF6B6B",
  card: "#1E1E1E",
  border: "#333333",
  notification: "#FF453A",
  success: "#32D74B",
  warning: "#FF9F0A",
  error: "#FF453A",
}

type Theme = typeof lightTheme

type ThemeContextType = {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()
  const [isDark, setIsDark] = useState(colorScheme === "dark")
  const theme = isDark ? darkTheme : lightTheme

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme debe ser usado dentro de un ThemeProvider")
  }
  return context
}

