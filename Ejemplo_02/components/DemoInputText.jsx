import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";

export default function MyInputText() {
  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState([]);

  // Agrega lo escrito a la lista y limpia el input
  const enviarMensaje = () => {
    if (texto === "") return;
    setMensajes([...mensajes, texto]);
    setTexto("");
  };

  return (
    <View style={styles.pantalla}>

      {/* 1. ARRIBA (amarillo): vacio */}
      <View style={styles.arriba} />

      {/* 2. ENMEDIO (azul): los mensajes con scroll */}
      <View style={styles.enmedio}>
        <ScrollView>
          {mensajes.map((m, i) => (
            <Text key={i} style={styles.mensaje}>{m}</Text>
          ))}
        </ScrollView>
      </View>

      {/* 3. ABAJO (rojo): escribir y enviar */}
      <View style={styles.abajo}>
        <TextInput
          style={styles.input}
          placeholder="Escribe aqui..."
          value={texto}
          onChangeText={t => setTexto(t)}
        />
        <Button title="Enviar" onPress={enviarMensaje} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  arriba: {
    flex: 1,
    backgroundColor: "#FFE81A",
  },
  enmedio: {
    flex: 1,
    backgroundColor: "#5B8DEF",
    padding: 12,
  },
  abajo: {
    flex: 1,
    backgroundColor: "#FF6B5A",
    justifyContent: "center",
    padding: 16,
    gap: 12,
  },
  mensaje: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
  },
});
