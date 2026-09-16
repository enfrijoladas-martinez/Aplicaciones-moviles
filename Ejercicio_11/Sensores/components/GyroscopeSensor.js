import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, Button } from "react-native";
import { Accelerometer } from "expo-sensors";

// Obtenemos el tamaño de la pantalla del dispositivo
const { width, height } = Dimensions.get("window");

const BOLA_TAMANO = 30;
const OBSTACULO_TAMANO = 80;
const META_TAMANO = 50;

export default function GyroscopeSensor() {
  // Posición inicial de la bola
  const [posicion, setPosicion] = useState({
    x: width / 2 - BOLA_TAMANO / 2,
    y: 100,
  });

  const [estadoJuego, setEstadoJuego] = useState("jugando");

  // Posición de la meta
  const meta = {
    x: width / 2 - META_TAMANO / 2,
    y: height - 150,
  };

  // Posición del obstáculo
  const obstaculo = {
    x: width / 2 - OBSTACULO_TAMANO / 2,
    y: height / 2 - OBSTACULO_TAMANO / 2,
  };

  useEffect(() => {
    const suscripcion = Accelerometer.addListener((datos) => {
      if (estadoJuego !== "jugando") return;

      setPosicion((posActual) => {
        const velocidad = 15;

        let nuevaX = posActual.x - datos.x * velocidad;
        let nuevaY = posActual.y + datos.y * velocidad;

        nuevaX = Math.max(0, Math.min(width - BOLA_TAMANO, nuevaX));
        nuevaY = Math.max(50, Math.min(height - BOLA_TAMANO - 50, nuevaY));

        // Colisión con Obstáculo
        if (
          nuevaX < obstaculo.x + OBSTACULO_TAMANO &&
          nuevaX + BOLA_TAMANO > obstaculo.x &&
          nuevaY < obstaculo.y + OBSTACULO_TAMANO &&
          nuevaY + BOLA_TAMANO > obstaculo.y
        ) {
          setEstadoJuego("perdiste");
        }

        // Colisión con Meta
        if (
          nuevaX < meta.x + META_TAMANO &&
          nuevaX + BOLA_TAMANO > meta.x &&
          nuevaY < meta.y + META_TAMANO &&
          nuevaY + BOLA_TAMANO > meta.y
        ) {
          setEstadoJuego("ganaste");
        }

        return { x: nuevaX, y: nuevaY };
      });
    });

    Accelerometer.setUpdateInterval(30);

    return () => suscripcion.remove();
  }, [estadoJuego]);

  const reiniciarJuego = () => {
    setPosicion({
      x: width / 2 - BOLA_TAMANO / 2,
      y: 100,
    });
    setEstadoJuego("jugando");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instrucciones}>Inclina el teléfono para moverte</Text>

      {/* Meta */}
      <View style={[styles.meta, { left: meta.x, top: meta.y }]}>
        <Text style={styles.textoElemento}>META</Text>
      </View>

      {/* Obstáculo */}
      <View style={[styles.obstaculo, { left: obstaculo.x, top: obstaculo.y }]}>
        <Text style={styles.textoElemento}>PELIGRO</Text>
      </View>

      {/* Bola del Jugador */}
      <View style={[styles.bola, { left: posicion.x, top: posicion.y }]} />

      {/* Pantalla de Victoria / Derrota */}
      {estadoJuego !== "jugando" && (
        <View style={styles.overlayModal}>
          <Text style={styles.textoResultado}>
            {estadoJuego === "ganaste" ? "¡Ganaste! 🎉" : "¡Chocaste! 💥"}
          </Text>
          <Button title="Jugar de nuevo" onPress={reiniciarJuego} color="#2564eb" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  instrucciones: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  bola: {
    position: "absolute",
    width: BOLA_TAMANO,
    height: BOLA_TAMANO,
    borderRadius: BOLA_TAMANO / 2,
    backgroundColor: "#38bdf8",
    elevation: 5,
  },
  obstaculo: {
    position: "absolute",
    width: OBSTACULO_TAMANO,
    height: OBSTACULO_TAMANO,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  meta: {
    position: "absolute",
    width: META_TAMANO,
    height: META_TAMANO,
    borderRadius: META_TAMANO / 2,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  textoElemento: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  overlayModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  textoResultado: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
});