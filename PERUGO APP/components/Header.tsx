import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './header.styles';

export function Header() {
  return (
    <View style={styles.header}>
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
        <Pressable style={styles.iconButton}>
          <Feather name="send" size={20} color="#111827" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Feather name="mic" size={20} color="#111827" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Feather name="sun" size={20} color="#111827" />
        </Pressable>

        <Pressable style={styles.authButtonPrimary}>
          <Text style={styles.authButtonPrimaryText}>Iniciar sesión</Text>
        </Pressable>
        <Pressable style={styles.authButtonSecondary}>
          <Text style={styles.authButtonSecondaryText}>Registrarse</Text>
        </Pressable>
      </View>
    </View>
  );
}
