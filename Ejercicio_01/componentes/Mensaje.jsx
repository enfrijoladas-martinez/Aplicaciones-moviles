import { StyleSheet, Text, View } from 'react-native';

// Componente con props: el mismo componente sirve para varios mensajes
// porque el texto y el color se los mandamos desde afuera.
export default function Mensaje({ autor, contenido, color = '#22c55e' }) {
  return (
    <View style={[styles.caja, { borderLeftColor: color }]}>
      <Text style={[styles.autor, { color: color }]}>{autor}</Text>
      <Text style={styles.contenido}>{contenido}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    backgroundColor: '#111827',
    borderLeftWidth: 4,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    width: 260,
  },
  autor: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contenido: {
    color: '#e5e7eb',
    fontSize: 15,
  },
});
