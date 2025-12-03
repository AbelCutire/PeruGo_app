import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Plan = {
  id: string; // id único del plan (plan_id en la web)
  destino_id: string; // id del destino (cusco, paracas, etc.)
  destino: string; // nombre del destino
  tour: string; // nombre del tour/plan elegido
  precio: number;
  duracion: string;
  duracion_dias: number;
  gastos?: {
    alojamiento: number;
    transporte: number;
    alimentacion: number;
    entradas: number;
  };
  ubicacion?: string;
  imagen?: string;
  estado: 'borrador' | 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  resena_completada?: boolean;
};

export type PlanesContextValue = {
  planes: Plan[];
  setPlanes: (planes: Plan[]) => void;
  agregarDestino: (plan: Plan) => void;
  actualizarPlan: (id: string, cambios: Partial<Plan>) => void;
};

const PlanesContext = createContext<PlanesContextValue | undefined>(undefined);

export function PlanesProvider({ children }: { children: ReactNode }) {
  const [planes, setPlanes] = useState<Plan[]>([]);

  const value: PlanesContextValue = {
    planes,
    setPlanes,
    agregarDestino: (plan: Plan) => {
      setPlanes((prev) => {
        // Evitar duplicar borradores del mismo destino y tour
        if (
          prev.some(
            (p) =>
              p.destino_id === plan.destino_id &&
              p.tour === plan.tour &&
              p.estado === 'borrador',
          )
        ) {
          return prev;
        }

        return [
          ...prev,
          {
            ...plan,
            estado: plan.estado ?? 'borrador',
            resena_completada: plan.resena_completada ?? false,
          },
        ];
      });
    },
    actualizarPlan: (id: string, cambios: Partial<Plan>) => {
      setPlanes((prev) => prev.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
    },
  };

  return <PlanesContext.Provider value={value}>{children}</PlanesContext.Provider>;
}

export function usePlanes() {
  const ctx = useContext(PlanesContext);
  if (!ctx) {
    throw new Error('usePlanes debe usarse dentro de un PlanesProvider');
  }
  return ctx;
}
