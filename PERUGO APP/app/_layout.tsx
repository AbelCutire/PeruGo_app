// app/_layout.tsx
import { Stack } from 'expo-router';
import { PlanesProvider } from '../src/context/PlanesContext';

export default function RootLayout() {
  return (
    <PlanesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Grupo principal con tabs */}
        <Stack.Screen name="(tabs)" />
        {/* Pantalla de detalle de destino */}
        <Stack.Screen name="destino/[id]" />
      </Stack>
    </PlanesProvider>
  );
}
