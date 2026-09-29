import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Perfil
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Nombre: Elias Martinez Garcia
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Matricula: 202260437
      </Text>

      <Text style={{ fontSize: 16 }}>
        Materia: Aplicaciones Moviles
      </Text>

    </View>
  );
}
