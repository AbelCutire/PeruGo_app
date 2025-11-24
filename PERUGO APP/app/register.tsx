import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Campos incompletos', 'Completa usuario, correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      await register(username, email, password);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo registrar el usuario.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        placeholderTextColor="#9ca3af"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.primaryButtonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
      </Pressable>

      <Pressable style={styles.linkButton} onPress={handleGoLogin}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#0f172a',
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#0f766e',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '500',
  },
});
