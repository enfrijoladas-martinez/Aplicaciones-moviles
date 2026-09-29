import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Inicio</Text>

      <Text style={styles.texto}>
        Desliza desde el borde izquierdo para abrir el menu, o usa el boton.
      </Text>

      {/* navigation.openDrawer() abre el cajon por codigo */}
      <Pressable style={styles.boton} onPress={() => navigation.openDrawer()}>
        <Text style={styles.botonTexto}>Abrir menu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  texto: { fontSize: 15, color: '#4b5563', textAlign: 'center', marginBottom: 24 },
  boton: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 13, paddingHorizontal: 30 },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
