// app/destino/[id].tsx
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { destinos } from '../../src/data/destinos';

export default function DestinoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const destino = destinos.find((d) => d.id === id);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: destino.imagen }} style={styles.heroImage} />

      <Text style={styles.title}>{destino.nombre}</Text>
      <Text style={styles.location}>{destino.ubicacion}</Text>
      <Text style={styles.meta}>
        {destino.tipo} · {destino.duracion} · {destino.presupuesto}
      </Text>

      <Text style={styles.price}>Desde ${destino.precio} USD aprox.</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.paragraph}>{destino.descripcion}</Text>

      {destino.gastos && (
        <>
          <Text style={styles.sectionTitle}>Distribución de gastos</Text>
          <View style={styles.chipRow}>
            {destino.gastos.alojamiento != null && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Alojamiento: ${destino.gastos.alojamiento}
                </Text>
              </View>
            )}
            {destino.gastos.transporte != null && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Transporte: ${destino.gastos.transporte}
                </Text>
              </View>
            )}
            {destino.gastos.alimentacion != null && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Alimentación: ${destino.gastos.alimentacion}
                </Text>
              </View>
            )}
            {destino.gastos.entradas != null && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Entradas: ${destino.gastos.entradas}
                </Text>
              </View>
            )}
          </View>
        </>
      )}

      {destino.tours && destino.tours.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Tours sugeridos</Text>
          {destino.tours.map((tour: any, index: number) => (
            <View key={index} style={styles.tourCard}>
              <Text style={styles.tourTitle}>{tour.nombre}</Text>
              <Text style={styles.paragraph}>{tour.descripcion}</Text>
              <Text style={styles.tourPrice}>Desde ${tour.precio} USD</Text>
            </View>
          ))}
        </>
      )}

      <Pressable
        style={styles.primaryButton}
        onPress={() => alert('Aquí luego podrás guardar este destino en tus planes')}
      >
        <Text style={styles.primaryButtonText}>Añadir a mis planes</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Volver</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: '100%', height: 260 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  location: {
    fontSize: 14,
    color: '#64748b',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  meta: {
    fontSize: 13,
    color: '#94a3b8',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    color: '#16a34a',
    fontWeight: '700',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  paragraph: {
    fontSize: 14,
    color: '#334155',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  chip: {
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12, color: '#0f172a' },
  tourCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tourTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  tourPrice: { fontSize: 13, fontWeight: '600', color: '#16a34a' },
  primaryButton: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#0f766e',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    marginTop: 8,
    marginHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: { color: '#0f172a', fontWeight: '600' },
  backButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 999,
  },
  backButtonText: { fontWeight: '600' },
});
