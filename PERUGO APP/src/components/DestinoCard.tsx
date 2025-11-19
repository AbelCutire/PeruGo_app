// src/components/DestinoCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { destinos } from '../data/destinos';

type Destino = (typeof destinos)[number];

export function DestinoCard({ destino }: { destino: Destino | any }) {
  const imageUri = String(destino.imagen ?? '').trim();
  const hasValidImage = imageUri.startsWith('http');

  return (
    <View style={styles.card}>
      {hasValidImage ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.textContainer}>
        <Text style={styles.title}>{destino.nombre}</Text>
        <Text style={styles.subtitle}>{destino.ubicacion}</Text>

        <Text style={styles.meta}>
          {destino.tipo} · {destino.duracion}
        </Text>

        <Text style={styles.price}>Desde ${destino.precio} USD</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  image: { width: '100%', height: 180 },
  textContainer: { padding: 12, gap: 4 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#64748b' },
  meta: { fontSize: 12, color: '#94a3b8' },
  price: { marginTop: 4, fontSize: 14, fontWeight: '600', color: '#16a34a' },
});
