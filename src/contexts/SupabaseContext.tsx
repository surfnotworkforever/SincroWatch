"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"

// Obtener las variables de entorno
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || ""
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || ""

type SupabaseContextType = {
  supabase: SupabaseClient
  user: User | null
  session: any
  loading: boolean
  signUp: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  refreshSession: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Inicializar el cliente de Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })

  useEffect(() => {
    // Verificar si hay una sesión activa
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          throw error
        }
        setSession(data.session)
        setUser(data.session?.user || null)
      } catch (error) {
        console.error("Error al verificar la sesión:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user || null)
      setLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error al registrarse:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      throw error
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      setSession(data.session)
      setUser(data.session?.user || null)
    } catch (error) {
      console.error("Error al refrescar la sesión:", error)
      throw error
    }
  }

  const value = {
    supabase,
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase debe ser usado dentro de un SupabaseProvider")
  }
  return context
}

