// app/(tabs)/index.tsx

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, TextInput, ImageBackground, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { styles } from './index.styles';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { useChat } from '../../src/context/ChatContext';
import * as FileSystem from "expo-file-system";

// =======================================================
// FUNCIÓN NUEVA: ENVÍA EL AUDIO A BACKEND EN BASE64
// =======================================================
const sendAudioBase64 = async (uri: string, STT_URL: string, setSearchText: Function) => {
  try {
    // Convertir audio grabado en base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await fetch(STT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_base64: base64,
        format: "m4a",
      }),
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    const text = data.stt_text || data.transcript || "";

    if (text.trim().length > 0) {
      setSearchText(text);
    } else {
      Alert.alert("No se detectó voz", "No se reconoció audio. Intenta hablar más fuerte o más cerca del micrófono.");
    }

  } catch (err) {
    console.error("Error enviando audio base64:", err);
    Alert.alert("Error", "No se pudo enviar audio al servidor.");
  }
};

// =======================================================
// COMPONENTE PRINCIPAL
// =======================================================
export default function HomeScreen() {
  const { theme } = useUiTheme();
  const router = useRouter();
  const { setExternalUserMessage } = useChat();
  const [searchText, setSearchText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const isRecording = !!recording;
  const screenBackground = theme === 'light' ? '#f7e9d3' : '#020617';
  const isDark = theme === 'dark';
  const micBackground = isDark ? '#111827' : '#ffffff';
  const micIconColor = isDark ? '#e5e7eb' : '#111827';
  const searchBackground = isDark ? '#111827' : '#ffffff';
  const searchInputColor = isDark ? '#e5e7eb' : '#111827';
  const searchPlaceholderColor = '#9ca3af';
  const brandTitleColor = isDark ? '#f9fafb' : undefined;
  const brandSubtitleColor = isDark ? '#e5e7eb' : undefined;

  const STT_URL = "https://perugobackend-flask-production.up.railway.app/sts";

  // =======================================================
  // GRABAR Y ENVIAR AUDIO A BACKEND
  // =======================================================
  const toggleHomeRecording = useCallback(async () => {
    try {
      if (!recording) {
        const perm = await Audio.requestPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permiso denegado', 'Necesitamos acceso al micrófono.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const rec = new Audio.Recording();

        await rec.prepareToRecordAsync({
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
        });

        await rec.startAsync();
        setRecording(rec);

      } else {
        const current = recording;
        setRecording(null);

        await current.stopAndUnloadAsync();
        const uri = current.getURI();

        if (!uri) {
          Alert.alert("Error", "No se pudo obtener el audio grabado.");
          return;
        }

        // === AQUÍ SE ENVÍA BASE64, NO MULTIPART ===
        await sendAudioBase64(uri, STT_URL, setSearchText);
      }

    } catch (e) {
      console.error("Error en grabación:", e);
      Alert.alert("Error", "Hubo un problema con la grabación.");
      setRecording(null);
    }
  }, [recording]);

  // =======================================================
  // REDIRIGIR A CHAT
  // =======================================================
  const handleSearchToChat = useCallback(async () => {
    const value = searchText.trim();
    if (!value) return;
    await setExternalUserMessage(value);
    router.push('/(tabs)/chat');
  }, [router, searchText, setExternalUserMessage]);

  return (
    <View style={styles.screen}>
      <Header />
      <ImageBackground
        source={require('../../assets/images/home-hero.jpg')}
        style={styles.heroBackground}
        imageStyle={styles.heroImage}
      >
        <View style={[styles.heroOverlay, isDark ? styles.heroOverlayDark : styles.heroOverlayLight]}>
          <View style={styles.content}>
            <View style={styles.titleBlock}>
              <Text style={[styles.brandTitle, brandTitleColor ? { color: brandTitleColor } : null]}>PeruGo</Text>
              <Text style={[styles.brandSubtitle, brandSubtitleColor ? { color: brandSubtitleColor } : null]}>El Perú te habla</Text>
            </View>

            <Pressable
              style={[styles.micButton, { backgroundColor: micBackground }]}
              onPress={toggleHomeRecording}
            >
              <Feather
                name="mic"
                size={40}
                color={isRecording ? '#b91c1c' : micIconColor}
              />
            </Pressable>

            <View style={[styles.searchBox, { backgroundColor: searchBackground }]}>
              <TextInput
                placeholder="Busca un destino o di algo..."
                placeholderTextColor={searchPlaceholderColor}
                style={[styles.searchInput, { color: searchInputColor }]}
                value={searchText}
                onChangeText={setSearchText}
              />
              <Pressable onPress={handleSearchToChat}>
                <Feather name="search" size={20} color={searchInputColor} />
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

