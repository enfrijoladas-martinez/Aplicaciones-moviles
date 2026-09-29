import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';

const DATOS = ['React Native', 'Expo', 'JavaScript', 'Navegacion', 'Componentes', 'Sensores'];

export default function SearchScreen() {
  const [busqueda, setBusqueda] = useState('');

  const resultados = DATOS.filter(
    (d) => d.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Buscar
      </Text>

      <TextInput
        placeholder="Escribe para buscar..."
        value={busqueda}
        onChangeText={setBusqueda}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 5
        }}
      />

      <FlatList
        data={resultados}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 18, paddingVertical: 8 }}>{item}</Text>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>Sin resultados</Text>
        }
      />

    </View>
  );
}
