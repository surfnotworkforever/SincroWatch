"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface DeviceCardProps {
  device: any
  onSync: () => void
  onRemove: () => void
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onSync, onRemove }) => {
  const { theme } = useTheme()

  // Función para obtener el icono según la marca del dispositivo
  const getDeviceIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "polar":
        return "watch-outline"
      case "garmin":
        return "watch-outline"
      case "fitbit":
        return "fitness-outline"
      case "xiaomi":
        return "watch-outline"
      default:
        return "watch-outline"
    }
  }

  // Formatear la fecha de última sincronización
  const formatLastSync = (dateString: string) => {
    if (!dateString) return "Nunca"

    const date = new Date(dateString)
    return date.toLocaleString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.deviceInfo}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <Ionicons name={getDeviceIcon(device.marca) as any} size={24} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.deviceName, { color: theme.text }]}>
              {device.marca} {device.modelo}
            </Text>
            <Text style={[styles.deviceId, { color: theme.text }]}>
              ID: {device.identificador_sincronizacion.substring(0, 12)}...
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.syncInfo}>
        <Text style={[styles.syncLabel, { color: theme.text }]}>Última sincronización:</Text>
        <Text style={[styles.syncDate, { color: theme.text }]}>{formatLastSync(device.ultima_sincronizacion)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.syncButton, { backgroundColor: theme.primary }]} onPress={onSync}>
          <Ionicons name="sync-outline" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.syncButtonText}>Sincronizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.removeButton, { borderColor: theme.error }]} onPress={onRemove}>
          <Ionicons name="trash-outline" size={16} color={theme.error} style={styles.buttonIcon} />
          <Text style={[styles.removeButtonText, { color: theme.error }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceId: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  syncInfo: {
    marginBottom: 16,
  },
  syncLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  syncDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  syncButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginLeft: 8,
  },
  removeButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  buttonIcon: {
    marginRight: 6,
  },
})

export default DeviceCard

