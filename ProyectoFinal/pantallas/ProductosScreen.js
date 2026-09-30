import { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TarjetaProducto from '../componentes/TarjetaProducto';
import ModalProducto from '../componentes/ModalProducto';
import ModalDetalle from '../componentes/ModalDetalle';
import { colores } from '../estilos/tema';
import { categorias } from '../datos/productos';

export default function ProductosScreen({
  productos,
  alGuardarProducto,
  alEliminarProducto,
  alRegistrarMovimiento,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('Todas');
  const [detalle, setDetalle] = useState(null);
  const [formulario, setFormulario] = useState(false);
  const [editando, setEditando] = useState(null);

  const visibles = productos.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtro === 'Todas' || p.categoria === filtro;
    return coincideTexto && coincideCategoria;
  });

  const guardar = (producto) => {
    alGuardarProducto(producto);
    setFormulario(false);
    setEditando(null);
    setDetalle(null);
  };

  const mover = (producto, tipo, cantidad) => {
    alRegistrarMovimiento(producto, tipo, cantidad);
    setDetalle(null);
  };

  const eliminar = (producto) => {
    alEliminarProducto(producto);
    setDetalle(null);
  };

  const editar = (producto) => {
    setEditando(producto);
    setDetalle(null);
    setFormulario(true);
  };

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.buscador}>
        <Ionicons name="search" size={18} color={colores.textoSuave} />
        <TextInput
          style={estilos.campo}
          placeholder="Buscar producto..."
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
        {['Todas'].concat(categorias).map((c) => (
          <Pressable
            key={c}
            style={[estilos.ficha, filtro === c && estilos.fichaActiva]}
            onPress={() => setFiltro(c)}
          >
            <Text style={[estilos.fichaTexto, filtro === c && estilos.fichaTextoActivo]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={visibles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TarjetaProducto producto={item} alPresionar={setDetalle} />
        )}
        ListEmptyComponent={
          <View style={estilos.vacio}>
            <Ionicons name="file-tray-outline" size={42} color={colores.borde} />
            <Text style={estilos.vacioTexto}>No hay productos que coincidan</Text>
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
        <Ionicons name="add" size={28} color={colores.superficie} />
      </Pressable>

      <ModalDetalle
        visible={detalle !== null}
        producto={detalle}
        alMover={mover}
        alEditar={editar}
        alEliminar={eliminar}
        alCerrar={() => setDetalle(null)}
      />

      <ModalProducto
        visible={formulario}
        producto={editando}
        alGuardar={guardar}
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
    paddingTop: 6,
    paddingBottom: 90,
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
