import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Segmento from './Segmento';
import { colores } from '../estilos/tema';
import { seCruzan } from '../utilidades/geo';

const LINEAS_REJILLA = 7;

export default function Lienzo({
  ancho,
  alto,
  puntos,
  ruta,
  colorRuta,
  marcarCruces,
  camion,
  visitadas,
  alTocar,
}) {
  const rejilla = [];

  for (let i = 1; i < LINEAS_REJILLA; i++) {
    rejilla.push(
      <View
        key={'v' + i}
        style={[estilos.lineaRejilla, { left: (ancho / LINEAS_REJILLA) * i, width: 1, height: alto }]}
      />
    );
    rejilla.push(
      <View
        key={'h' + i}
        style={[estilos.lineaRejilla, { top: (alto / LINEAS_REJILLA) * i, height: 1, width: ancho }]}
      />
    );
  }

  const cruzados = {};

  if (marcarCruces && ruta.length > 3) {
    for (let i = 0; i < ruta.length - 1; i++) {
      for (let j = i + 2; j < ruta.length - 1; j++) {
        if (seCruzan(ruta[i], ruta[i + 1], ruta[j], ruta[j + 1])) {
          cruzados[i] = true;
          cruzados[j] = true;
        }
      }
    }
  }

  const segmentos = [];

  for (let i = 0; i < ruta.length - 1; i++) {
    segmentos.push(
      <Segmento
        key={'s' + i}
        a={ruta[i]}
        b={ruta[i + 1]}
        color={cruzados[i] ? colores.peligro : colorRuta}
        grosor={cruzados[i] ? 4 : 3}
      />
    );
  }

  const posicionEnRuta = {};
  ruta.forEach((p, i) => {
    if (i > 0 && i < ruta.length - 1) posicionEnRuta[p.id] = i;
  });

  return (
    <Pressable
      style={[estilos.lienzo, { width: ancho, height: alto }]}
      onPress={(evento) => {
        if (alTocar) {
          alTocar(evento.nativeEvent.locationX, evento.nativeEvent.locationY);
        }
      }}
    >
      {rejilla}

      {segmentos}

      {puntos.map((p) => {
        const esAlmacen = p.id === 'almacen';
        const entregada = visitadas && visitadas.indexOf(p.id) !== -1;
        const numero = posicionEnRuta[p.id];

        return (
          <View
            key={p.id}
            style={[
              estilos.marcador,
              {
                left: p.x - (esAlmacen ? 15 : 12),
                top: p.y - (esAlmacen ? 15 : 12),
                width: esAlmacen ? 30 : 24,
                height: esAlmacen ? 30 : 24,
                borderRadius: esAlmacen ? 9 : 12,
                backgroundColor: esAlmacen
                  ? colores.almacen
                  : entregada
                  ? colores.exito
                  : colores.parada,
              },
            ]}
          >
            {esAlmacen ? (
              <Ionicons name="business" size={16} color="#FFFFFF" />
            ) : entregada ? (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            ) : (
              <Text style={estilos.numero}>{numero !== undefined ? numero : ''}</Text>
            )}
          </View>
        );
      })}

      {camion && (
        <Animated.View
          style={[
            estilos.camion,
            { transform: [{ translateX: camion.x }, { translateY: camion.y }] },
          ]}
        >
          <Ionicons name="car" size={16} color="#FFFFFF" />
        </Animated.View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  lienzo: {
    backgroundColor: colores.lienzo,
    borderRadius: 16,
    overflow: 'hidden',
  },
  lineaRejilla: {
    position: 'absolute',
    backgroundColor: colores.rejilla,
  },
  marcador: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(15, 23, 42, 0.6)',
  },
  numero: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  camion: {
    position: 'absolute',
    left: -13,
    top: -13,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colores.acento,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
