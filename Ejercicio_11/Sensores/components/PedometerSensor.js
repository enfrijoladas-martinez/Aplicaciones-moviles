import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Pedometer } from "expo-sensors";

export default function PedometerSensor() {
  const [isAvailable, setIsAvailable] = useState("verificando");
  const [pasosTotales, setPasosTotales] = useState(0);
  const [pasosBase, setPasosBase] = useState(0);

  useEffect(() => {
    let subscription;

    const iniciarPodometro = async () => {
      const disponible = await Pedometer.isAvailableAsync();
      setIsAvailable(disponible ? "Disponible ✅" : "No disponible ❌");

      if (disponible) {
        subscription = Pedometer.watchStepCount((result) => {
          setPasosTotales(result.steps);
        });
      }
    };

    iniciarPodometro();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // Función para reiniciar el contador visual a 0
  const reiniciarPasos = () => {
    setPasosBase(pasosTotales);
  };

  const pasosMostrados = pasosTotales - pasosBase;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Podómetro</Text>
      <Text style={styles.subtitle}>Aplicación: Contador de pasos</Text>

      <Text style={styles.status}>Estado del Sensor: {isAvailable}</Text>
      <Text style={styles.pasosText}>{pasosMostrados}</Text>
      <Text style={styles.label}>Pasos registrados en esta sesión</Text>

      <View style={styles.buttonContainer}>
        <Button title="Reiniciar Pasos" onPress={reiniciarPasos} color="#2564eb" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    margin: 20,
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#1e344f" },
  subtitle: { fontSize: 14, color: "#64748b", marginBottom: 15 },
  status: { fontSize: 12, color: "#475569", marginBottom: 15 },
  pasosText: { fontSize: 56, fontWeight: "bold", color: "#0284c7" },
  label: { fontSize: 14, color: "#64748b", marginTop: 5, marginBottom: 20 },
  buttonContainer: {
    width: "100%",
  },
});