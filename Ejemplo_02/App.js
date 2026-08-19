import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DemoChildren from './components/DemoChildren';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.encabezado}>Ejemplo_02 - props.children</Text>

      {/* 1. children con un solo texto */}
      <DemoChildren titulo="Ejemplo 1: un solo hijo">
        <Text>Este texto viaja dentro de props.children.</Text>
      </DemoChildren>

      {/* 2. children con varios elementos */}
      <DemoChildren titulo="Ejemplo 2: varios hijos" color="#16a34a">
        <Text>Primer hijo</Text>
        <Text>Segundo hijo</Text>
        <View style={styles.caja}>
          <Text style={styles.cajaTexto}>Tercer hijo (una View completa)</Text>
        </View>
      </DemoChildren>

      {/* 3. componentes anidados: un DemoChildren dentro de otro */}
      <DemoChildren titulo="Ejemplo 3: anidado" color="#db2777">
        <Text>Adentro puede ir otro componente:</Text>
        <DemoChildren titulo="Hijo anidado" color="#f59e0b">
          <Text>Soy el nieto.</Text>
        </DemoChildren>
      </DemoChildren>

      {/* 4. sin children: se muestra el mensaje por defecto */}
      <DemoChildren titulo="Ejemplo 4: sin hijos" color="#64748b" />

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    padding: 24,
  },
  encabezado: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0f172a',
  },
  caja: {
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 8,
  },
  cajaTexto: {
    color: '#166534',
  },
});
