import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { SupabaseService } from '../services/supabase.service';

export function DeviceConnection() {
  const { user, currentDevice, setCurrentDevice, startNewSession } = useApp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = SupabaseService.getInstance();

  async function handleConnectDevice() {
    if (!user) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      // Simular la conexión con un dispositivo Polar
      // En una implementación real, aquí iría la lógica de conexión con el API de Polar
      const mockDevice = {
        user_id: user.id,
        device_type: 'polar',
        device_id: 'OH1-' + Math.random().toString(36).substr(2, 9),
        name: 'Polar OH1',
        last_sync: new Date().toISOString()
      };

      const device = await supabase.addDevice(mockDevice);
      setCurrentDevice(device);

      // Iniciar una nueva sesión de entrenamiento
      await startNewSession(device.id, 'entrenamiento');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar dispositivo');
    } finally {
      setIsConnecting(false);
    }
  }

  if (currentDevice) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{currentDevice.name}</h3>
            <p className="text-sm text-gray-600">
              ID: {currentDevice.device_id}
            </p>
            <p className="text-sm text-gray-600">
              Última sincronización: {new Date(currentDevice.last_sync!).toLocaleString()}
            </p>
          </div>
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Conectar Dispositivo</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <button
        onClick={handleConnectDevice}
        disabled={isConnecting}
        className={`
          w-full py-2 px-4 rounded-lg font-medium text-white
          ${isConnecting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'}
        `}
      >
        {isConnecting ? 'Conectando...' : 'Conectar Dispositivo Polar'}
      </button>
      <p className="text-sm text-gray-600 text-center">
        Asegúrate de que tu dispositivo Polar esté encendido y cerca
      </p>
    </div>
  );
} 