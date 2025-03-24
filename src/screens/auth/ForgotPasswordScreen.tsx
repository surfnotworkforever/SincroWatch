"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useSupabase } from "../../contexts/SupabaseContext"
import { useTheme } from "../../contexts/ThemeContext"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"

const ForgotPasswordScreen = () => {
  const navigation = useNavigation()
  const { supabase } = useSupabase()
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "fitsync://reset-password",
      })

      if (error) throw error

      Alert.alert("Correo enviado", "Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.", [
        { text: "OK", onPress: () => navigation.navigate("Login" as never) },
      ])
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo enviar el correo de restablecimiento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Recuperar contraseña</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </Text>

          <View style={styles.formContainer}>
            <Input
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button title="Enviar enlace" onPress={handleResetPassword} loading={loading} style={{ marginTop: 20 }} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Login" as never)} style={styles.backContainer}>
            <Text style={[styles.backText, { color: theme.primary }]}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  backContainer: {
    marginTop: 20,
  },
  backText: {
    fontSize: 16,
  },
})

export default ForgotPasswordScreen

