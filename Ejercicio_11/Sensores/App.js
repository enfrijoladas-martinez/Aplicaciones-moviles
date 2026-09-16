import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import AccelerometerSensor from './components/AccelerometerSensor';
import GyroscopeSensor from './components/GyroscopeSensor';
import PedometerSensor from './components/PedometerSensor';
import MagnetometerSensor from './components/MagnetometerSensor';

export default function App() {
  const [vistaActual, setVistaActual] = useState('menu');

  return (
    <SafeAreaView style={styles.container}>
      {vistaActual === 'menu' && (
        <ScrollView contentContainerStyle={styles.menuContainer}>
          <Text style={styles.title}>Sensores del Dispositivo</Text>
          <Text style={styles.subtitle}>Selecciona una práctica:</Text>

          {/* 1. Acelerómetro */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setVistaActual('acelerometro')}
          >
            <Text style={styles.buttonText}>1. Acelerómetro</Text>
            <Text style={styles.buttonSubtext}>Detectar agitación</Text>
          </TouchableOpacity>

          {/* 2. Giroscopio */}
          <TouchableOpacity
            style={[styles.button, styles.buttonGame]}
            onPress={() => setVistaActual('giroscopio')}
          >
            <Text style={styles.buttonText}>2. Giroscopio</Text>
            <Text style={styles.buttonSubtext}>Detectar inclinación / rotación</Text>
          </TouchableOpacity>

          {/* 3. Magnetómetro */}
          <TouchableOpacity
            style={[styles.button, styles.buttonCompass]}
            onPress={() => setVistaActual('magnetometro')}
          >
            <Text style={styles.buttonText}>3. Magnetómetro</Text>
            <Text style={styles.buttonSubtext}>Brújula</Text>
          </TouchableOpacity>

          {/* 4. Podómetro */}
          <TouchableOpacity
            style={[styles.button, styles.buttonSteps]}
            onPress={() => setVistaActual('podometro')}
          >
            <Text style={styles.buttonText}>4. Podómetro</Text>
            <Text style={styles.buttonSubtext}>Contador de pasos</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* VISTAS */}
      {vistaActual !== 'menu' && (
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setVistaActual('menu')}
          >
            <Text style={styles.backButtonText}>← Volver al Menú</Text>
          </TouchableOpacity>

          {vistaActual === 'acelerometro' && <AccelerometerSensor />}
          {vistaActual === 'giroscopio' && <GyroscopeSensor />}
          {vistaActual === 'magnetometro' && <MagnetometerSensor />}
          {vistaActual === 'podometro' && <PedometerSensor />}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  menuContainer: { padding: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#2564eb', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 15 },
  buttonGame: { backgroundColor: '#059669' },
  buttonCompass: { backgroundColor: '#0284c7' },
  buttonSteps: { backgroundColor: '#7c3aed' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonSubtext: { color: '#e2e8f0', fontSize: 13, marginTop: 3 },
  contentContainer: { flex: 1 },
  backButton: { backgroundColor: '#1e293b', padding: 15, paddingTop: 45 },
  backButtonText: { color: '#38bdf8', fontSize: 16, fontWeight: 'bold' },
});