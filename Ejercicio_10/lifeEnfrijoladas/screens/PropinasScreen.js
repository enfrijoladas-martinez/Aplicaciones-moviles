import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function PropinasScreen() {
  const [monto, setMonto] = useState('');
  const [propina, setPropina] = useState(null);

  const calcularPropina = (porcentaje) => {
    const m = parseFloat(monto);
    if (m) {
      const res = (m * porcentaje).toFixed(2);
      setPropina(res);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora de Propinas</Text>
      <TextInput
        style={styles.input}
        placeholder="Monto de la cuenta ($)"
        keyboardType="numeric"
        onChangeText={setMonto}
      />
      <View style={styles.btnRow}>
        <Button title="10%" onPress={() => calcularPropina(0.10)} />
        <Button title="15%" onPress={() => calcularPropina(0.15)} />
        <Button title="20%" onPress={() => calcularPropina(0.20)} />
      </View>
      {propina && <Text style={styles.result}>Propina: ${propina}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-around', width: '80%' },
  result: { fontSize: 18, marginTop: 20, fontWeight: 'bold' }
});