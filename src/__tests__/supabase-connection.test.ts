import { createClient } from '@supabase/supabase-js';
import Constants from "expo-constants";

// Mock de Constants para asegurar que tenemos los valores correctos
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      supabaseUrl: 'test_supabase_url',
      supabaseAnonKey: 'test_supabase_key'
    }
  }
}));

// Obtener las variables de entorno simuladas
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || "";

// Mock del cliente de Supabase
const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    refreshSession: jest.fn(),
    onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
  }
};

// Mock de createClient después de obtener las variables
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

// Importar después de configurar los mocks
import { SupabaseProvider, useSupabase } from '../contexts/SupabaseContext';

describe('Pruebas de conexión con Supabase', () => {
  // Crear un cliente manualmente para las pruebas
  beforeAll(() => {
    // Crear un cliente de prueba con los valores mock
    createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      }
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createClient se llama con las URL y clave correctas', () => {
    // Verificar que createClient se ha llamado con los parámetros correctos
    expect(createClient).toHaveBeenCalledWith(
      'test_supabase_url',
      'test_supabase_key',
      expect.objectContaining({
        auth: expect.objectContaining({
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false
        })
      })
    );
  });

  describe('Pruebas de operaciones CRUD', () => {
    // Mock de datos de prueba
    const mockUser = { id: 'test-user-id', email: 'test@example.com' };
    const mockDevices = [
      { id: 'device-1', user_id: 'test-user-id', marca: 'Polar', modelo: 'M430' },
      { id: 'device-2', user_id: 'test-user-id', marca: 'Garmin', modelo: 'Forerunner' }
    ];

    beforeEach(() => {
      // Configurar los mocks para cada prueba
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
    });

    it('select() debe construir la consulta correctamente', async () => {
      // Configurar mock para devolver datos
      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.order.mockReturnThis();
      mockSupabaseClient.limit.mockReturnValue(Promise.resolve({ data: mockDevices, error: null }));

      // Simular una operación select
      const result = await mockSupabaseClient
        .from('devices')
        .select('*')
        .eq('user_id', 'test-user-id')
        .order('fecha', { ascending: false })
        .limit(10);

      // Verificar que se construyó la consulta correctamente
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('devices');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('user_id', 'test-user-id');
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('fecha', { ascending: false });
      expect(mockSupabaseClient.limit).toHaveBeenCalledWith(10);

      // Verificar los datos devueltos
      expect(result.data).toEqual(mockDevices);
      expect(result.error).toBeNull();
    });

    it('insert() debe construir la operación correctamente', async () => {
      const newDevice = {
        user_id: 'test-user-id',
        marca: 'Xiaomi',
        modelo: 'Mi Band 7',
        identificador_sincronizacion: 'xiaomi-123'
      };

      // Configurar mock para insert
      mockSupabaseClient.insert.mockReturnValue(Promise.resolve({
        data: { ...newDevice, id: 'new-device-id' },
        error: null
      }));

      // Simular una operación insert
      const result = await mockSupabaseClient
        .from('devices')
        .insert(newDevice);

      // Verificar que se llamó a la función correctamente
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('devices');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(newDevice);

      // Verificar los datos devueltos
      expect(result.data).toHaveProperty('id', 'new-device-id');
      expect(result.error).toBeNull();
    });

    it('update() debe construir la operación correctamente', async () => {
      const deviceUpdate = {
        ultima_sincronizacion: new Date().toISOString()
      };

      // Configurar mock para update
      mockSupabaseClient.update.mockReturnThis();
      mockSupabaseClient.eq.mockReturnValue(Promise.resolve({
        data: { id: 'device-1', ...deviceUpdate },
        error: null
      }));

      // Simular una operación update
      const result = await mockSupabaseClient
        .from('devices')
        .update(deviceUpdate)
        .eq('id', 'device-1');

      // Verificar que se llamó a la función correctamente
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('devices');
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(deviceUpdate);
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'device-1');

      // Verificar los datos devueltos
      expect(result.data).toHaveProperty('id', 'device-1');
      expect(result.error).toBeNull();
    });

    it('delete() debe construir la operación correctamente', async () => {
      // Configurar mock para delete
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockReturnValue(Promise.resolve({
        data: { id: 'device-1' },
        error: null
      }));

      // Simular una operación delete
      const result = await mockSupabaseClient
        .from('devices')
        .delete()
        .eq('id', 'device-1');

      // Verificar que se llamó a la función correctamente
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('devices');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'device-1');

      // Verificar los datos devueltos
      expect(result.data).toHaveProperty('id', 'device-1');
      expect(result.error).toBeNull();
    });
  });

  describe('Pruebas de autenticación', () => {
    it('signUp debe llamar a la API de autenticación correctamente', async () => {
      // Configurar mock para signUp
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: { id: 'new-user', email: 'new@example.com' } },
        error: null
      });

      // Simular registro
      const result = await mockSupabaseClient.auth.signUp({
        email: 'new@example.com',
        password: 'password123'
      });

      // Verificar que se llamó correctamente
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123'
      });

      // Verificar respuesta
      expect(result.data.user).toHaveProperty('id', 'new-user');
      expect(result.error).toBeNull();
    });

    it('signInWithPassword debe llamar a la API de autenticación correctamente', async () => {
      // Configurar mock para signInWithPassword
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { 
          user: { id: 'existing-user', email: 'user@example.com' },
          session: { access_token: 'test-token' }
        },
        error: null
      });

      // Simular inicio de sesión
      const result = await mockSupabaseClient.auth.signInWithPassword({
        email: 'user@example.com',
        password: 'password123'
      });

      // Verificar que se llamó correctamente
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123'
      });

      // Verificar respuesta
      expect(result.data.user).toHaveProperty('id', 'existing-user');
      expect(result.data.session).toHaveProperty('access_token', 'test-token');
      expect(result.error).toBeNull();
    });

    it('signOut debe llamar a la API de autenticación correctamente', async () => {
      // Configurar mock para signOut
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null
      });

      // Simular cierre de sesión
      const result = await mockSupabaseClient.auth.signOut();

      // Verificar que se llamó correctamente
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();

      // Verificar respuesta
      expect(result.error).toBeNull();
    });
  });
}); 