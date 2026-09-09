import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DadosScreen() {
  const [dado, setDado] = useState(1);

  const lanzarDado = () => {
    const numero = Math.floor(Math.random() * 6) + 1;
    setDado(numero);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juego de Dados</Text>
      <Text style={styles.dadoText}>🎲 {dado}</Text>
      <Button title="Lanzar Dado" onPress={lanzarDado} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  dadoText: { fontSize: 80, marginBottom: 20 }
});