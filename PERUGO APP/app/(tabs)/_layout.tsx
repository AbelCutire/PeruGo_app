// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#e2e8f0',
          backgroundColor: '#ffffff',
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
