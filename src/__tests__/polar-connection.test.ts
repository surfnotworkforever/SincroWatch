import { connectToPolarDevice, exchangeAuthCodeForToken, registerUser } from '../services/polarService';

describe('Polar Connection Tests', () => {
  // Test de generación de URL de autorización
  it('connectToPolarDevice genera URL válida', async () => {
    const authUrl = await connectToPolarDevice();
    expect(authUrl).toBeDefined();
    expect(authUrl).toContain('flow.polar.com/oauth2/authorization');
    expect(authUrl).toContain('client_id=');
    expect(authUrl).toContain('response_type=code');
    expect(authUrl).toContain('redirect_uri=');
  });

  // Test de intercambio de código por token
  it('exchangeAuthCodeForToken maneja errores correctamente', async () => {
    const invalidCode = 'invalid_code';
    await expect(exchangeAuthCodeForToken(invalidCode)).rejects.toThrow();
  });

  // Test de registro de usuario
  it('registerUser maneja errores correctamente', async () => {
    const invalidToken = 'invalid_token';
    const userId = 'test_user_id';
    await expect(registerUser(invalidToken, userId)).rejects.toThrow();
  });

  // Test de validación de tokens
  it('exchangeAuthCodeForToken valida respuesta', async () => {
    const mockCode = 'valid_mock_code';
    // Mock de respuesta exitosa
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
        type: 'basic' as ResponseType,
        url: 'https://test.com',
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
      } as Response)
    );

    const response = await exchangeAuthCodeForToken(mockCode);
    expect(response).toHaveProperty('access_token');
    expect(response).toHaveProperty('refresh_token');
    expect(response.token_type).toBe('Bearer');
  });
}); 