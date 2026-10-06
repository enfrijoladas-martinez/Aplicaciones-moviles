import { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { moneda } from '../estilos/tema';

export default function Contador({ valor, estilo, formato = 'entero', decimales = 2 }) {
  const animado = useRef(new Animated.Value(0)).current;
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    const suscripcion = animado.addListener(({ value }) => setMostrado(value));

    Animated.timing(animado, {
      toValue: valor,
      duration: 850,
      useNativeDriver: false,
    }).start();

    return () => animado.removeListener(suscripcion);
  }, [valor]);

  let texto = String(Math.round(mostrado));
  if (formato === 'moneda') texto = moneda(mostrado);
  if (formato === 'decimal') texto = mostrado.toFixed(decimales);

  return <Text style={estilo}>{texto}</Text>;
}
