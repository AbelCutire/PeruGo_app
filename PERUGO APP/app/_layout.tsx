// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Grupo principal con tabs */}
      <Stack.Screen name="(tabs)" />
      {/* Pantalla de detalle de destino */}
      <Stack.Screen name="destino/[id]" />
    </Stack>
  );
}
