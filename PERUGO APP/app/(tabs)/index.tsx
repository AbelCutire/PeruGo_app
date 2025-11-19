// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { styles } from './index.styles';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Header />

      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.brandTitle}>PerúGo</Text>
          <Text style={styles.brandSubtitle}>El Perú te habla</Text>
        </View>

        <Pressable style={styles.micButton}>
          <Feather name="mic" size={40} color="#111827" />
        </Pressable>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Busca un destino o di algo..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
      </View>
    </View>
  );
}
