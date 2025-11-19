import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DestinoPlan = {
  id: string;
  nombre: string;
  ubicacion?: string;
  imagen?: string;
  precio?: number;
};

type PlanesContextType = {
  planes: DestinoPlan[];
  agregarDestino: (destino: DestinoPlan) => void;
};

const PlanesContext = createContext<PlanesContextType | undefined>(undefined);

export function PlanesProvider({ children }: { children: ReactNode }) {
  const [planes, setPlanes] = useState<DestinoPlan[]>([]);

  const agregarDestino = (destino: DestinoPlan) => {
    setPlanes((prev) => {
      if (prev.some((p) => p.id === destino.id)) return prev;
      return [...prev, destino];
    });
  };

  return (
    <PlanesContext.Provider value={{ planes, agregarDestino }}>
      {children}
    </PlanesContext.Provider>
  );
}

export function usePlanes() {
  const ctx = useContext(PlanesContext);
  if (!ctx) {
    throw new Error('usePlanes debe usarse dentro de un PlanesProvider');
  }
  return ctx;
}
