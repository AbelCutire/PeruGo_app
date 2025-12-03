// app/destino/[id].tsx
import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { destinos } from '../../src/data/destinos';
import { usePlanes } from '../../src/context/PlanesContext';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { styles } from './destinoStyles';

export default function DestinoScreen() {
  const params = useLocalSearchParams<{ id: string; tour?: string; fromReserva?: string }>();
  const { id, tour: tourParam, fromReserva } = params;
  const router = useRouter();
  const { agregarDestino } = usePlanes();
  const { theme } = useUiTheme();
  const { user } = useAuth();

  const destino = destinos.find((d) => d.id === id);
  const tourInicial = useMemo(() => {
    if (!destino || !tourParam) return null;
    const decodedTour = decodeURIComponent(String(tourParam));
    return destino.tours?.find((t: any) => t.nombre === decodedTour) || null;
  }, [destino, tourParam]);

  const [tourSeleccionado, setTourSeleccionado] = useState<any | null>(tourInicial);

  if (!destino) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el destino.</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const isDark = theme === 'dark';
  const containerBackground = isDark ? '#020617' : '#f8fafc';

  return (
    <ScrollView
      style={{ backgroundColor: containerBackground }}
      contentContainerStyle={[styles.container, { backgroundColor: containerBackground }]}
    >
      <View style={styles.heroWrapper}>
        <Image source={{ uri: destino.imagen }} style={styles.heroImage} />
      </View>

      <Text style={[styles.title, isDark && { color: '#e5e7eb' }]}>{destino.nombre}</Text>
      <Text style={[styles.location, isDark && { color: '#9ca3af' }]}>{destino.ubicacion}</Text>
      <Text style={[styles.meta, isDark && { color: '#9ca3af' }]}>
        {destino.tipo} · {destino.duracion} · {destino.presupuesto}
      </Text>

      <Text style={[styles.price, isDark && { color: '#22c55e' }]}>Desde S/ {destino.precio} aprox.</Text>

      <Text style={[styles.sectionTitle, isDark && { color: '#e5e7eb' }]}>Descripción</Text>
      <Text style={[styles.paragraph, isDark && { color: '#cbd5f5' }]}>{destino.descripcion}</Text>

      {destino.gastos && (
        <>
          <Text style={[styles.sectionTitle, isDark && { color: '#e5e7eb' }]}>Distribución de gastos</Text>
          <View style={styles.chipRow}>
            {destino.gastos.alojamiento != null && (
              <View style={[styles.chip, isDark && { backgroundColor: '#020617', borderColor: '#1f2937' }]}>
                <Text style={[styles.chipText, isDark && { color: '#e5e7eb' }]}>Alojamiento: S/ {destino.gastos.alojamiento}</Text>
              </View>
            )}
            {destino.gastos.transporte != null && (
              <View style={[styles.chip, isDark && { backgroundColor: '#020617', borderColor: '#1f2937' }]}>
                <Text style={[styles.chipText, isDark && { color: '#e5e7eb' }]}>Transporte: S/ {destino.gastos.transporte}</Text>
              </View>
            )}
            {destino.gastos.alimentacion != null && (
              <View style={[styles.chip, isDark && { backgroundColor: '#020617', borderColor: '#1f2937' }]}>
                <Text style={[styles.chipText, isDark && { color: '#e5e7eb' }]}>Alimentación: S/ {destino.gastos.alimentacion}</Text>
              </View>
            )}
            {destino.gastos.entradas != null && (
              <View style={[styles.chip, isDark && { backgroundColor: '#020617', borderColor: '#1f2937' }]}>
                <Text style={[styles.chipText, isDark && { color: '#e5e7eb' }]}>Entradas: S/ {destino.gastos.entradas}</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Bloque de resumen rápido */}
      <View style={[styles.summaryBox, isDark && { backgroundColor: '#020617', borderColor: '#1f2937' }]}> 
        <Text style={[styles.summaryTitle, isDark && { color: '#e5e7eb' }]}>Resumen rápido</Text>
        <Text style={[styles.summaryItem, isDark && { color: '#cbd5f5' }]}>Duración: {destino.duracion}</Text>
        <Text style={[styles.summaryItem, isDark && { color: '#cbd5f5' }]}>Precio desde: S/ {destino.precio}</Text>
        <Text style={[styles.summaryItem, isDark && { color: '#cbd5f5' }]}>Presupuesto: {destino.presupuesto}</Text>
      </View>

      {destino.tours && destino.tours.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, isDark && { color: '#e5e7eb' }]}>Planes disponibles</Text>

          {tourSeleccionado && (
            <View
              style={[
                styles.selectedPlanBox,
                isDark
                  ? { backgroundColor: '#0b1120', borderColor: '#1d4ed8' }
                  : { backgroundColor: '#fff7ed', borderColor: '#f97316' },
              ]}
            >
              <Text style={[styles.selectedTitle, isDark && { color: '#e5e7eb' }]}>Plan elegido</Text>
              <Text style={[styles.selectedName, isDark && { color: '#e5e7eb' }]}>{tourSeleccionado.nombre}</Text>
              <Text style={[styles.selectedMeta, isDark && { color: '#9ca3af' }]}>
                {tourSeleccionado.duracion || destino.duracion}
              </Text>
              <Text style={[styles.selectedPrice, isDark && { color: '#22c55e' }]}>S/ {tourSeleccionado.precio}</Text>
            </View>
          )}

          {destino.tours.map((tour: any, index: number) => {
            const isSelected = tourSeleccionado?.nombre === tour.nombre;
            return (
              <Pressable
                key={index}
                style={[
                  styles.tourCard,
                  isDark && {
                    backgroundColor: '#020617',
                    borderColor: '#1f2937',
                  },
                  isSelected && {
                    borderColor: isDark ? '#3b82f6' : '#f97316',
                    borderWidth: 2,
                    backgroundColor: isDark ? '#020617' : '#fff7ed',
                  },
                ]}
                onPress={() => {
                  if (fromReserva) return; // Si venimos desde una reserva confirmada, no permitir cambiar de tour
                  setTourSeleccionado(tour);
                }}
              >
                <Text style={[styles.tourTitle, isDark && { color: '#e5e7eb' }]}>{tour.nombre}</Text>
                <Text style={[styles.paragraph, isDark && { color: '#cbd5f5' }]}>{tour.descripcion}</Text>
                <Text style={[styles.paragraph, isDark && { color: '#9ca3af' }]}>📅 {tour.duracion || destino.duracion}</Text>
                <Text style={[styles.tourPrice, isDark && { color: '#22c55e' }]}>Desde S/ {tour.precio}</Text>
              </Pressable>
            );
          })}
        </>
      )}

      {!fromReserva && (
        <Pressable
          style={[
            styles.primaryButton,
            { opacity: tourSeleccionado ? 1 : 0.5 },
          ]}
          onPress={() => {
            if (!tourSeleccionado) return;
            if (!user) {
              router.push('/login');
              return;
            }
            // Calcular duración en días a partir del texto (ej: "3 días / 2 noches")
            const duracionTexto = tourSeleccionado.duracion || destino.duracion;
            const matchDias = duracionTexto?.match(/(\d+)\s*d[ií]as?/i);
            const duracion_dias = matchDias ? parseInt(matchDias[1], 10) : 1;

            const planId = `${destino.id}-${(tourSeleccionado.nombre || 'plan').replace(/\s+/g, '-')}-${Date.now()}`;

            agregarDestino({
              id: planId,
              destino_id: destino.id,
              destino: destino.nombre,
              tour: tourSeleccionado.nombre,
              precio: tourSeleccionado.precio ?? destino.precio,
              duracion: duracionTexto,
              duracion_dias,
              gastos: tourSeleccionado.gastos || destino.gastos,
              ubicacion: destino.ubicacion,
              imagen: destino.imagen,
              estado: 'borrador',
              fecha_inicio: null,
              fecha_fin: null,
              resena_completada: false,
            });
            router.push('/(tabs)/mis-planes');
          }}
          disabled={!tourSeleccionado}
        >
          <Text style={styles.primaryButtonText}>
            {tourSeleccionado ? 'Agregar a mis planes' : 'Selecciona un plan para continuar'}
          </Text>
        </Pressable>
      )}

      {fromReserva && (
        <Pressable
          style={[styles.primaryButton]}
          onPress={() => {
            router.push(`/reserva/${fromReserva}`);
          }}
        >
          <Text style={styles.primaryButtonText}>Volver a mi reserva</Text>
        </Pressable>
      )}

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Volver</Text>
      </Pressable>
    </ScrollView>
  );
}
