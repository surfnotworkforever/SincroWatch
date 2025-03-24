"use client"

import type React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface FilterBarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange }) => {
  const { theme } = useTheme()

  const filters = [
    { id: "all", label: "Todas" },
    { id: "running", label: "Correr" },
    { id: "cycling", label: "Ciclismo" },
    { id: "walking", label: "Caminar" },
    { id: "swimming", label: "Natación" },
    { id: "gym", label: "Gimnasio" },
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterItem,
              activeFilter === filter.id && { backgroundColor: theme.primary },
              { borderColor: theme.primary },
            ]}
            onPress={() => onFilterChange(filter.id)}
          >
            <Text style={[styles.filterText, { color: activeFilter === filter.id ? "#fff" : theme.primary }]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  scrollContent: {
    paddingRight: 16,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
})

export default FilterBar

