"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useSupabase } from "../../contexts/SupabaseContext"
import Avatar from "../../components/profile/Avatar"
import ProfileSection from "../../components/profile/ProfileSection"
import ProfileItem from "../../components/profile/ProfileItem"
import Button from "../../components/common/Button"

const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme()
  const { user, signOut, supabase } = useSupabase()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error al cargar perfil:", error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  const handleSignOut = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await signOut()
          } catch (error) {
            console.error("Error al cerrar sesión:", error)
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  const handleEditProfile = () => {
    // Navegar a la pantalla de edición de perfil
    Alert.alert("Editar perfil", "Esta funcionalidad estará disponible próximamente")
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Avatar uri={profile?.avatar_url} size={100} onPress={handleEditProfile} />
        <Text style={[styles.name, { color: theme.text }]}>
          {profile?.nombre || user?.email?.split("@")[0] || "Usuario"}
        </Text>
        <Text style={[styles.email, { color: theme.text }]}>{user?.email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={[styles.editButtonText, { color: theme.primary }]}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ProfileSection title="Preferencias">
          <ProfileItem
            icon="moon-outline"
            title="Modo oscuro"
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: theme.primary }}
                thumbColor="#f4f3f4"
              />
            }
          />
          <ProfileItem
            icon="notifications-outline"
            title="Notificaciones"
            onPress={() => Alert.alert("Notificaciones", "Esta funcionalidad estará disponible próximamente")}
          />
          <ProfileItem
            icon="language-outline"
            title="Idioma"
            value="Español"
            onPress={() => Alert.alert("Idioma", "Esta funcionalidad estará disponible próximamente")}
          />
        </ProfileSection>

        <ProfileSection title="Cuenta">
          <ProfileItem
            icon="lock-closed-outline"
            title="Cambiar contraseña"
            onPress={() => Alert.alert("Cambiar contraseña", "Esta funcionalidad estará disponible próximamente")}
          />
          <ProfileItem
            icon="shield-outline"
            title="Privacidad"
            onPress={() => Alert.alert("Privacidad", "Esta funcionalidad estará disponible próximamente")}
          />
          <ProfileItem
            icon="trash-outline"
            title="Eliminar cuenta"
            danger
            onPress={() => Alert.alert("Eliminar cuenta", "Esta funcionalidad estará disponible próximamente")}
          />
        </ProfileSection>

        <ProfileSection title="Información">
          <ProfileItem
            icon="information-circle-outline"
            title="Acerca de"
            onPress={() => Alert.alert("Acerca de", "FitSync v1.0.0")}
          />
          <ProfileItem
            icon="help-circle-outline"
            title="Ayuda"
            onPress={() => Alert.alert("Ayuda", "Esta funcionalidad estará disponible próximamente")}
          />
          <ProfileItem
            icon="document-text-outline"
            title="Términos y condiciones"
            onPress={() => Alert.alert("Términos y condiciones", "Esta funcionalidad estará disponible próximamente")}
          />
        </ProfileSection>

        <Button
          title="Cerrar sesión"
          onPress={handleSignOut}
          loading={loading}
          style={styles.signOutButton}
          variant="outline"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  editButton: {
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  signOutButton: {
    marginTop: 20,
    marginBottom: 40,
  },
})

export default ProfileScreen

