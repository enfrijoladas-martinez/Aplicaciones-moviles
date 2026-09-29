import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

// Modal reutilizable: recibe el curso seleccionado y una funcion para cerrar.
export default function CustomModal({ visible, curso, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.fondo}>
        <View style={styles.tarjeta}>

          <Text style={styles.titulo}>{curso ? curso.nombre : ''}</Text>

          <Text style={styles.dato}>Profesor: {curso ? curso.profesor : ''}</Text>
          <Text style={styles.dato}>Creditos: {curso ? curso.creditos : ''}</Text>
          <Text style={styles.dato}>Horario: {curso ? curso.horario : ''}</Text>

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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dato: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 6,
  },
  boton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
