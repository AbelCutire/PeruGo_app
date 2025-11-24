import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { Destino } from '../data/destinos';
import { useUiTheme } from '../context/UiThemeContext';

export function DestinoCard({ destino }: { destino: Destino }) {
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';
  const cardBackground = isDark ? '#fbbf24' /* amarillo suave oscuro */ : '#ffffff';
  const titleColor = isDark ? '#111827' : '#0f172a';
  const locationColor = isDark ? '#1f2937' : '#64748b';
  const typeColor = isDark ? '#7c2d12' : '#0ea5e9';
  const descriptionColor = isDark ? '#1f2937' : '#475569';

  return (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      {destino.imagen ? (
        <Image source={{ uri: destino.imagen }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor }]}>{destino.nombre}</Text>
        <Text style={[styles.location, { color: locationColor }]}>{destino.ubicacion}</Text>
        <Text style={[styles.type, { color: typeColor }]}>{destino.tipo}</Text>
        {destino.descripcion ? (
          <Text style={[styles.description, { color: descriptionColor }]} numberOfLines={2}>
            {destino.descripcion}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 10,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  location: {
    fontSize: 13,
    color: '#64748b',
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0ea5e9',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
});
