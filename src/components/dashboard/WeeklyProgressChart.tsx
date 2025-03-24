"use client"

import type React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTheme } from "../../contexts/ThemeContext"

interface WeeklyProgressChartProps {
  data: any[]
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ data }) => {
  const { theme, isDark } = useTheme()
  const screenWidth = Dimensions.get("window").width - 32

  const chartData = {
    labels: data.map((item) => item.day),
    datasets: [
      {
        data: data.map((item) => item.steps / 1000), // Convertir a miles para mejor visualización
        color: (opacity = 1) => theme.primary,
        strokeWidth: 2,
      },
      {
        data: data.map((item) => item.calories / 100), // Escalar para mejor visualización
        color: (opacity = 1) => theme.accent,
        strokeWidth: 2,
      },
    ],
    legend: ["Pasos (miles)", "Calorías (x100)"],
  }

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(${isDark ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDark ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
    },
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Progreso Semanal</Text>

      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
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
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
})

export default WeeklyProgressChart

