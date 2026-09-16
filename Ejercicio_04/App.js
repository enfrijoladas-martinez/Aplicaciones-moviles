import React, { useState } from "react";
import { StyleSheet, Button, View, SafeAreaView, TextInput } from "react-native";
import CustomModal from "./componentes/CustomModal";

export default function App() {

  const [modalVisible, setModalVisible] = useState(false);
  const objetoContenido = {
    valor: "Juan Perez Jolote",

  };
  const [texto, setTexto] = useState("");
  return (

    <SafeAreaView style={styles.container}>

      <View>

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          contenido={{ valor: texto }}
        />

        <TextInput
          placeholder="Escribe algo..."
          value={texto}
          onChangeText={setTexto}
          style={styles.input}
        />

        <Button
          title="Abrir modal"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: 250,
  },

});