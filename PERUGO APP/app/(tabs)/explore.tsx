// app/(tabs)/explore.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { destinos as destinosLocales } from '../../src/data/destinos';
import { DestinoCard } from '../../src/components/DestinoCard';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { styles } from './exploreStyles';

export default function ExploreScreen() {
  const { theme } = useUiTheme();

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

  const isDark = theme === 'dark';
  const containerBackground = isDark ? '#020617' : '#f8fafc';
  const titleColor = isDark ? '#f9fafb' : '#0f172a';
  const subtitleColor = isDark ? '#e5e7eb' : '#64748b';
  const countColor = isDark ? '#cbd5f5' : '#94a3b8';
  const inputBackground = isDark ? '#020617' : '#ffffff';
  const inputBorderColor = isDark ? '#334155' : '#cbd5e1';
  const inputTextColor = isDark ? '#f9fafb' : '#0f172a';
  const inputPlaceholderColor = isDark ? '#e5e7eb' : '#64748b';
  const filterChipBackground = isDark ? '#1e293b' : '#e0f2fe';
  const filterTextColor = isDark ? '#e5e7eb' : '#0f172a';

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: containerBackground }]}>
      <Text style={[styles.title, { color: titleColor }]}>Explorar destinos</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>
        Busca por ciudad, tipo de viaje o deja el buscador vacío para ver todo.
      </Text>

      <TextInput
        placeholder="Buscar destino, ciudad o tipo (ej: Cusco, playa, aventura)"
        value={busqueda}
        onChangeText={setBusqueda}
        placeholderTextColor={inputPlaceholderColor}
        style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorderColor, color: inputTextColor }]}
      />

      <View style={styles.filtersRow}>
        <Pressable style={[styles.filterChip, { backgroundColor: filterChipBackground }]} onPress={() => setBusqueda('playa')}>
          <Text style={[styles.filterText, { color: filterTextColor }]}>Playa</Text>
        </Pressable>
        <Pressable style={[styles.filterChip, { backgroundColor: filterChipBackground }]} onPress={() => setBusqueda('aventura')}>
          <Text style={[styles.filterText, { color: filterTextColor }]}>Aventura</Text>
        </Pressable>
        <Pressable style={[styles.filterChip, { backgroundColor: filterChipBackground }]} onPress={() => setBusqueda('cultural')}>
          <Text style={[styles.filterText, { color: filterTextColor }]}>Cultural</Text>
        </Pressable>
      </View>

      <Text style={[styles.count, { color: countColor }]}>
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
