// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiTheme } from '../../src/context/UiThemeContext';

export default function TabsLayout() {
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';

  // Día: fondo turquesa muy suave, selección en verde
  // Noche: fondo gris claro, selección en azul medio
  const tabBarBackground = isDark ? '#9ca3af' : '#e0f7fa';
  const tabBarBorder = isDark ? '#6b7280' : '#b2ebf2';
  const activeTint = isDark ? '#2563eb' : '#16a34a';
  const inactiveTint = '#64748b';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: tabBarBorder,
          backgroundColor: tabBarBackground,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => <Feather name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mis-planes"
        options={{
          title: 'Mis planes',
          tabBarIcon: ({ color, size }) => <Feather name="send" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="robot" color={color} size={size} />
          ),
        }}
      />
      {/* Ocultar ruta perfil del tab bar pero mantener la pantalla accesible */}
      <Tabs.Screen
        name="perfil"
        options={{
          href: null,
        }}
      />
      {/* Ocultar ruta index.styles (archivo de estilos) para que no aparezca como tab */}
      <Tabs.Screen
        name="index.styles"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
