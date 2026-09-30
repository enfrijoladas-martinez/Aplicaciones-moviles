import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../estilos/tema';

export default function SplashScreen({ alTerminar }) {
  const escala = useRef(new Animated.Value(0.4)).current;
  const opacidad = useRef(new Animated.Value(0)).current;
  const subida = useRef(new Animated.Value(25)).current;
  const giro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(escala, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
        Animated.timing(opacidad, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(subida, { toValue: 0, duration: 450, useNativeDriver: true }),
        Animated.timing(giro, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
      Animated.delay(700),
      Animated.timing(opacidad, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => alTerminar());
  }, []);

  const rotacion = giro.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={estilos.contenedor}>
      <Animated.View
        style={[
          estilos.circulo,
          { opacity: opacidad, transform: [{ scale: escala }, { rotate: rotacion }] },
        ]}
      >
        <Ionicons name="cube" size={64} color={colores.superficie} />
      </Animated.View>

      <Animated.View style={{ opacity: opacidad, transform: [{ translateY: subida }] }}>
        <Text style={estilos.titulo}>StockFacil</Text>
        <Text style={estilos.lema}>Control de inventario</Text>
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
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  titulo: {
    color: colores.superficie,
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  lema: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
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
