import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../estilos/tema';

export default function SplashScreen({ alTerminar }) {
  const escala = useRef(new Animated.Value(0.3)).current;
  const opacidad = useRef(new Animated.Value(0)).current;
  const subida = useRef(new Animated.Value(26)).current;
  const trazo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(escala, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
        Animated.timing(opacidad, { toValue: 1, duration: 520, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(subida, { toValue: 0, duration: 420, useNativeDriver: true }),
        Animated.timing(trazo, { toValue: 1, duration: 850, useNativeDriver: false }),
      ]),
      Animated.delay(520),
      Animated.timing(opacidad, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start(() => alTerminar());
  }, []);

  const ancho = trazo.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={estilos.contenedor}>
      <Animated.View
        style={[estilos.circulo, { opacity: opacidad, transform: [{ scale: escala }] }]}
      >
        <Ionicons name="navigate" size={56} color={colores.superficie} />
      </Animated.View>

      <Animated.View style={{ opacity: opacidad, transform: [{ translateY: subida }] }}>
        <Text style={estilos.titulo}>RutaOptima</Text>
        <Text style={estilos.lema}>Planeacion de entregas</Text>

        <View style={estilos.canal}>
          <Animated.View style={[estilos.relleno, { width: ancho }]} />
        </View>
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
    backgroundColor: colores.lienzo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circulo: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: colores.primario,
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
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
  canal: {
    height: 4,
    width: 180,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'center',
    marginTop: 22,
    overflow: 'hidden',
  },
  relleno: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colores.acento,
  },
  pie: {
    position: 'absolute',
    bottom: 46,
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 13,
  },
});
