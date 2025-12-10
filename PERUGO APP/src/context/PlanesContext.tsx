import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

// URL del backend
const BASE_URL = 'https://perugo-backend-production.up.railway.app';

export type Plan = {
  id: string;
  destino_id: string;
  destino?: string; // El backend a veces manda solo IDs, asegúrate de mapear si es necesario
  tour: string;
  precio: number;
  duracion?: string;
  estado: 'borrador' | 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  imagen?: string; // Si el backend no manda imagen, la manejaremos en el frontend según destino_id
  resena_completada?: boolean;
  gastos?: any;
};

export type PlanesContextValue = {
  planes: Plan[];
  loading: boolean;
  recargarPlanes: () => Promise<void>;
  agregarDestino: (planData: Partial<Plan>) => Promise<void>;
  actualizarPlan: (id: string, cambios: Partial<Plan>) => Promise<void>;
  eliminarPlan: (id: string) => Promise<void>;
};

const PlanesContext = createContext<PlanesContextValue | undefined>(undefined);

export function PlanesProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Función para obtener planes del servidor (GET)
  const fetchPlanes = useCallback(async () => {
    if (!token) {
      setPlanes([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/planes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Mapeamos los datos si es necesario (ej. asegurar que tengan imagen local o remota)
        // Nota: Si el backend no devuelve la imagen, deberás mapearla aquí usando `destinos.ts`
        setPlanes(data);
      } else {
        console.error('Error al obtener planes');
      }
    } catch (error) {
      console.error('Error de red al obtener planes:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Cargar planes cuando cambia el usuario o el token
  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  // 2. Agregar Plan (POST)
  const agregarDestino = async (planData: Partial<Plan>) => {
    if (!token) return;

    try {
      // Preparamos el body según lo que espera tu backend Python
      const body = {
        destino_id: planData.destino_id,
        tour: planData.tour,
        precio: planData.precio,
        gastos: planData.gastos,
        estado: 'borrador' // Default
      };

      const response = await fetch(`${BASE_URL}/api/planes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el plan');
      }

      // Recargamos la lista completa para tener los datos frescos (incluido el ID generado por BD)
      await fetchPlanes();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 3. Actualizar Plan (PUT)
  const actualizarPlan = async (id: string, cambios: Partial<Plan>) => {
    if (!token) return;

    // Actualización optimista (UI primero)
    setPlanes((prev) => prev.map((p) => (p.id === id ? { ...p, ...cambios } : p)));

    try {
      const response = await fetch(`${BASE_URL}/api/planes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar plan');
      }
      // Opcional: fetchPlanes() si quieres estar 100% seguro de la sincronización
    } catch (error) {
      console.error(error);
      // Revertir cambios si falla (opcional)
      await fetchPlanes();
    }
  };

  // 4. Eliminar Plan (DELETE)
  const eliminarPlan = async (id: string) => {
    if (!token) return;

    // Actualización optimista
    setPlanes((prev) => prev.filter((p) => p.id !== id));

    try {
      const response = await fetch(`${BASE_URL}/api/planes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      await fetchPlanes(); // Revertir
    }
  };

  const value: PlanesContextValue = {
    planes,
    loading,
    recargarPlanes: fetchPlanes,
    agregarDestino,
    actualizarPlan,
    eliminarPlan
  };

  return <PlanesContext.Provider value={value}>{children}</PlanesContext.Provider>;
}

export function usePlanes() {
  const ctx = useContext(PlanesContext);
  if (!ctx) throw new Error('usePlanes debe usarse dentro de un PlanesProvider');
  return ctx;
}