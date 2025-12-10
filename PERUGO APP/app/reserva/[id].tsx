import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, Pressable, ScrollView, Modal, TextInput, Animated, Alert, ActivityIndicator } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { usePlanes } from '../../src/context/PlanesContext';
import { destinos } from '../../src/data/destinos';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { styles } from './reservaStyles';

const ESTADOS = ['borrador', 'pendiente', 'confirmado', 'cancelado', 'completado'] as const;

// ... (Funciones auxiliares buildPiePaths, formatearInputFecha, etc. se mantienen igual) ...
function buildPiePaths(values: number[], radius: number) {
  const total = values.reduce((acc, v) => acc + v, 0) || 1;
  let startAngle = -Math.PI / 2;
  const center = radius;

  return values.map((v) => {
    const sliceAngle = (v / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
    const d = [`M ${center} ${center}`, `L ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ');
    const path = { d };
    startAngle = endAngle;
    return path;
  });
}

function formatearInputFecha(text: string): string {
  const soloDigitos = text.replace(/[^0-9]/g, '').slice(0, 8);
  const partes = [] as string[];
  if (soloDigitos.length >= 2) partes.push(soloDigitos.slice(0, 2));
  else if (soloDigitos.length > 0) partes.push(soloDigitos);
  if (soloDigitos.length >= 4) partes.push(soloDigitos.slice(2, 4));
  else if (soloDigitos.length > 2) partes.push(soloDigitos.slice(2));
  if (soloDigitos.length > 4) partes.push(soloDigitos.slice(4));
  return partes.join('/');
}

function validarFechaDdMmAaaa(fecha: string): Date | null {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = fecha.match(regex);
  if (!match) return null;
  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const anio = parseInt(match[3], 10);
  if (anio < 1900 || anio > 2100) return null;
  if (mes < 1 || mes > 12) return null;
  if (dia < 1 || dia > 31) return null;
  const date = new Date(anio, mes - 1, dia);
  if (date.getFullYear() !== anio || date.getMonth() !== mes - 1 || date.getDate() !== dia) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (date < hoy) return null;
  return date;
}

function aDdMmAaaa(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function ReservaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { planes, actualizarPlan, loading: loadingPlanes } = usePlanes(); // Usamos loading del contexto
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';

  const plan = planes.find((p) => p.id === id);
  
  // Buscar info visual del destino (imagen, ubicación) localmente
  const destino = useMemo(() => {
    if (!plan) return null;
    return destinos.find((d) => d.id === plan.destino_id) || null;
  }, [plan]);

  const [estado, setEstado] = useState<typeof ESTADOS[number]>(plan?.estado || 'borrador');
  const [mostrarFechaModal, setMostrarFechaModal] = useState(false);
  const [mostrarPagoModal, setMostrarPagoModal] = useState(false);
  const [mostrarResenaModal, setMostrarResenaModal] = useState(false);
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [guardando, setGuardando] = useState(false); // Estado local para acciones asíncronas

  // Sincronizar estado local si cambia el plan (ej: al recargar contexto)
  useEffect(() => {
    if (plan) setEstado(plan.estado);
  }, [plan]);

  const gastosSource = plan?.gastos || destino?.gastos || {};
  const gastosEntries = Object.entries(gastosSource);
  const totalGastos = gastosEntries.reduce((acc, [, v]) => acc + (v as number), 0);

  const values = gastosEntries.map(([, v]) => v as number);
  const radius = 70;
  const paths = buildPiePaths(values, radius);
  const chartOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if ((estado === 'confirmado' || estado === 'completado') && gastosEntries.length > 0) {
      Animated.timing(chartOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    } else {
      chartOpacity.setValue(0);
    }
  }, [estado, gastosEntries.length, chartOpacity]);

  // --- MANEJADORES DE ACCIONES CONECTADOS AL BACKEND ---

  const handleConfirmarFecha = async () => {
    if (!fechaSeleccionada) {
      Alert.alert('Fecha requerida', 'Ingresa la fecha de inicio');
      return;
    }
    const inicio = validarFechaDdMmAaaa(fechaSeleccionada);
    if (!inicio) {
      Alert.alert('Fecha inválida', 'Revisa el formato DD/MM/AAAA');
      return;
    }

    try {
      setGuardando(true);
      const dias = plan?.duracion_dias || 1;
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + dias);

      await actualizarPlan(plan!.id, {
        estado: 'pendiente',
        fecha_inicio: aDdMmAaaa(inicio),
        fecha_fin: aDdMmAaaa(fin),
      });
      
      setMostrarFechaModal(false);
      setFechaSeleccionada('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la fecha');
    } finally {
      setGuardando(false);
    }
  };

  const handlePagar = async () => {
    if (procesandoPago) return;
    try {
      setProcesandoPago(true);
      // Simular delay de pasarela
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await actualizarPlan(plan!.id, { estado: 'confirmado' });
      
      setMostrarPagoModal(false);
      Alert.alert('¡Pago Exitoso!', 'Tu viaje ha sido confirmado.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el pago');
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleCancelar = async () => {
    Alert.alert('Cancelar Plan', '¿Estás seguro de cancelar este plan?', [
      { text: 'No', style: 'cancel' },
      { 
        text: 'Sí, cancelar', 
        style: 'destructive',
        onPress: async () => {
          try {
            setGuardando(true);
            await actualizarPlan(plan!.id, { estado: 'cancelado' });
          } catch (error) {
            Alert.alert('Error', 'No se pudo cancelar');
          } finally {
            setGuardando(false);
          }
        }
      }
    ]);
  };

  const handleReagendar = async () => {
    try {
      setGuardando(true);
      await actualizarPlan(plan!.id, { estado: 'pendiente' }); // Regresar a pendiente o borrador
    } catch (error) {
      Alert.alert('Error', 'No se pudo reagendar');
    } finally {
      setGuardando(false);
    }
  };

  const handleEnviarResena = async () => {
    // Aquí podrías llamar a una API de reseñas si la tuvieras
    // Por ahora actualizamos el estado del plan
    try {
      setGuardando(true);
      await actualizarPlan(plan!.id, { resena_completada: true });
      setMostrarResenaModal(false);
      Alert.alert('Gracias', 'Tu reseña ha sido enviada.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la reseña');
    } finally {
      setGuardando(false);
    }
  };

  // --- RENDERIZADO ---

  if (loadingPlanes && !plan) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <Text style={{ color: isDark ? '#e5e7eb' : '#0f172a', marginBottom: 12 }}>
          Reserva no encontrada o eliminada.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#8b5cf6', '#f97316', '#9ca3af'];
  const containerBg = isDark ? '#020617' : '#f8fafc';
  const headerTextColor = isDark ? '#f9fafb' : '#0f172a';
  const cardBg = isDark ? '#020617' : '#ffffff';
  const cardBorder = isDark ? '#111827' : '#e2e8f0';
  const labelColor = isDark ? '#e5e7eb' : '#475569';

  const colorEstadoBorde: Record<string, string> = {
    borrador: '#9ca3af',
    pendiente: '#facc15',
    confirmado: '#22c55e',
    cancelado: '#ef4444',
    completado: '#3b82f6',
  };

  const etiquetaEstado: Record<string, string> = {
    borrador: 'Borrador',
    pendiente: 'Pendiente de pago',
    confirmado: 'Confirmado',
    cancelado: 'Cancelado',
    completado: 'Completado',
  };

  const renderAcciones = () => {
    if (guardando) return <ActivityIndicator color="#f97316" />;

    switch (estado) {
      case 'borrador':
        return (
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => setMostrarFechaModal(true)}>
            <Text style={styles.primaryButtonText}>Editar y confirmar</Text>
          </Pressable>
        );
      case 'pendiente':
        return (
          <>
            <Pressable 
              style={[styles.actionButton, styles.secondaryButton, { borderColor: '#ef4444' }]} 
              onPress={handleCancelar}
            >
              <Text style={[styles.secondaryButtonText, { color: '#ef4444' }]}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => setMostrarPagoModal(true)}>
              <Text style={styles.primaryButtonText}>Pagar</Text>
            </Pressable>
          </>
        );
      case 'confirmado':
        return (
          <>
            <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => router.push(`/destino/${plan.destino_id}`)}>
              <Text style={[styles.secondaryButtonText, { color: headerTextColor }]}>Ver destino</Text>
            </Pressable>
            <Pressable 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={async () => {
                setGuardando(true);
                await actualizarPlan(plan.id, { estado: 'completado' });
                setGuardando(false);
              }}
            >
              <Text style={styles.primaryButtonText}>Marcar completado</Text>
            </Pressable>
          </>
        );
      case 'cancelado':
        return (
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={handleReagendar}>
            <Text style={styles.primaryButtonText}>Reagendar</Text>
          </Pressable>
        );
      case 'completado':
        return (
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => !plan.resena_completada && setMostrarResenaModal(true)}>
            <Text style={styles.primaryButtonText}>
              {plan.resena_completada ? 'Reseña enviada' : 'Dejar reseña'}
            </Text>
          </Pressable>
        );
      default: return null;
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: containerBg }} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.headerBack}>
          <Text style={[styles.headerBackIcon, { color: headerTextColor }]}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: headerTextColor }]}>Reserva · {plan.destino}</Text>
      </View>

      <View style={[styles.reservaCard, { backgroundColor: cardBg, borderColor: cardBorder, borderLeftColor: colorEstadoBorde[estado] || '#ccc', borderLeftWidth: 6 }]}>
        <View style={styles.reservaCardHeader}>
          <Image source={{ uri: plan.imagen || destino?.imagen }} style={styles.reservaImage} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.reservaDestino, { color: headerTextColor }]}>{plan.destino}</Text>
            <Text style={[styles.reservaTour, { color: labelColor }]}>Tour {plan.tour} • S/ {plan.precio}</Text>
            <Text style={[styles.reservaEtapa, { color: labelColor }]}>Estado: {etiquetaEstado[estado]}</Text>
            {plan.fecha_inicio && (
              <Text style={[styles.reservaFechas, { color: '#22c55e' }]}>📅 {plan.fecha_inicio} al {plan.fecha_fin}</Text>
            )}
          </View>
        </View>
        <View style={styles.reservaActionsRow}>{renderAcciones()}</View>
      </View>

      {/* Gráfico de gastos */}
      {(estado === 'confirmado' || estado === 'completado') && gastosEntries.length > 0 && (
        <Animated.View style={{ opacity: chartOpacity }}>
          <View style={[styles.chartCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.chartTitle, { color: headerTextColor }]}>Gastos Estimados</Text>
            <Text style={[styles.chartSubtitle, { color: labelColor }]}>Total: S/ {totalGastos}</Text>
            <View style={styles.chartRow}>
              <Svg width={radius * 2} height={radius * 2}>
                {paths.map((p, i) => <Path key={i} d={p.d} fill={COLORS[i % COLORS.length]} />)}
              </Svg>
              <View style={styles.legend}>
                {gastosEntries.map(([k, v], i) => (
                  <View key={k} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: COLORS[i % COLORS.length] }]} />
                    <Text style={[styles.legendText, { color: labelColor }]}>{k}: S/ {v as number}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Modales (Fecha, Pago, Reseña) - Reutilizan estilos y lógica similar a antes pero llaman a las funciones handle... */}
      
      {/* Modal Fecha */}
      <Modal visible={mostrarFechaModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headerTextColor }]}>Fecha de viaje</Text>
            <TextInput
              value={fechaSeleccionada}
              onChangeText={t => setFechaSeleccionada(formatearInputFecha(t))}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={labelColor}
              style={[styles.paymentInput, { color: headerTextColor, borderColor: cardBorder, marginBottom: 15 }]}
            />
            <View style={styles.modalButtonsRow}>
              <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => setMostrarFechaModal(false)}>
                <Text style={[styles.secondaryButtonText, { color: headerTextColor }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={handleConfirmarFecha} disabled={guardando}>
                <Text style={styles.primaryButtonText}>{guardando ? 'Guardando...' : 'Confirmar'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Pago */}
      <Modal visible={mostrarPagoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headerTextColor }]}>Realizar Pago</Text>
            <Text style={{color: labelColor, marginBottom: 10}}>Total a pagar: S/ {plan.precio}</Text>
            
            {/* Inputs de tarjeta simulados */}
            <TextInput placeholder="Número de tarjeta" placeholderTextColor={labelColor} style={[styles.paymentInput, {borderColor: cardBorder, color: headerTextColor, marginBottom: 10}]} editable={!procesandoPago}/>
            
            <View style={styles.modalButtonsRow}>
              <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => setMostrarPagoModal(false)}>
                <Text style={[styles.secondaryButtonText, { color: headerTextColor }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={handlePagar} disabled={procesandoPago}>
                {procesandoPago ? <ActivityIndicator color="#fff"/> : <Text style={styles.primaryButtonText}>Pagar S/ {plan.precio}</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Reseña */}
      <Modal visible={mostrarResenaModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <Text style={[styles.modalTitle, { color: headerTextColor }]}>Tu Experiencia</Text>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(s => (
                <Pressable key={s} onPress={() => setEstrellas(s)}>
                  <Text style={{fontSize: 30, color: s <= estrellas ? '#fbbf24' : '#555'}}>★</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={comentario}
              onChangeText={setComentario}
              placeholder="Escribe tu reseña..."
              placeholderTextColor={labelColor}
              multiline
              style={[styles.reviewInput, { color: headerTextColor, borderColor: cardBorder }]}
            />
            <View style={styles.modalButtonsRow}>
              <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => setMostrarResenaModal(false)}>
                <Text style={[styles.secondaryButtonText, { color: headerTextColor }]}>Cerrar</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={handleEnviarResena} disabled={guardando}>
                <Text style={styles.primaryButtonText}>{guardando ? 'Enviando...' : 'Publicar'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}