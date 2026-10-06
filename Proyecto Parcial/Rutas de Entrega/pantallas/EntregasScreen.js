import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalEntrega from '../componentes/ModalEntrega';
import { colores, sombra } from '../estilos/tema';
import { haversine } from '../utilidades/geo';

const coloresPrioridad = {
  alta: colores.peligro,
  normal: colores.primario,
  baja: colores.textoSuave,
};

export default function EntregasScreen({
  almacen,
  entregas,
  alGuardarEntrega,
  alEliminarEntrega,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [formulario, setFormulario] = useState(false);
  const [editando, setEditando] = useState(null);

  const visibles = entregas
    .map((e) => ({ ...e, distancia: haversine(almacen, e) }))
    .filter(
      (e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.direccion.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => a.distancia - b.distancia);

  const pesoTotal = entregas.reduce((suma, e) => suma + e.peso, 0);

  const guardar = (entrega) => {
    alGuardarEntrega(entrega);
    setFormulario(false);
    setEditando(null);
  };

  const eliminar = (entrega) => {
    alEliminarEntrega(entrega);
    setFormulario(false);
    setEditando(null);
  };

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.resumen}>
        <View style={estilos.bloque}>
          <Text style={estilos.numero}>{entregas.length}</Text>
          <Text style={estilos.etiqueta}>Entregas</Text>
        </View>

        <View style={estilos.divisor} />

        <View style={estilos.bloque}>
          <Text style={estilos.numero}>{pesoTotal} kg</Text>
          <Text style={estilos.etiqueta}>Carga total</Text>
        </View>

        <View style={estilos.divisor} />

        <View style={estilos.bloque}>
          <Text style={estilos.numero}>
            {entregas.filter((e) => e.prioridad === 'alta').length}
          </Text>
          <Text style={estilos.etiqueta}>Urgentes</Text>
        </View>
      </View>

      <View style={estilos.buscador}>
        <Ionicons name="search" size={18} color={colores.textoSuave} />
        <TextInput
          style={estilos.campo}
          placeholder="Buscar cliente o direccion..."
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

      <FlatList
        data={visibles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={estilos.tarjeta}
            onPress={() => {
              setEditando(item);
              setFormulario(true);
            }}
          >
            <View
              style={[estilos.franja, { backgroundColor: coloresPrioridad[item.prioridad] }]}
            />

            <View style={estilos.textos}>
              <Text style={estilos.nombre} numberOfLines={1}>{item.nombre}</Text>
              <Text style={estilos.direccion} numberOfLines={1}>{item.direccion}</Text>

              <View style={estilos.chips}>
                <View style={estilos.chip}>
                  <Ionicons name="cube-outline" size={11} color={colores.textoSuave} />
                  <Text style={estilos.chipTexto}>{item.peso} kg</Text>
                </View>

                <View style={estilos.chip}>
                  <Ionicons name="navigate-outline" size={11} color={colores.textoSuave} />
                  <Text style={estilos.chipTexto}>
                    {item.distancia.toFixed(1)} km del almacen
                  </Text>
                </View>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color={colores.borde} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={estilos.vacio}>
            <Ionicons name="cube-outline" size={42} color={colores.borde} />
            <Text style={estilos.vacioTexto}>No hay entregas que coincidan</Text>
          </View>
        }
      />

      <Pressable
        style={estilos.flotante}
        onPress={() => {
          setEditando(null);
          setFormulario(true);
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>

      <ModalEntrega
        visible={formulario}
        entrega={editando}
        sugerencia={editando ? null : almacen}
        alGuardar={guardar}
        alEliminar={eliminar}
        alCerrar={() => {
          setFormulario(false);
          setEditando(null);
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 16,
    ...sombra,
  },
  bloque: {
    flex: 1,
    alignItems: 'center',
  },
  divisor: {
    width: 1,
    height: 28,
    backgroundColor: colores.borde,
  },
  numero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
  },
  etiqueta: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 2,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginTop: 12,
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
  lista: {
    padding: 16,
    paddingBottom: 90,
  },
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
    height: 44,
    borderRadius: 2,
    marginRight: 12,
  },
  textos: {
    flex: 1,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  direccion: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  chips: {
    flexDirection: 'row',
    marginTop: 7,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginRight: 7,
  },
  chipTexto: {
    fontSize: 11,
    color: colores.textoSuave,
    marginLeft: 4,
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
