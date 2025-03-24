"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, RefreshControl } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useSupabase } from "../../contexts/SupabaseContext"
import ActivityCard from "../../components/activities/ActivityCard"
import FilterBar from "../../components/activities/FilterBar"
import EmptyState from "../../components/common/EmptyState"

const ActivitiesScreen = () => {
  const { theme } = useTheme()
  const { user, supabase } = useSupabase()
  const [activities, setActivities] = useState<any[]>([])
  const [filteredActivities, setFilteredActivities] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState("all")

  const fetchActivities = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("fecha", { ascending: false })

      if (error) throw error
      setActivities(data || [])
      setFilteredActivities(data || [])
    } catch (error) {
      console.error("Error al cargar actividades:", error)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [user])

  useEffect(() => {
    if (filter === "all") {
      setFilteredActivities(activities)
    } else {
      setFilteredActivities(activities.filter((activity) => activity.tipo === filter))
    }
  }, [filter, activities])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchActivities()
    setRefreshing(false)
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
  }

  const renderItem = ({ item }: { item: any }) => <ActivityCard activity={item} />

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FilterBar activeFilter={filter} onFilterChange={handleFilterChange} />

      <FlatList
        data={filteredActivities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
        ListEmptyComponent={
          <EmptyState
            title="No hay actividades"
            message="Sincroniza tu dispositivo para ver tus actividades aquí"
            icon="fitness-outline"
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
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
})

export default ActivitiesScreen

