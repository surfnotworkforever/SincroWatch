"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface DeviceSyncStatusProps {
  devices: any[]
}

const DeviceSyncStatus: React.FC<DeviceSyncStatusProps> = ({ devices }) => {
  const { theme } = useTheme()

  if (!devices || devices.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Dispositivos</Text>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>No hay dispositivos conectados</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.addButtonText}>Añadir dispositivo</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Dispositivos</Text>

      {devices.map((device, index) => (
        <View
          key={device.id}
          style={[
            styles.deviceItem,
            index < devices.length - 1 && styles.deviceItemBorder,
            { borderBottomColor: theme.border },
          ]}
        >
          <View style={styles.deviceInfo}>
            <Text style={[styles.deviceName, { color: theme.text }]}>
              {device.marca} {device.modelo}
            </Text>
            <Text style={[styles.syncStatus, { color: theme.text }]}>
              Última sincronización: {new Date(device.ultima_sincronizacion).toLocaleString("es-ES")}
            </Text>
          </View>

          <View style={[styles.syncIndicator, { backgroundColor: theme.success + "30" }]}>
            <Ionicons name="checkmark-circle" size={16} color={theme.success} />
            <Text style={[styles.syncIndicatorText, { color: theme.success }]}>Sincronizado</Text>
          </View>
        </View>
      ))}
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    marginBottom: 16,
    opacity: 0.7,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  deviceItemBorder: {
    borderBottomWidth: 1,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  syncStatus: {
    fontSize: 12,
    opacity: 0.7,
  },
  syncIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  syncIndicatorText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
})

export default DeviceSyncStatus

