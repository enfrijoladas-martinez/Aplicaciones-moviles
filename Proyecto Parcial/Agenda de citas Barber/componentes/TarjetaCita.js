import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, moneda, sombra } from '../estilos/tema';
import { sumarMinutos } from '../utilidades/fechas';

const estados = {
  pendiente: { texto: 'Pendiente', color: colores.alerta, fondo: '#FEF3C7' },
  completada: { texto: 'Completada', color: colores.exito, fondo: '#D1FAE5' },
  cancelada: { texto: 'Cancelada', color: colores.peligro, fondo: '#FEE2E2' },
};

export default function TarjetaCita({ cita, cliente, servicio, alPresionar }) {
  const marca = estados[cita.estado];
  const termina = sumarMinutos(cita.hora, servicio.duracion);

  return (
    <Pressable style={estilos.tarjeta} onPress={() => alPresionar(cita)}>
      <View style={[estilos.franja, { backgroundColor: marca.color }]} />

      <View style={estilos.horario}>
        <Text style={estilos.hora}>{cita.hora}</Text>
        <Text style={estilos.termina}>{termina}</Text>
      </View>

      <View style={estilos.centro}>
        <Text style={estilos.cliente} numberOfLines={1}>{cliente.nombre}</Text>

        <View style={estilos.servicioFila}>
          <Ionicons name={servicio.icono} size={13} color={colores.textoSuave} />
          <Text style={estilos.servicio} numberOfLines={1}>{servicio.nombre}</Text>
        </View>

        <View style={[estilos.etiqueta, { backgroundColor: marca.fondo }]}>
          <Text style={[estilos.etiquetaTexto, { color: marca.color }]}>{marca.texto}</Text>
        </View>
      </View>

      <Text style={estilos.precio}>{moneda(servicio.precio)}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    ...sombra,
  },
  franja: {
    width: 4,
    height: 46,
    borderRadius: 2,
    marginRight: 12,
  },
  horario: {
    alignItems: 'center',
    width: 52,
  },
  hora: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
  },
  termina: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 2,
  },
  centro: {
    flex: 1,
    marginLeft: 12,
  },
  cliente: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  servicioFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  servicio: {
    fontSize: 12,
    color: colores.textoSuave,
    marginLeft: 5,
  },
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 6,
  },
  etiquetaTexto: {
    fontSize: 10,
    fontWeight: '700',
  },
  precio: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colores.primario,
    marginLeft: 8,
  },
});
