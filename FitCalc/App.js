import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomModal from './components/CustomModal';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const calcular = () => {
    const p = parseFloat(peso);
    const a = parseFloat(altura);

    // Validar antes de dividir, para no terminar con NaN o Infinity
    if (isNaN(p) || isNaN(a) || p <= 0 || a <= 0) {
      setError('Escribe un peso y una altura validos');
      return;
    }

    setError('');

    const imc = (p / (a * a)).toFixed(2);
    setResultado({ imc, ...clasificar(imc) });
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.titulo}>FitCalc</Text>
      <Text style={styles.subtitulo}>Calculadora de indice de masa corporal</Text>

      <View style={styles.formulario}>

        <Text style={styles.etiqueta}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="70"
          value={peso}
          onChangeText={setPeso}
        />

        <Text style={styles.etiqueta}>Altura (m)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="1.75"
          value={altura}
          onChangeText={setAltura}
        />

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <Button title="Calcular IMC" onPress={calcular} />

      </View>

      <CustomModal
        visible={resultado !== null}
        resultado={resultado}
        onClose={() => setResultado(null)}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function clasificar(imc) {
  const valor = parseFloat(imc);
  if (valor < 18.5) return { categoria: 'Bajo peso', color: '#3b82f6' };
  if (valor < 25) return { categoria: 'Peso normal', color: '#22c55e' };
  if (valor < 30) return { categoria: 'Sobrepeso', color: '#f59e0b' };
  return { categoria: 'Obesidad', color: '#ef4444' };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  formulario: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  etiqueta: {
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  error: {
    color: '#ef4444',
    marginBottom: 10,
  },
});
