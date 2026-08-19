import { StyleSheet, Text, View } from 'react-native';

// DemoChildren: demuestra el uso de props.children.
// Todo lo que se escriba ENTRE las etiquetas <DemoChildren> ... </DemoChildren>
// llega al componente dentro de la prop "children" y se pinta donde nosotros digamos.
export default function DemoChildren({ titulo, color = '#2563eb', children }) {
  return (
    <View style={[styles.tarjeta, { borderColor: color }]}>
      <View style={[styles.encabezado, { backgroundColor: color }]}>
        <Text style={styles.titulo}>{titulo}</Text>
      </View>

      {/* Aqui se renderiza el contenido que nos pasaron desde afuera */}
      <View style={styles.contenido}>
        {children ?? <Text style={styles.vacio}>Sin contenido (children vacio)</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  encabezado: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  titulo: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contenido: {
    padding: 12,
    gap: 6,
  },
  vacio: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});
