import { StyleSheet, Text, View } from 'react-native';

// Componente sin props: siempre pinta lo mismo.
export default function MiComponente() {
  return (
    <View style={styles.caja}>
      <Text style={styles.texto}>Soy MiComponente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    backgroundColor: '#1f2937',
    borderColor: '#38bdf8',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  texto: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
