import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.inicial}>E</Text>
      </View>

      <Text style={styles.titulo}>Perfil</Text>

      <Text style={styles.dato}>Nombre: Elias Martinez Garcia</Text>
      <Text style={styles.dato}>Matricula: 202260437</Text>
      <Text style={styles.dato}>Materia: Aplicaciones Moviles</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  avatar: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#2563eb',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  inicial: { color: '#ffffff', fontSize: 40, fontWeight: 'bold' },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },
  dato: { fontSize: 16, color: '#374151', marginBottom: 6 },
});
