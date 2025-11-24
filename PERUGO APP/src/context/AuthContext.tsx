import React, { createContext, useContext, useState, ReactNode } from 'react';

export type User = {
  id: string;
  email: string;
  username?: string;
};

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const BASE_URL = 'https://perugo-backend-production.up.railway.app';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Error de comunicación con el servidor');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al iniciar sesión');
    }

    if (data.token) {
      setToken(data.token);
    }
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
      });
    } else {
      // Fallback: si el backend no devuelve user, crear uno mínimo con el email usado en login.
      setUser({
        id: 'local-' + email,
        email,
      });
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Error de comunicación con el servidor');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al registrar usuario');
    }

    if (data.token) {
      setToken(data.token);
    }
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
      });
    } else {
      // Fallback: si el backend no devuelve user en el registro, usar los datos enviados.
      setUser({
        id: 'local-' + email,
        email,
        username,
      });
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
}
