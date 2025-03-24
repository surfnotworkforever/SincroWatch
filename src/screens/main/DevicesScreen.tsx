"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useSupabase } from "../../contexts/SupabaseContext"
import DeviceCard from "../../components/devices/DeviceCard"
import Button from "../../components/common/Button"
import EmptyState from "../../components/common/EmptyState"
import { connectToPolarDevice } from "../../services/polarService"

const DevicesScreen = () => {
  const { theme } = useTheme()
  const { user, supabase } = useSupabase()
  const [devices, setDevices] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchDevices = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("devices").select("*").eq("user_id", user.id)

      if (error) throw error
      setDevices(data || [])
    } catch (error) {
      console.error("Error al cargar dispositivos:", error)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchDevices()
    setRefreshing(false)
  }

  const handleAddDevice = async () => {
    try {
      // Iniciar el proceso de conexión con Polar
      const authUrl = await connectToPolarDevice()

      // Aquí se abriría el navegador para la autenticación OAuth
      // En una implementación real, esto usaría WebBrowser de Expo
      Alert.alert(
        "Conectar dispositivo Polar",
        "Se abrirá una ventana para autorizar la conexión con tu cuenta de Polar.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Continuar", onPress: () => console.log("Abrir navegador con URL:", authUrl) },
        ],
      )
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo iniciar la conexión con Polar")
    }
  }

  const handleSyncDevice = async (deviceId: string) => {
    Alert.alert("Sincronizando", "Iniciando sincronización con el dispositivo...")
    // Aquí iría la lógica de sincronización real
    setTimeout(() => {
      Alert.alert("Éxito", "Dispositivo sincronizado correctamente")
    }, 2000)
  }

  const handleRemoveDevice = async (deviceId: string) => {
    Alert.alert("Eliminar dispositivo", "¿Estás seguro de que deseas eliminar este dispositivo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.from("devices").delete().eq("id", deviceId)

            if (error) throw error

            // Actualizar la lista de dispositivos
            setDevices(devices.filter((device) => device.id !== deviceId))
            Alert.alert("Éxito", "Dispositivo eliminado correctamente")
          } catch (error: any) {
            Alert.alert("Error", error.message || "No se pudo eliminar el dispositivo")
          }
        },
      },
    ])
  }

  const renderItem = ({ item }: { item: any }) => (
    <DeviceCard device={item} onSync={() => handleSyncDevice(item.id)} onRemove={() => handleRemoveDevice(item.id)} />
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Mis Dispositivos</Text>
        <Button
          title="Añadir dispositivo"
          onPress={handleAddDevice}
          icon="add-circle-outline"
          style={styles.addButton}
        />
      </View>

      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
        ListEmptyComponent={
          <EmptyState
            title="No hay dispositivos conectados"
            message="Añade un dispositivo para comenzar a sincronizar tus datos"
            icon="watch-outline"
          />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    height: 40,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
})

export default DevicesScreen

