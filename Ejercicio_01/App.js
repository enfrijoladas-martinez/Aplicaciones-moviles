import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import MiComponente from './componentes/MiComponente';
import Mensaje from './componentes/Mensaje';

export default function App() {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Ejercicio 01 - Componentes</Text>

      {/* Componente sin props */}
      <MiComponente />

      {/* Imagen traida de internet: necesita width y height si o si */}
      <Image
        style={styles.imagen}
        source={{ uri: 'https://picsum.photos/200' }}
      />

      {/* El mismo componente reutilizado con props distintas */}
      <Mensaje
        autor="Elias"
        contenido="Este texto llega por props."
      />

      <Mensaje
        autor="Sistema"
        contenido="Y este tambien, con otro color."
        color="#f59e0b"
      />

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagen: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});
