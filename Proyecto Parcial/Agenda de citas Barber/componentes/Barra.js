import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colores } from '../estilos/tema';

export default function Barra({ proporcion, color }) {
  const ancho = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(ancho, {
      toValue: Math.max(0, Math.min(proporcion, 1)),
      duration: 780,
      useNativeDriver: false,
    }).start();
  }, [proporcion]);

  const relleno = ancho.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={estilos.canal}>
      <Animated.View style={[estilos.relleno, { width: relleno, backgroundColor: color }]} />
    </View>
  );
}

const estilos = StyleSheet.create({
  canal: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colores.borde,
    overflow: 'hidden',
  },
  relleno: {
    height: 8,
    borderRadius: 4,
  },
});
