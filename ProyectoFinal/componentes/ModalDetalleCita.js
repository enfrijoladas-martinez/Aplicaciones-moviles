import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, moneda } from '../estilos/tema';
import { aTexto, sumarMinutos } from '../utilidades/fechas';

export default function ModalDetalleCita({
  visible,
  cita,
  cliente,
  servicio,
  alCambiarEstado,
  alEliminar,
  alCerrar,
}) {
  const [confirmando, setConfirmando] = useState(false);

  if (!cita || !cliente || !servicio) return null;

  const cerrar = () => {
    setConfirmando(false);
    alCerrar();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={cerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.tarjeta}>
          <View style={estilos.encabezado}>
            <View style={estilos.icono}>
              <Ionicons name={servicio.icono} size={26} color={colores.primario} />
            </View>

            <View style={estilos.titulos}>
              <Text style={estilos.cliente}>{cliente.nombre}</Text>
              <Text style={estilos.telefono}>{cliente.telefono}</Text>
            </View>
          </View>

          <View style={estilos.bloque}>
            <Renglon icono="cut-outline" etiqueta="Servicio" valor={servicio.nombre} />
            <Renglon icono="calendar-outline" etiqueta="Dia" valor={aTexto(cita.fecha)} />
            <Renglon
              icono="time-outline"
              etiqueta="Horario"
              valor={cita.hora + ' a ' + sumarMinutos(cita.hora, servicio.duracion)}
            />
            <Renglon
              icono="cash-outline"
              etiqueta="Precio"
              valor={moneda(servicio.precio)}
            />
          </View>

          {confirmando ? (
            <View>
              <Text style={estilos.confirmarTexto}>
                Se eliminara esta cita de la agenda.
              </Text>

              <View style={estilos.acciones}>
                <Pressable style={estilos.botonSuave} onPress={() => setConfirmando(false)}>
                  <Text style={estilos.botonSuaveTexto}>Volver</Text>
                </Pressable>

                <Pressable
                  style={[estilos.boton, { backgroundColor: colores.peligro }]}
                  onPress={() => {
                    setConfirmando(false);
                    alEliminar(cita);
                  }}
                >
                  <Text style={estilos.botonTexto}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View>
              {cita.estado === 'pendiente' && (
                <View style={estilos.acciones}>
                  <Pressable
                    style={[estilos.boton, { backgroundColor: colores.alerta, marginRight: 10 }]}
                    onPress={() => alCambiarEstado(cita, 'cancelada')}
                  >
                    <Text style={estilos.botonTexto}>Cancelar cita</Text>
                  </Pressable>

                  <Pressable
                    style={[estilos.boton, { backgroundColor: colores.exito }]}
                    onPress={() => alCambiarEstado(cita, 'completada')}
                  >
                    <Text style={estilos.botonTexto}>Completar</Text>
                  </Pressable>
                </View>
              )}

              {cita.estado !== 'pendiente' && (
                <View style={estilos.acciones}>
                  <Pressable
                    style={estilos.botonSuave}
                    onPress={() => alCambiarEstado(cita, 'pendiente')}
                  >
                    <Text style={estilos.botonSuaveTexto}>Reactivar</Text>
                  </Pressable>

                  <Pressable
                    style={[estilos.boton, { backgroundColor: colores.peligro }]}
                    onPress={() => setConfirmando(true)}
                  >
                    <Text style={estilos.botonTexto}>Eliminar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}

          <Pressable style={estilos.cerrar} onPress={cerrar}>
            <Text style={estilos.cerrarTexto}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Renglon({ icono, etiqueta, valor }) {
  return (
    <View style={estilos.renglon}>
      <Ionicons name={icono} size={16} color={colores.textoSuave} />
      <Text style={estilos.renglonEtiqueta}>{etiqueta}</Text>
      <Text style={estilos.renglonValor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    padding: 20,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 20,
    padding: 22,
    width: '100%',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icono: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulos: {
    flex: 1,
    marginLeft: 13,
  },
  cliente: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
  },
  telefono: {
    fontSize: 13,
    color: colores.textoSuave,
    marginTop: 2,
  },
  bloque: {
    backgroundColor: colores.fondo,
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
  },
  renglon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  renglonEtiqueta: {
    flex: 1,
    fontSize: 13,
    color: colores.textoSuave,
    marginLeft: 8,
  },
  renglonValor: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  confirmarTexto: {
    fontSize: 15,
    color: colores.texto,
    marginTop: 10,
  },
  acciones: {
    flexDirection: 'row',
    marginTop: 16,
  },
  botonSuave: {
    flex: 1,
    paddingVertical: 13,
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
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: colores.primario,
    alignItems: 'center',
  },
  botonTexto: {
    color: colores.superficie,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cerrar: {
    alignItems: 'center',
    marginTop: 14,
  },
  cerrarTexto: {
    color: colores.textoSuave,
    fontSize: 14,
  },
});
