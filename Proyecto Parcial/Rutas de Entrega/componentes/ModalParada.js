import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, moneda } from '../estilos/tema';
import { coloresZona } from '../datos/paquetes';

const textoPrioridad = {
  alta: { texto: 'Urgente', color: colores.peligro, fondo: '#FEE2E2' },
  normal: { texto: 'Normal', color: colores.primario, fondo: '#DBEAFE' },
  baja: { texto: 'Sin prisa', color: colores.textoSuave, fondo: '#F1F5F9' },
};

export default function ModalParada({
  visible,
  parada,
  esAlmacen,
  indice,
  total,
  desdeAnterior,
  acumulada,
  llegada,
  otros,
  entregado,
  alMarcarEntregado,
  alCerrar,
}) {
  const subida = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (visible) {
      subida.setValue(40);
      Animated.spring(subida, {
        toValue: 0,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!parada) return null;

  if (esAlmacen) {
    return (
      <Modal visible={visible} animationType="fade" transparent onRequestClose={alCerrar}>
        <View style={estilos.fondo}>
          <Animated.View style={[estilos.hoja, { transform: [{ translateY: subida }] }]}>
            <View style={estilos.barra} />

            <View style={estilos.encabezado}>
              <View style={[estilos.icono, { backgroundColor: colores.acento }]}>
                <Ionicons name="business" size={24} color="#FFFFFF" />
              </View>

              <View style={estilos.encabezadoTextos}>
                <Text style={estilos.titulo}>{parada.nombre}</Text>
                <Text style={estilos.subtitulo}>{parada.direccion}</Text>
              </View>
            </View>

            <View style={estilos.aviso}>
              <Ionicons name="flag" size={16} color={colores.acento} />
              <Text style={estilos.avisoTexto}>
                Punto de partida y de regreso. La ruta sale de aqui y termina aqui.
              </Text>
            </View>

            <Pressable style={estilos.botonCerrar} onPress={alCerrar}>
              <Text style={estilos.botonCerrarTexto}>Cerrar</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  const marca = textoPrioridad[parada.prioridad] || textoPrioridad.normal;
  const pesoTotal = parada.peso + otros.reduce((suma, p) => suma + p.peso, 0);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={alCerrar}>
      <View style={estilos.fondo}>
        <Animated.View style={[estilos.hoja, { transform: [{ translateY: subida }] }]}>
          <View style={estilos.barra} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={estilos.encabezado}>
              <View
                style={[
                  estilos.icono,
                  { backgroundColor: entregado ? colores.exito : colores.parada },
                ]}
              >
                {entregado ? (
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                ) : (
                  <Text style={estilos.numeroGrande}>{indice}</Text>
                )}
              </View>

              <View style={estilos.encabezadoTextos}>
                <Text style={estilos.titulo}>{parada.destinatario}</Text>
                <Text style={estilos.subtitulo}>{parada.direccion}</Text>

                <View style={estilos.etiquetas}>
                  <View style={[estilos.etiqueta, { backgroundColor: marca.fondo }]}>
                    <Text style={[estilos.etiquetaTexto, { color: marca.color }]}>
                      {marca.texto}
                    </Text>
                  </View>

                  <View
                    style={[
                      estilos.etiqueta,
                      { backgroundColor: coloresZona[parada.zona] + '22' },
                    ]}
                  >
                    <View
                      style={[estilos.punto, { backgroundColor: coloresZona[parada.zona] }]}
                    />
                    <Text style={[estilos.etiquetaTexto, { color: coloresZona[parada.zona] }]}>
                      {parada.zona}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={estilos.cinta}>
              <View style={estilos.cintaBloque}>
                <Text style={estilos.cintaValor}>
                  {indice} de {total}
                </Text>
                <Text style={estilos.cintaEtiqueta}>parada</Text>
              </View>

              <View style={estilos.cintaDivisor} />

              <View style={estilos.cintaBloque}>
                <Text style={estilos.cintaValor}>{llegada}</Text>
                <Text style={estilos.cintaEtiqueta}>llegada aprox.</Text>
              </View>

              <View style={estilos.cintaDivisor} />

              <View style={estilos.cintaBloque}>
                <Text style={estilos.cintaValor}>{desdeAnterior.toFixed(1)} km</Text>
                <Text style={estilos.cintaEtiqueta}>tramo anterior</Text>
              </View>
            </View>

            <Text style={estilos.seccion}>
              {otros.length > 0 ? 'Paquetes a entregar aqui' : 'Paquete a entregar'}
            </Text>

            <View style={estilos.bloque}>
              <Paquete paquete={parada} />
              {otros.map((p) => (
                <Paquete key={p.id} paquete={p} />
              ))}

              {otros.length > 0 && (
                <View style={estilos.totalPaquetes}>
                  <Text style={estilos.totalTexto}>
                    {otros.length + 1} paquetes · {pesoTotal} kg en total
                  </Text>
                </View>
              )}
            </View>

            <Text style={estilos.seccion}>Datos del recorrido</Text>

            <View style={estilos.bloque}>
              <Renglon etiqueta="Distancia acumulada" valor={acumulada.toFixed(2) + ' km'} />
              <Renglon etiqueta="Desde la parada anterior" valor={desdeAnterior.toFixed(2) + ' km'} />
              <Renglon
                etiqueta="Coordenadas"
                valor={parada.lat.toFixed(5) + ', ' + parada.lon.toFixed(5)}
              />
            </View>
          </ScrollView>

          <View style={estilos.acciones}>
            <Pressable style={estilos.botonSuave} onPress={alCerrar}>
              <Text style={estilos.botonSuaveTexto}>Cerrar</Text>
            </Pressable>

            <Pressable
              style={[
                estilos.boton,
                { backgroundColor: entregado ? colores.textoSuave : colores.exito },
              ]}
              onPress={() => alMarcarEntregado(parada)}
            >
              <Ionicons
                name={entregado ? 'arrow-undo' : 'checkmark-circle'}
                size={17}
                color="#FFFFFF"
              />
              <Text style={estilos.botonTexto}>
                {entregado ? 'Deshacer' : 'Marcar entregado'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function Paquete({ paquete }) {
  return (
    <View style={estilos.paquete}>
      <View style={estilos.paqueteIcono}>
        <Ionicons name="cube" size={15} color={colores.primario} />
      </View>

      <View style={estilos.paqueteTextos}>
        <Text style={estilos.paqueteGuia}>{paquete.guia}</Text>
        <Text style={estilos.paqueteDetalle}>{paquete.destinatario}</Text>
      </View>

      <Text style={estilos.paquetePeso}>{paquete.peso} kg</Text>
    </View>
  );
}

function Renglon({ etiqueta, valor }) {
  return (
    <View style={estilos.renglon}>
      <Text style={estilos.renglonEtiqueta}>{etiqueta}</Text>
      <Text style={estilos.renglonValor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  hoja: {
    backgroundColor: colores.superficie,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingBottom: 24,
    paddingTop: 10,
    maxHeight: '88%',
  },
  barra: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colores.borde,
    alignSelf: 'center',
    marginBottom: 16,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icono: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroGrande: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: 'bold',
  },
  encabezadoTextos: {
    flex: 1,
    marginLeft: 13,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
  },
  subtitulo: {
    fontSize: 13,
    color: colores.textoSuave,
    marginTop: 2,
  },
  etiquetas: {
    flexDirection: 'row',
    marginTop: 8,
  },
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 7,
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  etiquetaTexto: {
    fontSize: 11,
    fontWeight: '700',
  },
  cinta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 18,
  },
  cintaBloque: {
    flex: 1,
    alignItems: 'center',
  },
  cintaDivisor: {
    width: 1,
    height: 26,
    backgroundColor: colores.borde,
  },
  cintaValor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colores.texto,
  },
  cintaEtiqueta: {
    fontSize: 10,
    color: colores.textoSuave,
    marginTop: 2,
  },
  seccion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 18,
    marginBottom: 9,
  },
  bloque: {
    backgroundColor: colores.fondo,
    borderRadius: 14,
    padding: 14,
  },
  paquete: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  paqueteIcono: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paqueteTextos: {
    flex: 1,
    marginLeft: 11,
  },
  paqueteGuia: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colores.texto,
    letterSpacing: 0.4,
  },
  paqueteDetalle: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 1,
  },
  paquetePeso: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.primario,
  },
  totalPaquetes: {
    borderTopWidth: 1,
    borderTopColor: colores.borde,
    marginTop: 8,
    paddingTop: 9,
  },
  totalTexto: {
    fontSize: 12,
    color: colores.textoSuave,
    textAlign: 'center',
  },
  renglon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  renglonEtiqueta: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  renglonValor: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.texto,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },
  avisoTexto: {
    flex: 1,
    fontSize: 13,
    color: colores.texto,
    marginLeft: 10,
    lineHeight: 19,
  },
  acciones: {
    flexDirection: 'row',
    marginTop: 16,
  },
  botonSuave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colores.fondo,
    alignItems: 'center',
    marginRight: 10,
  },
  botonSuaveTexto: {
    color: colores.textoSuave,
    fontSize: 15,
    fontWeight: '600',
  },
  boton: {
    flex: 1.4,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 7,
  },
  botonCerrar: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colores.fondo,
    alignItems: 'center',
    marginTop: 18,
  },
  botonCerrarTexto: {
    color: colores.textoSuave,
    fontSize: 15,
    fontWeight: '600',
  },
});
