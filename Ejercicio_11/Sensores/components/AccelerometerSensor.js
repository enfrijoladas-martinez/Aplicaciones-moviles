import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function AccelerometerSensor() {
  const [agitado, setAgitado] = useState(false);
  const [contadorAgitaciones, setContadorAgitaciones] = useState(0);

  useEffect(() => {
    const suscripcion = Accelerometer.addListener(({ x, y, z }) => {
      // Calculamos la fuerza de aceleración total (Magnitud)
      const magnitud = Math.sqrt(x * x + y * y + z * z);

      // Umbral para detectar una agitación fuerte (> 1.88g)
      if (magnitud > 1.88) {
        setAgitado(true);
        setContadorAgitaciones((prev) => prev + 1);
      } else {
        setAgitado(false);
      }
    });

    Accelerometer.setUpdateInterval(100);

    return () => suscripcion.remove();
  }, []);

  return (
    <View style={[styles.card, agitado && styles.cardAgitado]}>
      <Text style={styles.title}>Acelerómetro</Text>
      <Text style={styles.subtitle}>Aplicación: Detectar agitación</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          {agitado ? "🔔 ¡DISPOSITIVO AGITADO!" : "📱 Estado: Reposo"}
        </Text>
      </View>

      <Text style={styles.counterText}>
        Agitaciones detectadas: {contadorAgitaciones}
      </Text>

      <Button
        title="Reiniciar Contador"
        onPress={() => setContadorAgitaciones(0)}
        color="#2564eb"
      />
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
  cardAgitado: {
    backgroundColor: "#fef2f2",
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e344f",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  statusBox: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    marginBottom: 15,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  counterText: {
    fontSize: 16,
    color: "#334155",
    marginBottom: 15,
  },
});