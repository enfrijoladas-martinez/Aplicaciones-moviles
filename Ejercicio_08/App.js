import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomModal from './components/CustomModal';

const CURSOS = [
  { id: '1', nombre: 'Aplicaciones Moviles', profesor: 'Ing. Ramirez', creditos: 8, horario: 'Lun y Mie 19:00' },
  { id: '2', nombre: 'Base de Datos', profesor: 'Mtra. Lopez', creditos: 6, horario: 'Mar y Jue 17:00' },
  { id: '3', nombre: 'Redes de Computadoras', profesor: 'Ing. Soto', creditos: 6, horario: 'Lun y Vie 15:00' },
  { id: '4', nombre: 'Ingenieria de Software', profesor: 'Dr. Mendoza', creditos: 8, horario: 'Mie y Vie 18:00' },
  { id: '5', nombre: 'Sistemas Operativos', profesor: 'Mtro. Castillo', creditos: 7, horario: 'Mar y Jue 19:00' },
  { id: '6', nombre: 'Inteligencia Artificial', profesor: 'Dra. Fuentes', creditos: 8, horario: 'Sab 09:00' },
];

export default function App() {
  const [seleccionado, setSeleccionado] = useState(null);

  // Abrir el modal = guardar el curso tocado. Cerrar = ponerlo en null.
  const abrir = (curso) => setSeleccionado(curso);
  const cerrar = () => setSeleccionado(null);

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Mis materias</Text>

      <FlatList
        data={CURSOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.fila} onPress={() => abrir(item)}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.subtexto}>{item.profesor}</Text>
          </TouchableOpacity>
        )}
      />

      <CustomModal
        visible={seleccionado !== null}
        curso={seleccionado}
        onClose={cerrar}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  fila: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtexto: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});
