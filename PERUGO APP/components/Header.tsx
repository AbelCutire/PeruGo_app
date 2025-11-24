import React, { useCallback, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { styles } from './header.styles';
import { useUiTheme } from '../src/context/UiThemeContext';
import { useAuth } from '../src/context/AuthContext';
import { useChat } from '../src/context/ChatContext';

export function Header() {
  const { theme, toggleTheme } = useUiTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { setExternalUserMessage } = useChat();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const isRecording = !!recording;

  const headerBackground = theme === 'light' ? '#8d1116' : '#4b0b0e';
  const themeIconName = theme === 'light' ? 'sun' : 'moon';
  const themeIconColor = theme === 'light' ? '#111827' : '#e5e7eb';

  const STT_URL = 'https://perugobackend-flask-production.up.railway.app/sts';

  const toggleHeaderRecording = useCallback(async () => {
    try {
      // Si no hay grabación activa, iniciamos una nueva
      if (!recording) {
        const perm = await Audio.requestPermissionsAsync();
        if (!perm.granted) {
          console.warn('Permiso de micrófono denegado');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const rec = new Audio.Recording();
        await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await rec.startAsync();
        setRecording(rec);
      } else {
        // Ya hay una grabación: la detenemos y enviamos a STT
        const current = recording;
        setRecording(null);
        try {
          await current.stopAndUnloadAsync();
          const uri = current.getURI();
          if (uri) {
            const formData = new FormData();
            formData.append('audio', {
              uri,
              name: 'input.wav',
              type: 'audio/wav',
            } as any);

            try {
              const res = await fetch(STT_URL, {
                method: 'POST',
                body: formData,
              });
              const data = await res.json();
              const text = data.llm_response || data.stt_text || data.text || '';
              if (text && text.trim()) {
                await setExternalUserMessage(String(text));
                router.push('/(tabs)/chat');
              }
            } catch (e) {
              console.warn('Error enviando audio a STT desde header', e);
            }
          }
        } catch (e) {
          console.warn('Error deteniendo grabación en header', e);
        }
      }
    } catch (e) {
      console.warn('Error manejando grabación en header', e);
      if (recording) {
        setRecording(null);
      }
    }
  }, [recording, router, setExternalUserMessage]);

  return (
    <View style={[styles.header, { backgroundColor: headerBackground }]}>
      <View style={styles.headerLeft}>
        <View style={styles.logoWrapper}>
          {/* Reemplaza la ruta del require con la ruta real de tu logo en assets */}
          {/* Ejemplo: <Image source={require('../assets/perugo-logo.png')} style={styles.logoImage} /> */}
          <Image
            source={require('../assets/images/perugo-logo.png')}
            style={styles.logoImage}
          />
        </View>
        <View>
          <Text style={styles.headerLogo}>PeruGo</Text>
          <Text style={styles.headerSubtitle}>El Perú te habla</Text>
        </View>
      </View>

      <View style={styles.headerButtonsRow}>
        <Pressable style={styles.iconButton} onPress={toggleHeaderRecording}>
          <Feather name="mic" size={20} color={isRecording ? '#b91c1c' : '#111827'} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={toggleTheme}>
          <Feather name={themeIconName} size={20} color={themeIconColor} />
        </Pressable>

        {user ? (
          // Usuario logueado: mostrar solo icono de perfil que abre la pestaña Perfil
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/perfil')}
          >
            <Feather name="user" size={20} color="#111827" />
          </Pressable>
        ) : (
          <>
            <Pressable
              style={styles.authButtonPrimary}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.authButtonPrimaryText}>Iniciar sesión</Text>
            </Pressable>
            <Pressable
              style={styles.authButtonSecondary}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.authButtonSecondaryText}>Registrarse</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
