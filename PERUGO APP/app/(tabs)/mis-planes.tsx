// app/(tabs)/mis-planes.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MisPlanesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis planes</Text>
      <Text style={styles.subtitle}>
        Aquí más adelante podrás ver y gestionar los destinos que guardes como parte de tus próximos viajes.
      </Text>
      <Text style={styles.hint}>
        Próximamente: integración con almacenamiento local para guardar tus planes.
      </Text>
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
});
