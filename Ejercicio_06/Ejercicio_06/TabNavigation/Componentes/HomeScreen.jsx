import React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Inicio
      </Text>

      <Text style={{ fontSize: 16, textAlign: 'center' }}>
        Pantalla principal de la app. Usa las pestanas de abajo para moverte
        entre secciones.
      </Text>

    </View>
  );
}
