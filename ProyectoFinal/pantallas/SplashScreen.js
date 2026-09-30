import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../estilos/tema';

export default function SplashScreen({ alTerminar }) {
  const escala = useRef(new Animated.Value(0.3)).current;
  const opacidad = useRef(new Animated.Value(0)).current;
  const subida = useRef(new Animated.Value(28)).current;
  const pulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(escala, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
        Animated.timing(opacidad, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
      Animated.timing(subida, { toValue: 0, duration: 420, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1.12, duration: 320, useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]),
      Animated.delay(550),
      Animated.timing(opacidad, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start(() => alTerminar());
  }, []);

  return (
    <View style={estilos.contenedor}>
      <Animated.View
        style={[
          estilos.circulo,
          { opacity: opacidad, transform: [{ scale: Animated.multiply(escala, pulso) }] },
        ]}
      >
        <Ionicons name="calendar" size={60} color={colores.superficie} />
      </Animated.View>

      <Animated.View style={{ opacity: opacidad, transform: [{ translateY: subida }] }}>
        <Text style={estilos.titulo}>Mi Agenda</Text>
        <Text style={estilos.lema}>Control de citas y clientes</Text>
      </Animated.View>

      <Animated.Text style={[estilos.pie, { opacity: opacidad }]}>
        Elias Martinez Garcia
      </Animated.Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circulo: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  titulo: {
    color: colores.superficie,
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  lema: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
  pie: {
    position: 'absolute',
    bottom: 46,
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
  },
});
