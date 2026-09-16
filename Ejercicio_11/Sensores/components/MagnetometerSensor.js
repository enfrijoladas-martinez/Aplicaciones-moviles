import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Magnetometer } from "expo-sensors";

export default function MagnetometerSensor() {
  const [angulo, setAngulo] = useState(0);

  useEffect(() => {
    const suscripcion = Magnetometer.addListener((data) => {
      let { x, y } = data;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      setAngulo(Math.round(angle));
    });

    Magnetometer.setUpdateInterval(100);

    return () => suscripcion.remove();
  }, []);

  const obtenerDireccion = (deg) => {
    if (deg >= 337.5 || deg < 22.5) return "Norte (N)";
    if (deg >= 22.5 && deg < 67.5) return "Noreste (NE)";
    if (deg >= 67.5 && deg < 112.5) return "Este (E)";
    if (deg >= 112.5 && deg < 157.5) return "Sureste (SE)";
    if (deg >= 157.5 && deg < 202.5) return "Sur (S)";
    if (deg >= 202.5 && deg < 247.5) return "Suroeste (SO)";
    if (deg >= 247.5 && deg < 292.5) return "Oeste (O)";
    if (deg >= 292.5 && deg < 337.5) return "Noroeste (NO)";
    return "Norte (N)";
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Magnetómetro</Text>
      <Text style={styles.subtitle}>Aplicación: Brújula</Text>

      <View style={[styles.compassContainer, { transform: [{ rotate: `${-angulo}deg` }] }]}>
        <Text style={styles.compassArrow}>⬆</Text>
      </View>

      <Text style={styles.gradosText}>{angulo}°</Text>
      <Text style={styles.direccionText}>{obtenerDireccion(angulo)}</Text>
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
  subtitle: { fontSize: 14, color: "#64748b", marginBottom: 20 },
  compassContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#0284c7",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  compassArrow: { fontSize: 50, color: "#ef4444" },
  gradosText: { fontSize: 36, fontWeight: "bold", color: "#0f172a" },
  direccionText: { fontSize: 18, color: "#0284c7", fontWeight: "600", marginTop: 5 },
});