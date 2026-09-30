import { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { moneda } from '../estilos/tema';

export default function Contador({ valor, estilo, formato = 'entero' }) {
  const animado = useRef(new Animated.Value(0)).current;
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    const suscripcion = animado.addListener(({ value }) => setMostrado(value));

    Animated.timing(animado, {
      toValue: valor,
      duration: 900,
      useNativeDriver: false,
    }).start();

    return () => animado.removeListener(suscripcion);
  }, [valor]);

  const texto = formato === 'moneda' ? moneda(mostrado) : String(Math.round(mostrado));

  return <Text style={estilo}>{texto}</Text>;
}
