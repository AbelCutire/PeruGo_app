// app/(tabs)/perfil.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { useAuth } from '../../src/context/AuthContext';

export default function PerfilScreen() {
  const { theme } = useUiTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const backgroundColor = theme === 'light' ? '#f8fafc' : '#020617';

  // Si no hay usuario logueado, mostrar acciones de login/registro
  if (!user) {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
        <Text style={styles.title}>Mi perfil</Text>
        <Text style={styles.subtitle}>
          Inicia sesión o crea una cuenta para guardar tus planes y preferencias de viaje.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Datos básicos derivados del usuario logueado
  const nombre = user.username || 'Viajero PeruGo';
  const correo = user.email;
  const tipoViajero = 'Explorador de aventuras';

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Mi perfil</Text>
      <Text style={styles.subtitle}>Gestiona tu información, preferencias y experiencia de viaje.</Text>

      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{(nombre || correo).charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{nombre}</Text>
            <Text style={styles.email}>{correo}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo de viajero</Text>
          <Text style={styles.infoValue}>{tipoViajero}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>País base</Text>
          <Text style={styles.infoValue}>Perú</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferencias de viaje</Text>
        <Text style={styles.sectionText}>
          · Prefiero viajes de 3 a 5 días{'\n'}
          · Presupuesto medio por viaje{'\n'}
          · Destinos con naturaleza y cultura
        </Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => alert('Editar perfil')}>
        <Text style={styles.primaryButtonText}>Editar perfil</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => {
          logout();
          router.replace('/login');
        }}
      >
        <Text style={styles.secondaryButtonText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
    backgroundColor: '#f8fafc',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  nameBlock: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  email: { fontSize: 13, color: '#64748b' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  infoLabel: { fontSize: 13, color: '#64748b' },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#0f172a' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  sectionText: { fontSize: 13, lineHeight: 18, color: '#334155' },
  primaryButton: {
    backgroundColor: '#0f766e',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderColor: '#cbd5e1',
    borderWidth: 1,
    paddingVertical: 11,
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
});
