import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient<Database>;

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;
    this.client = createClient<Database>(supabaseUrl, supabaseKey);
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Métodos para usuarios
  async getCurrentUser() {
    const { data: { user } } = await this.client.auth.getUser();
    return user;
  }

  async getUserProfile(userId: string) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Métodos para dispositivos
  async getUserDevices(userId: string) {
    const { data, error } = await this.client
      .from('devices')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  async addDevice(deviceData: Omit<Database['public']['Tables']['devices']['Insert'], 'id'>) {
    const { data, error } = await this.client
      .from('devices')
      .insert(deviceData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Métodos para actividades
  async getUserActivities(userId: string, limit = 10) {
    const { data, error } = await this.client
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  async addActivity(activityData: Omit<Database['public']['Tables']['activities']['Insert'], 'id'>) {
    const { data, error } = await this.client
      .from('activities')
      .insert(activityData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Métodos para métricas
  async getUserMetrics(userId: string, metricType: string, limit = 100) {
    const { data, error } = await this.client
      .from('metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('metric_type', metricType)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  async addMetric(metricData: Omit<Database['public']['Tables']['metrics']['Insert'], 'id'>) {
    const { data, error } = await this.client
      .from('metrics')
      .insert(metricData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Métodos para sesiones
  async getCurrentSession(userId: string) {
    const { data, error } = await this.client
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 es el código para "no se encontraron registros"
    return data;
  }

  async startSession(sessionData: Omit<Database['public']['Tables']['sessions']['Insert'], 'id'>) {
    const { data, error } = await this.client
      .from('sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async endSession(sessionId: string) {
    const { data, error } = await this.client
      .from('sessions')
      .update({
        end_time: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
} 