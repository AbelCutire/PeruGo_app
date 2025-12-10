import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definimos la URL de tu backend real
const BASE_URL = 'https://perugo-backend-production.up.railway.app';

export type User = {
  id: string;
  email: string;
  username?: string;
};

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean; // Para saber si estamos verificando sesión
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUsername: (username: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cargar sesión guardada al iniciar la app
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error cargando sesión:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // 2. Función Login conectada al Backend
  const login = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al iniciar sesión');
    }

    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      // Guardar en el teléfono
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  // 3. Función Register conectada al Backend
  const register = async (username: string, email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al registrar usuario');
    }

    // Nota: Si tu backend hace login automático tras registro, guarda el token aquí.
    // Si no, el usuario deberá hacer login después. Asumimos el flujo actual.
  };

  // 4. Logout (Borrar todo del teléfono)
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  // 5. Actualizar Perfil
  const updateUsername = async (username: string) => {
    if (!token) throw new Error('No hay sesión activa');

    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo actualizar');
    }

    if (data.user) {
      setUser(data.user);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return ctx;
}