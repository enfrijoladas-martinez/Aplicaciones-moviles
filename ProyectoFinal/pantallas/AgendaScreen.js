import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TarjetaCita from '../componentes/TarjetaCita';
import { colores, sombra } from '../estilos/tema';
import { aMinutos, aTexto } from '../utilidades/fechas';

const filtros = ['Todas', 'Pendiente', 'Completada', 'Cancelada'];

export default function AgendaScreen({
  citas,
  clientes,
  servicios,
  alAbrirCita,
  alAbrirFormulario,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  const buscarCliente = (id) => clientes.find((c) => c.id === id);
  const buscarServicio = (id) => servicios.find((s) => s.id === id);

  const visibles = citas.filter((c) => {
    const cliente = buscarCliente(c.clienteId);
    const servicio = buscarServicio(c.servicioId);
    if (!cliente || !servicio) return false;

    const texto = busqueda.toLowerCase();
    const coincide =
      cliente.nombre.toLowerCase().includes(texto) ||
      servicio.nombre.toLowerCase().includes(texto);

    const coincideFiltro = filtro === 'Todas' || c.estado === filtro.toLowerCase();

    return coincide && coincideFiltro;
  });

  const porFecha = {};
  visibles.forEach((c) => {
    if (!porFecha[c.fecha]) porFecha[c.fecha] = [];
    porFecha[c.fecha].push(c);
  });

  const secciones = Object.keys(porFecha)
    .sort()
    .reverse()
    .map((fecha) => ({
      title: aTexto(fecha),
      data: porFecha[fecha].sort((a, b) => aMinutos(a.hora) - aMinutos(b.hora)),
    }));

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.buscador}>
        <Ionicons name="search" size={18} color={colores.textoSuave} />
        <TextInput
          style={estilos.campo}
          placeholder="Buscar cliente o servicio..."
          placeholderTextColor={colores.textoSuave}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda !== '' && (
          <Pressable onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={colores.textoSuave} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.filtros}
        contentContainerStyle={estilos.filtrosContenido}
      >
        {filtros.map((f) => (
          <Pressable
            key={f}
            style={[estilos.ficha, filtro === f && estilos.fichaActiva]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[estilos.fichaTexto, filtro === f && estilos.fichaTextoActivo]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionList
        sections={secciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={estilos.encabezadoSeccion}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TarjetaCita
            cita={item}
            cliente={buscarCliente(item.clienteId)}
            servicio={buscarServicio(item.servicioId)}
            alPresionar={alAbrirCita}
          />
        )}
        ListEmptyComponent={
          <View style={estilos.vacio}>
            <Ionicons name="calendar-clear-outline" size={42} color={colores.borde} />
            <Text style={estilos.vacioTexto}>No hay citas que coincidan</Text>
          </View>
        }
      />

      <Pressable style={estilos.flotante} onPress={alAbrirFormulario}>
        <Ionicons name="add" size={28} color={colores.superficie} />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  campo: {
    flex: 1,
    paddingVertical: 11,
    marginLeft: 8,
    fontSize: 15,
    color: colores.texto,
  },
  filtros: {
    maxHeight: 54,
    marginTop: 12,
  },
  filtrosContenido: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  ficha: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: 8,
  },
  fichaActiva: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  fichaTexto: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  fichaTextoActivo: {
    color: colores.superficie,
    fontWeight: '600',
  },
  lista: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 90,
  },
  encabezadoSeccion: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colores.textoSuave,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
  vacio: {
    alignItems: 'center',
    marginTop: 50,
  },
  vacioTexto: {
    color: colores.textoSuave,
    fontSize: 14,
    marginTop: 10,
  },
  flotante: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colores.primario,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colores.primario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
