import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipo básico para un "plan"; puedes ajustarlo luego según tu modelo real
export type Plan = {
  id: string;
  nombre: string;
  ubicacion?: string;
  imagen?: string;
  precio?: number;
  descripcion?: string;
};

export type PlanesContextValue = {
  planes: Plan[];
  setPlanes: (planes: Plan[]) => void;
  agregarDestino: (plan: Plan) => void;
};

const PlanesContext = createContext<PlanesContextValue | undefined>(undefined);

export function PlanesProvider({ children }: { children: ReactNode }) {
  const [planes, setPlanes] = useState<Plan[]>([]);

  const value: PlanesContextValue = {
    planes,
    setPlanes,
    agregarDestino: (plan: Plan) => {
      setPlanes((prev) => {
        // Evitar duplicados por id
        if (prev.some((p) => p.id === plan.id)) return prev;
        return [...prev, plan];
      });
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
