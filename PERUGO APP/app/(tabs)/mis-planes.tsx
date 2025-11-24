// app/(tabs)/mis-planes.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlanes } from '../../src/context/PlanesContext';
import { useUiTheme } from '../../src/context/UiThemeContext';

export default function MisPlanesScreen() {
  const router = useRouter();
  const { planes } = usePlanes();
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';
  const containerBackground = isDark ? '#020617' : '#f8fafc';
  const titleColor = isDark ? '#f9fafb' : '#0f172a';
  const subtitleColor = isDark ? '#e5e7eb' : '#64748b';
  const hintColor = isDark ? '#cbd5f5' : '#94a3b8';
  const cardBackground = isDark ? '#fbbf24' : '#ffffff';
  const cardBorderColor = isDark ? '#facc15' : '#e2e8f0';
  const cardTitleColor = isDark ? '#111827' : '#0f172a';
  const cardSubtitleColor = isDark ? '#1f2937' : '#64748b';
  const cardPriceColor = isDark ? '#166534' : '#16a34a';

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
                { backgroundColor: cardBackground, borderColor: cardBorderColor, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              {item.imagen ? (
                <Image source={{ uri: item.imagen }} style={styles.cardImage} />
              ) : null}
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: cardTitleColor }]}>{item.nombre}</Text>
                {item.ubicacion ? (
                  <Text style={[styles.cardSubtitle, { color: cardSubtitleColor }]}>{item.ubicacion}</Text>
                ) : null}
                {item.precio != null ? (
                  <Text style={[styles.cardPrice, { color: cardPriceColor }]}>Desde ${item.precio} USD aprox.</Text>
                ) : null}
              </View>
            </Pressable>
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
