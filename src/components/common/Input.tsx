"use client"

import type React from "react"
import { View, TextInput, StyleSheet, type TextInputProps } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface InputProps extends TextInputProps {
  error?: string
}

const Input: React.FC<InputProps> = ({ style, error, ...props }) => {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: error ? theme.error : theme.border,
          },
          style,
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
})

export default Input

