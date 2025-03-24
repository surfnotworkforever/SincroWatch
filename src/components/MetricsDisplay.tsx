import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function MetricsDisplay() {
  const { metrics, currentSession, isLoading, error, refreshMetrics } = useApp();

  useEffect(() => {
    if (currentSession) {
      const interval = setInterval(refreshMetrics, 5000); // Actualizar cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [currentSession, refreshMetrics]);

  if (isLoading) {
    return <div>Cargando métricas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const latestMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.metric_type] || new Date(acc[metric.metric_type].timestamp) < new Date(metric.timestamp)) {
      acc[metric.metric_type] = metric;
    }
    return acc;
  }, {} as Record<string, typeof metrics[0]>);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Métricas en Tiempo Real</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(latestMetrics).map(([type, metric]) => (
          <div
            key={type}
            className="bg-white rounded-lg shadow p-4 text-center"
          >
            <h3 className="text-lg font-semibold capitalize mb-2">
              {type.replace('_', ' ')}
            </h3>
            <p className="text-3xl font-bold">
              {metric.value.toFixed(1)} {metric.unit}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {format(new Date(metric.timestamp), 'HH:mm:ss', { locale: es })}
            </p>
          </div>
        ))}
      </div>
      {currentSession && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Sesión Actual</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              Sesión iniciada: {format(new Date(currentSession.start_time), 'PPpp', { locale: es })}
            </p>
            <p className="text-green-600 mt-2">
              Tipo: {currentSession.session_type}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 