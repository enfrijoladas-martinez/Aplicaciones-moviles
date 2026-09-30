import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, moneda } from '../estilos/tema';
import { aMinutos, aTexto, desplazar, hoy, sumarMinutos } from '../utilidades/fechas';

const horasDisponibles = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00',
];

export default function ModalCita({ visible, clientes, servicios, citas, alGuardar, alCerrar }) {
  const [clienteId, setClienteId] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [esNuevo, setEsNuevo] = useState(false);
  const [servicioId, setServicioId] = useState('');
  const [fecha, setFecha] = useState(hoy());
  const [hora, setHora] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    if (!visible) return;

    setClienteId('');
    setNuevoNombre('');
    setNuevoTelefono('');
    setEsNuevo(false);
    setServicioId(servicios.length > 0 ? servicios[0].id : '');
    setFecha(hoy());
    setHora('');
    setAviso('');
  }, [visible]);

  const servicio = servicios.find((s) => s.id === servicioId);

  const ocupadas = citas
    .filter((c) => c.fecha === fecha && c.estado !== 'cancelada')
    .map((c) => {
      const s = servicios.find((x) => x.id === c.servicioId);
      return { inicio: aMinutos(c.hora), fin: aMinutos(c.hora) + (s ? s.duracion : 30) };
    });

  const estaOcupada = (valor) => {
    if (!servicio) return false;
    const inicio = aMinutos(valor);
    const fin = inicio + servicio.duracion;
    return ocupadas.some((o) => inicio < o.fin && fin > o.inicio);
  };

  const guardar = () => {
    if (esNuevo && !nuevoNombre.trim()) {
      setAviso('Escribe el nombre del cliente');
      return;
    }

    if (!esNuevo && !clienteId) {
      setAviso('Selecciona un cliente');
      return;
    }

    if (!servicioId) {
      setAviso('Selecciona un servicio');
      return;
    }

    if (!hora) {
      setAviso('Selecciona una hora');
      return;
    }

    setAviso('');

    alGuardar({
      clienteId: esNuevo ? null : clienteId,
      nuevoCliente: esNuevo
        ? { nombre: nuevoNombre.trim(), telefono: nuevoTelefono.trim() }
        : null,
      servicioId: servicioId,
      fecha: fecha,
      hora: hora,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={alCerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.hoja}>
          <View style={estilos.barra} />
          <Text style={estilos.titulo}>Nueva cita</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={estilos.filaSwitch}>
              <Text style={estilos.etiquetaSwitch}>Cliente nuevo</Text>
              <Switch value={esNuevo} onValueChange={setEsNuevo} />
            </View>

            {esNuevo ? (
              <View>
                <TextInput
                  style={estilos.campo}
                  placeholder="Nombre del cliente"
                  placeholderTextColor={colores.textoSuave}
                  value={nuevoNombre}
                  onChangeText={setNuevoNombre}
                />
                <TextInput
                  style={estilos.campo}
                  placeholder="Telefono"
                  placeholderTextColor={colores.textoSuave}
                  keyboardType="phone-pad"
                  value={nuevoTelefono}
                  onChangeText={setNuevoTelefono}
                />
              </View>
            ) : (
              <View>
                <Text style={estilos.etiqueta}>Cliente</Text>
                {clientes.map((c) => (
                  <Pressable
                    key={c.id}
                    style={[estilos.opcion, clienteId === c.id && estilos.opcionActiva]}
                    onPress={() => setClienteId(c.id)}
                  >
                    <Text
                      style={[estilos.opcionTexto, clienteId === c.id && estilos.opcionTextoActivo]}
                    >
                      {c.nombre}
                    </Text>
                    {clienteId === c.id && (
                      <Ionicons name="checkmark-circle" size={18} color={colores.primario} />
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            <Text style={estilos.etiqueta}>Servicio</Text>
            <View style={estilos.fichas}>
              {servicios.map((s) => (
                <Pressable
                  key={s.id}
                  style={[estilos.ficha, servicioId === s.id && estilos.fichaActiva]}
                  onPress={() => {
                    setServicioId(s.id);
                    setHora('');
                  }}
                >
                  <Text
                    style={[estilos.fichaTexto, servicioId === s.id && estilos.fichaTextoActivo]}
                  >
                    {s.nombre}
                  </Text>
                </Pressable>
              ))}
            </View>

            {servicio && (
              <Text style={estilos.nota}>
                Dura {servicio.duracion} minutos · {moneda(servicio.precio)}
              </Text>
            )}

            <Text style={estilos.etiqueta}>Dia</Text>
            <View style={estilos.fichas}>
              {[0, 1, 2, 3, 4].map((d) => {
                const valor = desplazar(d);
                return (
                  <Pressable
                    key={valor}
                    style={[estilos.ficha, fecha === valor && estilos.fichaActiva]}
                    onPress={() => {
                      setFecha(valor);
                      setHora('');
                    }}
                  >
                    <Text
                      style={[estilos.fichaTexto, fecha === valor && estilos.fichaTextoActivo]}
                    >
                      {aTexto(valor)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={estilos.etiqueta}>Hora disponible</Text>
            <View style={estilos.fichas}>
              {horasDisponibles.map((h) => {
                const ocupada = estaOcupada(h);
                return (
                  <Pressable
                    key={h}
                    disabled={ocupada}
                    style={[
                      estilos.fichaHora,
                      hora === h && estilos.fichaActiva,
                      ocupada && estilos.fichaOcupada,
                    ]}
                    onPress={() => setHora(h)}
                  >
                    <Text
                      style={[
                        estilos.fichaTexto,
                        hora === h && estilos.fichaTextoActivo,
                        ocupada && estilos.fichaTextoOcupado,
                      ]}
                    >
                      {h}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {hora !== '' && servicio && (
              <Text style={estilos.nota}>
                Termina a las {sumarMinutos(hora, servicio.duracion)}
              </Text>
            )}

            {aviso !== '' && <Text style={estilos.aviso}>{aviso}</Text>}
          </ScrollView>

          <View style={estilos.acciones}>
            <Pressable style={estilos.botonSuave} onPress={alCerrar}>
              <Text style={estilos.botonSuaveTexto}>Cancelar</Text>
            </Pressable>

            <Pressable style={estilos.boton} onPress={guardar}>
              <Text style={estilos.botonTexto}>Agendar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
  },
  hoja: {
    backgroundColor: colores.superficie,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingBottom: 26,
    paddingTop: 10,
    maxHeight: '90%',
  },
  barra: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colores.borde,
    alignSelf: 'center',
    marginBottom: 14,
  },
  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 12,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoSuave,
    marginTop: 14,
    marginBottom: 8,
  },
  campo: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: colores.texto,
    marginBottom: 10,
    backgroundColor: colores.fondo,
  },
  filaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  etiquetaSwitch: {
    fontSize: 15,
    color: colores.texto,
  },
  opcion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colores.borde,
    marginBottom: 7,
    backgroundColor: colores.fondo,
  },
  opcionActiva: {
    borderColor: colores.primario,
    backgroundColor: colores.primarioSuave,
  },
  opcionTexto: {
    fontSize: 14,
    color: colores.texto,
  },
  opcionTextoActivo: {
    fontWeight: '600',
    color: colores.primario,
  },
  fichas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ficha: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colores.fondo,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: 8,
    marginBottom: 8,
  },
  fichaHora: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colores.fondo,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: 8,
    marginBottom: 8,
  },
  fichaActiva: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  fichaOcupada: {
    backgroundColor: colores.superficie,
    borderColor: colores.borde,
    opacity: 0.4,
  },
  fichaTexto: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  fichaTextoActivo: {
    color: colores.superficie,
    fontWeight: '600',
  },
  fichaTextoOcupado: {
    textDecorationLine: 'line-through',
  },
  nota: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  aviso: {
    color: colores.peligro,
    fontSize: 13,
    marginTop: 10,
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
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colores.primario,
    alignItems: 'center',
  },
  botonTexto: {
    color: colores.superficie,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
