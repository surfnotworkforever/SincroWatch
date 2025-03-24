"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface ActivitySummaryCardProps {
  activity: any
}

const ActivitySummaryCard: React.FC<ActivitySummaryCardProps> = ({ activity }) => {
  const { theme } = useTheme()

  // Si no hay actividad, mostrar un mensaje
  if (!activity) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Última actividad</Text>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>No hay actividades recientes</Text>
        </View>
      </View>
    )
  }

  // Función para obtener el icono según el tipo de actividad
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "running":
        return "run-outline"
      case "cycling":
        return "bicycle-outline"
      case "swimming":
        return "water-outline"
      case "walking":
        return "walk-outline"
      default:
        return "fitness-outline"
    }
  }

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Última actividad</Text>

      <View style={styles.activityContainer}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
          <Ionicons name={getActivityIcon(activity.tipo) as any} size={24} color={theme.primary} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.activityType, { color: theme.text }]}>
            {activity.tipo.charAt(0).toUpperCase() + activity.tipo.slice(1)}
          </Text>
          <Text style={[styles.activityDate, { color: theme.text }]}>{formatDate(activity.fecha)}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>{activity.distancia} km</Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Distancia</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>{activity.duracion} min</Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Duración</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>{activity.calorias}</Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Calorías</Text>
          </View>
        </View>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  emptyText: {
    opacity: 0.7,
  },
  activityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
})

export default ActivitySummaryCard

