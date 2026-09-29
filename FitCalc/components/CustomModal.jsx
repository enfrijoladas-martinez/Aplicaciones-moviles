import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

// Muestra el resultado del IMC. El color cambia segun la categoria.
export default function CustomModal({ visible, resultado, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.fondo}>
        <View style={styles.tarjeta}>

          <Text style={styles.etiqueta}>Tu IMC es</Text>

          <Text style={[styles.valor, { color: resultado ? resultado.color : '#000' }]}>
            {resultado ? resultado.imc : ''}
          </Text>

          <Text style={[styles.categoria, { color: resultado ? resultado.color : '#000' }]}>
            {resultado ? resultado.categoria : ''}
          </Text>

          <Pressable style={styles.boton} onPress={onClose}>
            <Text style={styles.botonTexto}>Cerrar</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: 280,
  },
  etiqueta: {
    fontSize: 16,
    color: '#6b7280',
  },
  valor: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  categoria: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  boton: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 15,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
