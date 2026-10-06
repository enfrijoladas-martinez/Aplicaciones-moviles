import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, moneda, tiempo } from '../estilos/tema';
import { calcularMetricas } from '../utilidades/ruta';

export default function ModalResultado({ visible, resultado, alCerrar }) {
  const escala = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      escala.setValue(0.8);
      Animated.spring(escala, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!resultado) return null;

  const antes = calcularMetricas(resultado.antes, resultado.ajustes);
  const despues = calcularMetricas(resultado.despues, resultado.ajustes);

  const kmAhorrados = resultado.antes - resultado.despues;
  const porcentaje = resultado.antes > 0 ? (kmAhorrados / resultado.antes) * 100 : 0;
  const pesosAhorrados = antes.costo - despues.costo;
  const minutosAhorrados = antes.minutos - despues.minutos;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={alCerrar}>
      <View style={estilos.fondo}>
        <Animated.View style={[estilos.tarjeta, { transform: [{ scale: escala }] }]}>
          <View style={estilos.icono}>
            <Ionicons name="checkmark-done" size={30} color="#FFFFFF" />
          </View>

          <Text style={estilos.titulo}>Ruta optimizada</Text>
          <Text style={estilos.subtitulo}>
            {resultado.mejoras} mejoras aplicadas por el algoritmo 2-opt
          </Text>

          <View style={estilos.comparativa}>
            <View style={estilos.columna}>
              <Text style={estilos.columnaEtiqueta}>Antes</Text>
              <Text style={[estilos.columnaValor, { color: colores.peligro }]}>
                {resultado.antes.toFixed(2)} km
              </Text>
              <Text style={estilos.columnaDetalle}>{tiempo(antes.minutos)}</Text>
              <Text style={estilos.columnaDetalle}>{moneda(antes.costo)}</Text>
            </View>

            <Ionicons name="arrow-forward" size={20} color={colores.textoSuave} />

            <View style={estilos.columna}>
              <Text style={estilos.columnaEtiqueta}>Despues</Text>
              <Text style={[estilos.columnaValor, { color: colores.exito }]}>
                {resultado.despues.toFixed(2)} km
              </Text>
              <Text style={estilos.columnaDetalle}>{tiempo(despues.minutos)}</Text>
              <Text style={estilos.columnaDetalle}>{moneda(despues.costo)}</Text>
            </View>
          </View>

          <View style={estilos.resumen}>
            <Text style={estilos.resumenTitulo}>Lo que te ahorras por viaje</Text>

            <View style={estilos.resumenFila}>
              <Ionicons name="navigate" size={15} color={colores.exito} />
              <Text style={estilos.resumenTexto}>
                {kmAhorrados.toFixed(2)} km menos ({porcentaje.toFixed(1)}%)
              </Text>
            </View>

            <View style={estilos.resumenFila}>
              <Ionicons name="time" size={15} color={colores.exito} />
              <Text style={estilos.resumenTexto}>{minutosAhorrados} minutos menos</Text>
            </View>

            <View style={estilos.resumenFila}>
              <Ionicons name="cash" size={15} color={colores.exito} />
              <Text style={estilos.resumenTexto}>{moneda(pesosAhorrados)} de gasolina</Text>
            </View>

            <View style={estilos.divisor} />

            <Text style={estilos.proyeccion}>
              Haciendo esta ruta de lunes a sabado, el ahorro al mes seria de{' '}
              <Text style={estilos.proyeccionFuerte}>{moneda(pesosAhorrados * 26)}</Text>
            </Text>
          </View>

          <Pressable style={estilos.boton} onPress={alCerrar}>
            <Text style={estilos.botonTexto}>Entendido</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 20,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  icono: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colores.exito,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colores.texto,
  },
  subtitulo: {
    fontSize: 13,
    color: colores.textoSuave,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  comparativa: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  columna: {
    flex: 1,
    alignItems: 'center',
  },
  columnaEtiqueta: {
    fontSize: 12,
    color: colores.textoSuave,
  },
  columnaValor: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 3,
  },
  columnaDetalle: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  resumen: {
    backgroundColor: colores.fondo,
    borderRadius: 14,
    padding: 16,
    width: '100%',
  },
  resumenTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 10,
  },
  resumenFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  resumenTexto: {
    fontSize: 14,
    color: colores.texto,
    marginLeft: 9,
  },
  divisor: {
    height: 1,
    backgroundColor: colores.borde,
    marginVertical: 10,
  },
  proyeccion: {
    fontSize: 13,
    color: colores.textoSuave,
    lineHeight: 19,
  },
  proyeccionFuerte: {
    fontWeight: 'bold',
    color: colores.exito,
  },
  boton: {
    backgroundColor: colores.primario,
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
