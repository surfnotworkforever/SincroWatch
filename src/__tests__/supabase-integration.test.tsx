import React from 'react';
// Importamos solamente render y act, sin waitFor
import { render, act } from '@testing-library/react';
import { SupabaseProvider, useSupabase } from '../contexts/SupabaseContext';
import { createClient } from '@supabase/supabase-js';

// Mock de createClient y el cliente Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

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

// Componente de prueba para usar el hook useSupabase
const TestComponent = () => {
  const { user, supabase, signIn, signOut } = useSupabase();
  return (
    <div>
      <div data-testid="user-id">{user?.id || 'no-user'}</div>
      <button data-testid="sign-in" onClick={() => signIn('test@example.com', 'password')}></button>
      <button data-testid="sign-out" onClick={() => signOut()}></button>
    </div>
  );
};

describe('Integración de Supabase con Componentes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de getSession para simular usuario no autenticado por defecto
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });
  });

  it('El contexto de Supabase proporciona el cliente y estado de usuario', async () => {
    let component: any; // Tipo explícito para evitar error de tipo
    
    await act(async () => {
      component = render(
        <SupabaseProvider>
          <TestComponent />
        </SupabaseProvider>
      );
    });

    // Verificar que el usuario no está autenticado inicialmente
    const userIdElement = component.getByTestId('user-id');
    expect(userIdElement.props.children).toBe('no-user');
  });

  it('signIn actualiza el estado de usuario cuando es exitoso', async () => {
    // Mock de signInWithPassword para simular inicio de sesión exitoso
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        session: { access_token: 'test-token' }
      },
      error: null
    });

    // Configurar el event handler para onAuthStateChange
    let authStateChangeHandler: (event: string, session: any) => void;
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((handler) => {
      authStateChangeHandler = handler;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    let component: any;
    
    await act(async () => {
      component = render(
        <SupabaseProvider>
          <TestComponent />
        </SupabaseProvider>
      );
    });

    // Simular un cambio en el estado de autenticación
    await act(async () => {
      if (authStateChangeHandler) {
        authStateChangeHandler('SIGNED_IN', {
          user: { id: 'test-user-id', email: 'test@example.com' }
        });
      }
    });

    // Verificar que el estado de usuario se ha actualizado
    // Aquí usamos directamente expect sin waitFor
    const userIdElement = component.getByTestId('user-id');
    expect(userIdElement.props.children).toBe('test-user-id');
  });

  it('signOut limpia el estado de usuario cuando es exitoso', async () => {
    // Mock del estado inicial con un usuario autenticado
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id', email: 'test@example.com' },
          access_token: 'test-token'
        }
      },
      error: null
    });

    // Mock de signOut para simular cierre de sesión exitoso
    mockSupabaseClient.auth.signOut.mockResolvedValue({
      error: null
    });

    // Configurar el event handler para onAuthStateChange
    let authStateChangeHandler: (event: string, session: any) => void;
    mockSupabaseClient.auth.onAuthStateChange.mockImplementation((handler) => {
      authStateChangeHandler = handler;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    let component: any;
    
    // Renderizar con usuario autenticado
    await act(async () => {
      component = render(
        <SupabaseProvider>
          <TestComponent />
        </SupabaseProvider>
      );
    });

    // Simular un cambio en el estado de autenticación - SIGNED_OUT
    await act(async () => {
      if (authStateChangeHandler) {
        authStateChangeHandler('SIGNED_OUT', null);
      }
    });

    // Verificar que el estado de usuario se ha limpiado
    // Aquí usamos directamente expect sin waitFor
    const userIdElement = component.getByTestId('user-id');
    expect(userIdElement.props.children).toBe('no-user');
  });

  it('getSession maneja el error correctamente', async () => {
    // Mock de console.error para verificar el log
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Mock de getSession para simular un error
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: new Error('Error de sesión')
    });

    await act(async () => {
      render(
        <SupabaseProvider>
          <TestComponent />
        </SupabaseProvider>
      );
    });

    // Verificar que se manejó el error
    expect(console.error).toHaveBeenCalledWith(
      'Error al verificar la sesión:',
      expect.any(Error)
    );

    // Restaurar console.error
    console.error = originalConsoleError;
  });
}); 