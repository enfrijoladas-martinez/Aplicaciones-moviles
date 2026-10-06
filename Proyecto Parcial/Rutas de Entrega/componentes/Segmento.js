import { View } from 'react-native';
import { anguloEntre, largoEntre } from '../utilidades/geo';

export default function Segmento({ a, b, color, grosor = 3, opacidad = 1 }) {
  const largo = largoEntre(a, b);
  const angulo = anguloEntre(a, b);

  return (
    <View
      style={{
        position: 'absolute',
        left: a.x + (b.x - a.x) / 2 - largo / 2,
        top: a.y + (b.y - a.y) / 2 - grosor / 2,
        width: largo,
        height: grosor,
        borderRadius: grosor / 2,
        backgroundColor: color,
        opacity: opacidad,
        transform: [{ rotate: angulo + 'deg' }],
      }}
    />
  );
}
