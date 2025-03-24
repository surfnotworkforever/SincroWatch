// Mock de Expo Constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      polarClientId: 'test_client_id',
      polarClientSecret: 'test_client_secret',
      polarRedirectUri: 'fitsync://auth/polar/callback',
      supabaseUrl: 'test_supabase_url',
      supabaseAnonKey: 'test_supabase_key'
    }
  }
}));

// Crear el mock de fetch
const mockFetchImplementation = jest.fn().mockImplementation((url, options) => {
  // Simular error para códigos de autorización inválidos
  if (options?.body?.includes('invalid_code')) {
    return Promise.resolve({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers(),
      redirected: false,
      type: 'basic' as ResponseType,
      url: url as string,
      json: () => Promise.reject(new Error('Invalid authorization code')),
      text: () => Promise.resolve('Invalid authorization code'),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      formData: () => Promise.resolve(new FormData()),
      clone: function() { return this }
    } as Response);
  }

  // Simular error para tokens inválidos
  if (options?.headers?.['Authorization']?.includes('invalid_token')) {
    return Promise.resolve({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers(),
      redirected: false,
      type: 'basic' as ResponseType,
      url: url as string,
      json: () => Promise.reject(new Error('Invalid access token')),
      text: () => Promise.resolve('Invalid access token'),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      formData: () => Promise.resolve(new FormData()),
      clone: function() { return this }
    } as Response);
  }

  // Respuesta exitosa por defecto
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: url as string,
    json: () => Promise.resolve({
      access_token: 'mock_access_token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'mock_refresh_token'
    }),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    clone: function() { return this }
  } as Response);
});

// Asignar el mock a global.fetch
global.fetch = mockFetchImplementation; 