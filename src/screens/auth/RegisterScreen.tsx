"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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

const RegisterScreen = () => {
  const navigation = useNavigation()
  const { signUp } = useSupabase()
  const { theme } = useTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor, completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    try {
      const { user } = await signUp(email, password)

      if (user) {
        Alert.alert(
          "Registro exitoso",
          "Se ha enviado un correo de confirmación a tu dirección de email. Por favor, verifica tu cuenta para continuar.",
          [{ text: "OK", onPress: () => navigation.navigate("Login" as never) }],
        )
      }
    } catch (error: any) {
      Alert.alert("Error de registro", error.message || "No se pudo completar el registro")
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
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.title, { color: theme.text }]}>Crear Cuenta</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>Únete a FitSync y sincroniza tus dispositivos</Text>
        </View>

        <View style={styles.formContainer}>
          <Input placeholder="Nombre completo" value={name} onChangeText={setName} />
          <Input
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
          <Input
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button title="Registrarse" onPress={handleRegister} loading={loading} style={{ marginTop: 20 }} />
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: theme.text }]}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
            <Text style={[styles.loginText, { color: theme.primary }]}>Inicia sesión</Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default RegisterScreen

