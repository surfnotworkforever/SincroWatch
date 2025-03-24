import React from 'react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ActivityList() {
  const { activities, isLoading, error } = useApp();

  if (isLoading) {
    return <div>Cargando actividades...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!activities.length) {
    return <div>No hay actividades registradas</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Actividades Recientes</h2>
      <div className="grid gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {activity.activity_type}
                </h3>
                <p className="text-gray-600">
                  {format(new Date(activity.start_time), 'PPpp', { locale: es })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium">
                  {activity.distance ? `${activity.distance.toFixed(2)} km` : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.duration
                    ? `${Math.floor(
                        parseInt(activity.duration) / 60
                      )} minutos`
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-600 text-sm">Calorías</p>
                <p className="font-medium">
                  {activity.calories ? `${Math.round(activity.calories)} kcal` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">FC Promedio</p>
                <p className="font-medium">
                  {activity.average_heart_rate
                    ? `${Math.round(activity.average_heart_rate)} bpm`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">FC Máxima</p>
                <p className="font-medium">
                  {activity.max_heart_rate
                    ? `${Math.round(activity.max_heart_rate)} bpm`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 