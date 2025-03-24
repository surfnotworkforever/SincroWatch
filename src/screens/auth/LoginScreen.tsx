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

const LoginScreen = () => {
  const navigation = useNavigation()
  const { signIn } = useSupabase()
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos")
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
    } catch (error: any) {
      Alert.alert("Error de inicio de sesión", error.message || "No se pudo iniciar sesión")
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
          <Text style={[styles.title, { color: theme.text }]}>FitSync</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>Sincroniza tus dispositivos deportivos</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

          <Button title="Iniciar Sesión" onPress={handleLogin} loading={loading} style={{ marginTop: 20 }} />

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword" as never)}
            style={styles.forgotPasswordContainer}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: theme.text }]}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
            <Text style={[styles.registerText, { color: theme.primary }]}>Regístrate</Text>
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
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
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
    marginBottom: 30,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
  },
  registerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default LoginScreen

