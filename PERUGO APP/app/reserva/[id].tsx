// app/reserva/[id].tsx
import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { usePlanes } from '../../src/context/PlanesContext';
import { destinos } from '../../src/data/destinos';
import { useUiTheme } from '../../src/context/UiThemeContext';

const ETAPAS = ['borrador', 'confirmado', 'pendiente', 'pagado', 'finalizado'] as const;

function buildPiePaths(values: number[], radius: number) {
  const total = values.reduce((acc, v) => acc + v, 0) || 1;
  let startAngle = -Math.PI / 2; // empezar arriba
  const center = radius;

  return values.map((v) => {
    const sliceAngle = (v / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

    const d = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    const path = { d };
    startAngle = endAngle;
    return path;
  });
}

export default function ReservaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { planes } = usePlanes();
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';

  const plan = planes.find((p) => p.id === id);
  const destino = useMemo(() => {
    if (!plan) return null;
    return destinos.find((d) => d.id === plan.id) || null;
  }, [plan]);

  const [nivel, setNivel] = useState(0);

  if (!plan || !destino) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <Text style={{ color: isDark ? '#e5e7eb' : '#0f172a', marginBottom: 12 }}>
          No se encontró la reserva.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const gastosEntries = Object.entries(destino.gastos || {});
  const totalGastos = gastosEntries.reduce((acc, [, v]) => acc + (v as number), 0);

  const values = gastosEntries.map(([, v]) => v as number);
  const radius = 70;
  const paths = buildPiePaths(values, radius);

  const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#8b5cf6', '#f97316', '#9ca3af'];

  const etapaActual = ETAPAS[nivel];

  const avanzar = () => {
    if (nivel < ETAPAS.length - 1) setNivel(nivel + 1);
  };

  const retroceder = () => {
    if (nivel > 0) setNivel(nivel - 1);
  };

  const containerBg = isDark ? '#020617' : '#f8fafc';
  const headerText = isDark ? '#f9fafb' : '#0f172a';
  const cardBg = isDark ? '#0b1120' : '#ffffff';
  const cardBorder = isDark ? '#1f2937' : '#e2e8f0';
  const labelColor = isDark ? '#e5e7eb' : '#475569';

  const renderEtapaButtons = () => {
    if (etapaActual === 'borrador') {
      return (
        <Pressable style={styles.primaryButton} onPress={avanzar}>
          <Text style={styles.primaryButtonText}>Confirmar</Text>
        </Pressable>
      );
    }

    if (etapaActual === 'confirmado') {
      return (
        <>
          <Pressable
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push(`/destino/${destino.id}`)}
          >
            <Text style={[styles.secondaryButtonText, { color: headerText }]}>Ver destino</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={avanzar}>
            <Text style={styles.primaryButtonText}>Seguir</Text>
          </Pressable>
        </>
      );
    }

    if (etapaActual === 'pendiente') {
      return (
        <>
          <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => {}}>
            <Text style={[styles.secondaryButtonText, { color: headerText }]}>Simular pago</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={avanzar}>
            <Text style={styles.primaryButtonText}>Confirmar pago</Text>
          </Pressable>
        </>
      );
    }

    if (etapaActual === 'pagado') {
      return (
        <>
          <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => {}}>
            <Text style={[styles.secondaryButtonText, { color: headerText }]}>Reagendar</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={avanzar}>
            <Text style={styles.primaryButtonText}>Seguir</Text>
          </Pressable>
        </>
      );
    }

    // finalizado
    return (
      <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => {}}>
        <Text style={styles.primaryButtonText}>Dejar reseña</Text>
      </Pressable>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: containerBg }} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.headerBack}>
          <Text style={[styles.headerBackIcon, { color: headerText }]}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: headerText }]}>Reserva</Text>
      </View>

      {/* Tarjeta principal de reserva */}
      <View style={[styles.reservaCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.reservaCardHeader}>
          {plan.imagen ? (
            <Image source={{ uri: plan.imagen }} style={styles.reservaImage} />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={[styles.reservaDestino, { color: headerText }]}>{plan.nombre}</Text>
            <Text style={[styles.reservaEtapa, { color: labelColor }]}>Etapa: {etapaActual.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.reservaActionsRow}>{renderEtapaButtons()}</View>
      </View>

      {/* Panel de gráfico de costos */}
      <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text style={[styles.chartTitle, { color: headerText }]}>Distribución de gastos: {destino.nombre}</Text>
        <Text style={[styles.chartSubtitle, { color: labelColor }]}>Gasto total: S/ {totalGastos}</Text>

        <View style={styles.chartRow}>
          <Svg width={radius * 2} height={radius * 2}>
            {paths.map((p, index) => (
              <Path key={index} d={p.d} fill={COLORS[index % COLORS.length]} />
            ))}
          </Svg>

          <View style={styles.legend}>
            {gastosEntries.map(([name, value], index) => (
              <View key={name} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: COLORS[index % COLORS.length] },
                  ]}
                />
                <Text style={[styles.legendText, { color: labelColor }]}>
                  {name} — S/ {value as number}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Navegación de pasos */}
      <View style={styles.stepsRow}>
        <Pressable style={[styles.stepButton, nivel === 0 && styles.stepButtonDisabled]} onPress={retroceder} disabled={nivel === 0}>
          <Text style={styles.stepButtonText}>Anterior</Text>
        </Pressable>
        <Pressable
          style={[
            styles.stepButton,
            nivel === ETAPAS.length - 1 && styles.stepButtonDisabled,
          ]}
          onPress={avanzar}
          disabled={nivel === ETAPAS.length - 1}
        >
          <Text style={styles.stepButtonText}>Siguiente</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.backToPlansButton, { borderColor: isDark ? '#334155' : '#cbd5f5', backgroundColor: isDark ? '#020617' : '#ffffff' }]}
        onPress={() => router.push('/(tabs)/mis-planes')}
      >
        <Text style={[styles.backToPlansText, { color: headerText }]}>Volver a Mis planes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButtonText: {
    fontWeight: '600',
    color: '#0f172a',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerBack: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  headerBackIcon: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginLeft: 4,
  },
  reservaCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  reservaCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reservaImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  reservaDestino: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  reservaEtapa: {
    marginTop: 4,
    fontSize: 13,
  },
  reservaActionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 4,
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 14,
  },
  chartCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  legend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  stepButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    alignItems: 'center',
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  stepButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  backToPlansButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  backToPlansText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
