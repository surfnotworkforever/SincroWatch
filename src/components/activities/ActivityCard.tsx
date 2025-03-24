"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface ActivityCardProps {
  activity: any
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { theme } = useTheme()

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
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <Ionicons name={getActivityIcon(activity.tipo) as any} size={20} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {activity.tipo.charAt(0).toUpperCase() + activity.tipo.slice(1)}
          </Text>
        </View>
        <Text style={[styles.date, { color: theme.text }]}>{formatDate(activity.fecha)}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color={theme.text} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: theme.text }]}>{activity.duracion} min</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="map-outline" size={16} color={theme.text} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: theme.text }]}>{activity.distancia} km</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="speedometer-outline" size={16} color={theme.text} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {(activity.distancia / (activity.duracion / 60)).toFixed(1)} km/h
          </Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="flame-outline" size={16} color={theme.text} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: theme.text }]}>{activity.calorias} cal</Text>
        </View>
      </View>

      {activity.notas && <Text style={[styles.notes, { color: theme.text }]}>{activity.notas}</Text>}
    </TouchableOpacity>
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
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  statIcon: {
    marginRight: 4,
  },
  statValue: {
    fontSize: 14,
  },
  notes: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
  },
})

export default ActivityCard

