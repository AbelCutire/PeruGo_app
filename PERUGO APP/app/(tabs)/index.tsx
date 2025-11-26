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
  const searchPlaceholderColor = isDark ? '#9ca3af' : '#9ca3af';
  const brandTitleColor = isDark ? '#f9fafb' : undefined;
  const brandSubtitleColor = isDark ? '#e5e7eb' : undefined;

	const STT_URL = 'https://perugobackend-flask-production.up.railway.app/sts';

	const toggleHomeRecording = useCallback(async () => {
		try {
			if (!recording) {
				// 1er toque: iniciar grabación
				const perm = await Audio.requestPermissionsAsync();
				if (!perm.granted) {
					Alert.alert('Permiso denegado', 'Necesitamos acceso al micrófono para esta función.');
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
				// 2º toque: detener y enviar a STT
				const current = recording;
				setRecording(null);
				
				try {
					await current.stopAndUnloadAsync();
					const uri = current.getURI();
					
					if (!uri) {
						Alert.alert('Error', 'No se pudo obtener el audio grabado.');
						return;
					}

					// Crear FormData correctamente para React Native
					const formData = new FormData();
					
					// React Native necesita un objeto con uri, type y name
					formData.append('audio', {
						uri: uri,
						type: 'audio/wav',
						name: 'recording.wav',
					} as any);

					console.log('Enviando audio a:', STT_URL);

					const response = await fetch(STT_URL, {
						method: 'POST',
						body: formData,
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					});

					console.log('Response status:', response.status);

					if (!response.ok) {
						const errorText = await response.text();
						console.error('Error del servidor:', errorText);
						throw new Error(`Error del servidor: ${response.status}`);
					}

					const data = await response.json();
					console.log('Respuesta del servidor:', data);

					// Intentar obtener el texto de diferentes campos posibles
					const text = data.llm_response || data.stt_text || data.text || '';
					
					if (text && text.trim()) {
						setSearchText(String(text));
						// Opcionalmente, puedes enviar directamente al chat:
						// await setExternalUserMessage(String(text));
						// router.push('/(tabs)/chat');
					} else {
						Alert.alert('Sin respuesta', 'No se pudo transcribir el audio. Intenta hablar más claro.');
					}

				} catch (error) {
					console.error('Error procesando audio:', error);
					Alert.alert(
						'Error',
						'No se pudo procesar el audio. Verifica tu conexión e intenta nuevamente.'
					);
				}
			}
		} catch (error) {
			console.error('Error en grabación:', error);
			Alert.alert('Error', 'Hubo un problema con la grabación. Intenta nuevamente.');
			
			if (recording) {
				try {
					await recording.stopAndUnloadAsync();
				} catch (e) {
					console.error('Error deteniendo grabación:', e);
				}
				setRecording(null);
			}
		}
	}, [recording]);

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
							<Text style={[styles.brandSubtitle, brandSubtitleColor ? { color: brandSubtitleColor } : null]}>El Peru te habla</Text>
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

						<View style={[styles.searchBox, { backgroundColor: searchBackground }] }>
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
