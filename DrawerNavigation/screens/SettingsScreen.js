import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ajustes</Text>

      <View style={styles.fila}>
        <Text style={styles.etiqueta}>Notificaciones</Text>
        <Switch value={notificaciones} onValueChange={setNotificaciones} />
      </View>

      <View style={styles.fila}>
        <Text style={styles.etiqueta}>Modo oscuro</Text>
        <Switch value={modoOscuro} onValueChange={setModoOscuro} />
      </View>

      <Text style={styles.nota}>
        Notificaciones: {notificaciones ? 'activadas' : 'desactivadas'}
        {'\n'}
        Modo oscuro: {modoOscuro ? 'activado' : 'desactivado'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  fila: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  etiqueta: { fontSize: 17 },
  nota: { marginTop: 24, color: '#6b7280', fontSize: 14, lineHeight: 21 },
});
