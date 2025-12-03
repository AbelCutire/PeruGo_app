// app/(tabs)/mis-planes.tsx
import React from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlanes } from '../../src/context/PlanesContext';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { styles } from './misPlanesStyles';

export default function MisPlanesScreen() {
  const router = useRouter();
  const { planes } = usePlanes();
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';
  const containerBackground = isDark ? '#020617' : '#f8fafc';
  const titleColor = isDark ? '#f9fafb' : '#0f172a';
  const subtitleColor = isDark ? '#e5e7eb' : '#64748b';
  const hintColor = isDark ? '#cbd5f5' : '#94a3b8';
  // Tarjetas más profesionales en modo noche: fondo oscuro neutro con borde azul grisáceo
  const cardBackground = isDark ? '#020617' : '#ffffff';
  const cardBorderColor = isDark ? '#1e293b' : '#e2e8f0';
  const cardTitleColor = isDark ? '#e5e7eb' : '#0f172a';
  const cardSubtitleColor = isDark ? '#9ca3af' : '#64748b';
  const cardPriceColor = isDark ? '#22c55e' : '#16a34a';

  const estadoLabel: Record<string, string> = {
    borrador: 'Borrador',
    pendiente: 'Pendiente de pago',
    confirmado: 'Confirmado',
    cancelado: 'Cancelado',
    completado: 'Completado',
  };

  const estadoColor: Record<string, string> = {
    borrador: '#9ca3af',
    pendiente: '#facc15',
    confirmado: '#22c55e',
    cancelado: '#ef4444',
    completado: '#3b82f6',
  };

  return (
    <View style={[styles.container, { backgroundColor: containerBackground }]}>
      <Text style={[styles.title, { color: titleColor }]}>Mis planes</Text>

      {planes.length === 0 ? (
        <>
          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            Todavía no has agregado destinos a tus planes.
          </Text>
          <Text style={[styles.hint, { color: hintColor }]}>
            Ve a Explorar, entra a un destino y toca "Añadir a mis planes".
          </Text>
        </>
      ) : (
        <FlatList
          data={planes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/reserva/${item.id}`)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: cardBackground,
                  borderColor: cardBorderColor,
                  opacity: pressed ? 0.9 : 1,
                  borderLeftWidth: 6,
                  borderLeftColor: estadoColor[item.estado] || cardBorderColor,
                },
              ]}
            >
              {item.imagen ? (
                <Image source={{ uri: item.imagen }} style={styles.cardImage} />
              ) : null}
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: cardTitleColor }]}>{item.destino}</Text>
                {item.tour ? (
                  <Text style={[styles.cardSubtitle, { color: cardSubtitleColor }]}>{item.tour}</Text>
                ) : item.ubicacion ? (
                  <Text style={[styles.cardSubtitle, { color: cardSubtitleColor }]}>{item.ubicacion}</Text>
                ) : null}
                {item.estado && (
                  <Text style={[styles.cardEstado, { color: cardSubtitleColor }]}>
                    Estado: {estadoLabel[item.estado] || item.estado}
                  </Text>
                )}
                {item.fecha_inicio && item.fecha_fin && (
                  <Text style={[styles.cardEstado, { color: '#22c55e' }]}>
                    📅 {item.fecha_inicio} al {item.fecha_fin}
                  </Text>
                )}
                {item.precio != null ? (
                  <Text style={[styles.cardPrice, { color: cardPriceColor }]}>Desde S/ {item.precio}</Text>
                ) : null}
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
