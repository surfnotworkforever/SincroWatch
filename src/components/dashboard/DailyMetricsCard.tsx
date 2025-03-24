"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface DailyMetricsProps {
  metrics: {
    steps: number
    calories: number
    distance: number
    activeMinutes: number
  }
}

const DailyMetricsCard: React.FC<DailyMetricsProps> = ({ metrics }) => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Hoy</Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Ionicons name="footsteps-outline" size={24} color={theme.primary} />
          <Text style={[styles.metricValue, { color: theme.text }]}>{metrics.steps.toLocaleString()}</Text>
          <Text style={[styles.metricLabel, { color: theme.text }]}>Pasos</Text>
        </View>

        <View style={styles.metricItem}>
          <Ionicons name="flame-outline" size={24} color={theme.accent} />
          <Text style={[styles.metricValue, { color: theme.text }]}>{metrics.calories}</Text>
          <Text style={[styles.metricLabel, { color: theme.text }]}>Calorías</Text>
        </View>

        <View style={styles.metricItem}>
          <Ionicons name="map-outline" size={24} color={theme.secondary} />
          <Text style={[styles.metricValue, { color: theme.text }]}>{metrics.distance}</Text>
          <Text style={[styles.metricLabel, { color: theme.text }]}>Km</Text>
        </View>

        <View style={styles.metricItem}>
          <Ionicons name="time-outline" size={24} color={theme.warning} />
          <Text style={[styles.metricValue, { color: theme.text }]}>{metrics.activeMinutes}</Text>
          <Text style={[styles.metricLabel, { color: theme.text }]}>Min. activos</Text>
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
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
})

export default DailyMetricsCard

