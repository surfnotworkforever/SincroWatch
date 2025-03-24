import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseService } from '../services/supabase.service';
import { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Device = Database['public']['Tables']['devices']['Row'];
type Activity = Database['public']['Tables']['activities']['Row'];
type Metric = Database['public']['Tables']['metrics']['Row'];
type Session = Database['public']['Tables']['sessions']['Row'];

interface AppContextType {
  user: User | null;
  currentDevice: Device | null;
  activities: Activity[];
  metrics: Metric[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  setCurrentDevice: (device: Device | null) => void;
  refreshActivities: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  startNewSession: (deviceId: string, sessionType: string) => Promise<void>;
  endCurrentSession: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = SupabaseService.getInstance();

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setIsLoading(true);
      const currentUser = await supabase.getCurrentUser();
      if (!currentUser) {
        setError('No se encontró usuario autenticado');
        return;
      }

      const userProfile = await supabase.getUserProfile(currentUser.id);
      setUser(userProfile);

      const session = await supabase.getCurrentSession(currentUser.id);
      setCurrentSession(session);

      await refreshActivities();
      await refreshMetrics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshActivities() {
    if (!user) return;
    try {
      const userActivities = await supabase.getUserActivities(user.id);
      setActivities(userActivities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar actividades');
    }
  }

  async function refreshMetrics() {
    if (!user || !currentDevice) return;
    try {
      const userMetrics = await supabase.getUserMetrics(user.id, 'heart_rate');
      setMetrics(userMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar métricas');
    }
  }

  async function startNewSession(deviceId: string, sessionType: string) {
    if (!user) return;
    try {
      const session = await supabase.startSession({
        user_id: user.id,
        device_id: deviceId,
        session_type: sessionType,
        start_time: new Date().toISOString(),
        status: 'active'
      });
      setCurrentSession(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  }

  async function endCurrentSession() {
    if (!currentSession) return;
    try {
      const session = await supabase.endSession(currentSession.id);
      setCurrentSession(null);
      await refreshActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al finalizar sesión');
    }
  }

  const value = {
    user,
    currentDevice,
    activities,
    metrics,
    currentSession,
    isLoading,
    error,
    setCurrentDevice,
    refreshActivities,
    refreshMetrics,
    startNewSession,
    endCurrentSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
} 