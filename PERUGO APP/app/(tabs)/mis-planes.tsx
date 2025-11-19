// app/(tabs)/mis-planes.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { usePlanes } from '../../src/context/PlanesContext';

export default function MisPlanesScreen() {
  const { planes } = usePlanes();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis planes</Text>

      {planes.length === 0 ? (
        <>
          <Text style={styles.subtitle}>
            Todavía no has agregado destinos a tus planes.
          </Text>
          <Text style={styles.hint}>
            Ve a Explorar, entra a un destino y toca "Añadir a mis planes".
          </Text>
        </>
      ) : (
        <FlatList
          data={planes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.imagen ? (
                <Image source={{ uri: item.imagen }} style={styles.cardImage} />
              ) : null}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                {item.ubicacion ? (
                  <Text style={styles.cardSubtitle}>{item.ubicacion}</Text>
                ) : null}
                {item.precio != null ? (
                  <Text style={styles.cardPrice}>Desde ${item.precio} USD aprox.</Text>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  hint: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 12,
  },
  listContent: {
    marginTop: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  cardImage: {
    width: 96,
    height: 96,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 4,
  },
});
