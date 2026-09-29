import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

const MATERIAS = [
  'Aplicaciones Moviles',
  'Base de Datos',
  'Redes de Computadoras',
  'Ingenieria de Software',
  'Sistemas Operativos',
  'Inteligencia Artificial',
];

export default function SearchScreen() {
  const [busqueda, setBusqueda] = useState('');

  const resultados = MATERIAS.filter(
    (m) => m.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Buscar</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe una materia..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={resultados}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.fila}>{item}</Text>}
        ListEmptyComponent={<Text style={styles.vacio}>Sin resultados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 14 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 16 },
  fila: { fontSize: 17, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  vacio: { color: '#9ca3af', marginTop: 16 },
});
