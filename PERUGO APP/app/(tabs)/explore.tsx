// app/(tabs)/explore.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { destinos as destinosLocales } from '../../src/data/destinos';
import { DestinoCard } from '../../src/components/DestinoCard';

export default function ExploreScreen() {
  const [busqueda, setBusqueda] = useState('');
  const [destinos, setDestinos] = useState<any[]>(destinosLocales);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        setLoading(true);
        // API pública de la web PeruGo desplegada en Vercel
        const res = await fetch('https://perugo.app.vercel.app/api/destinos');
        if (!res.ok) {
          throw new Error('Error al obtener destinos de la API');
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDestinos(data as any[]);
        }
      } catch (error) {
        console.warn('Usando destinos locales por fallo en API:', error);
        setDestinos(destinosLocales);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinos();
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return destinos;
    return destinos.filter((d) => {
      const nombre = (d.nombre ?? '').toString().toLowerCase();
      const ubicacion = (d.ubicacion ?? '').toString().toLowerCase();
      const tipo = (d.tipo ?? '').toString().toLowerCase();
      return (
        nombre.includes(q) ||
        ubicacion.includes(q) ||
        tipo.includes(q)
      );
    });
  }, [busqueda, destinos]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Explorar destinos</Text>
      <Text style={styles.subtitle}>
        Busca por ciudad, tipo de viaje o deja el buscador vacío para ver todo.
      </Text>

      <TextInput
        placeholder="Buscar destino, ciudad o tipo (ej: Cusco, playa, aventura)"
        value={busqueda}
        onChangeText={setBusqueda}
        style={styles.input}
      />

      <View style={styles.filtersRow}>
        <Pressable style={styles.filterChip} onPress={() => setBusqueda('playa')}>
          <Text style={styles.filterText}>Playa</Text>
        </Pressable>
        <Pressable style={styles.filterChip} onPress={() => setBusqueda('aventura')}>
          <Text style={styles.filterText}>Aventura</Text>
        </Pressable>
        <Pressable style={styles.filterChip} onPress={() => setBusqueda('cultural')}>
          <Text style={styles.filterText}>Cultural</Text>
        </Pressable>
      </View>

      <Text style={styles.count}>
        {loading
          ? 'Cargando destinos...'
          : `${filtrados.length} destino(s) encontrado(s)`}
      </Text>

      {filtrados.map((destino) => (
        <Link key={destino.id} href={`/destino/${destino.id}`} asChild>
          <Pressable>
            <DestinoCard destino={destino} />
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    fontSize: 14,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
  },
  filterText: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
  },
  count: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 4,
  },
});
