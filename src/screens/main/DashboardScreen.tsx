"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useSupabase } from "../../contexts/SupabaseContext"
import DailyMetricsCard from "../../components/dashboard/DailyMetricsCard"
import ActivitySummaryCard from "../../components/dashboard/ActivitySummaryCard"
import WeeklyProgressChart from "../../components/dashboard/WeeklyProgressChart"
import DeviceSyncStatus from "../../components/dashboard/DeviceSyncStatus"

const DashboardScreen = () => {
  const { theme } = useTheme()
  const { user, supabase } = useSupabase()
  const [refreshing, setRefreshing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [lastActivity, setLastActivity] = useState<any>(null)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [connectedDevices, setConnectedDevices] = useState<any[]>([])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Obtener datos del usuario
      const { data: userProfile, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (userError) throw userError
      setUserData(userProfile)

      // Obtener última actividad
      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("fecha", { ascending: false })
        .limit(1)

      if (activitiesError) throw activitiesError
      if (activities && activities.length > 0) {
        setLastActivity(activities[0])
      }

      // Obtener datos semanales para gráficos
      // Aquí se simularían datos para la demostración
      const mockWeeklyData = [
        { day: "Lun", steps: 8500, calories: 350 },
        { day: "Mar", steps: 10200, calories: 420 },
        { day: "Mié", steps: 7800, calories: 310 },
        { day: "Jue", steps: 9300, calories: 380 },
        { day: "Vie", steps: 11500, calories: 450 },
        { day: "Sáb", steps: 6500, calories: 280 },
        { day: "Dom", steps: 4200, calories: 200 },
      ]
      setWeeklyData(mockWeeklyData)

      // Obtener dispositivos conectados
      const { data: devices, error: devicesError } = await supabase.from("devices").select("*").eq("user_id", user.id)

      if (devicesError) throw devicesError
      setConnectedDevices(devices || [])
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  // Datos simulados para la demostración
  const dailyMetrics = {
    steps: 8743,
    calories: 385,
    distance: 6.2,
    activeMinutes: 68,
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
    >
      <Text style={[styles.greeting, { color: theme.text }]}>
        Hola, {userData?.nombre || user?.email?.split("@")[0] || "Usuario"}
      </Text>

      <View style={styles.cardsContainer}>
        <DailyMetricsCard metrics={dailyMetrics} />
        <ActivitySummaryCard activity={lastActivity} />
      </View>

      <WeeklyProgressChart data={weeklyData} />

      <DeviceSyncStatus devices={connectedDevices} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardsContainer: {
    marginBottom: 20,
  },
})

export default DashboardScreen

