import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { supabase } from '../supabase';
import { estilos } from '../estilos';

export default function EliminarProducto({ version, alCambiar }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [borrando, setBorrando] = useState(null);

  useEffect(() => {
    cargar();
  }, [version]);

  async function cargar() {
    setCargando(true);

    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false });

    setCargando(false);

    if (error) {
      Alert.alert('No se pudo consultar', error.message);
      return;
    }

    setProductos(data ?? []);
  }

  function confirmar(item) {
    Alert.alert(
      'Eliminar registro',
      'Se va a borrar el id ' + item.id + ': ' + item.producto,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(item) },
      ],
    );
  }

  async function eliminar(item) {
    setBorrando(item.id);

    const { error } = await supabase.from('productos').delete().eq('id', item.id);

    setBorrando(null);

    if (error) {
      Alert.alert('No se pudo eliminar', error.message);
      return;
    }

    alCambiar();
    Alert.alert('Eliminado', 'Se borro el registro con id ' + item.id);
  }

  return (
    <View style={estilos.cuerpo}>
      <FlatList
        data={productos}
        contentContainerStyle={estilos.contenido}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View>
            <View style={estilos.tarjeta}>
              <Text style={estilos.tarjetaTitulo}>Eliminar registro</Text>
              <Text style={estilos.tarjetaNota}>delete from productos where id = ?</Text>

              <View style={estilos.botones}>
                <Pressable
                  style={[estilos.boton, estilos.botonPrincipal]}
                  onPress={cargar}>
                  <Text style={estilos.botonTexto}>Recargar</Text>
                </Pressable>
              </View>
            </View>

            <View style={estilos.encabezadoLista}>
              <Text style={estilos.tarjetaTitulo}>Elige cual borrar</Text>
              <Text style={estilos.contador}>{productos.length}</Text>
            </View>

            {cargando ? (
              <ActivityIndicator color="#1D4ED8" style={estilos.spinner} />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !cargando ? <Text style={estilos.vacio}>La tabla esta vacia</Text> : null
        }
        renderItem={({ item }) => (
          <View style={estilos.fila}>
            <View style={estilos.filaTexto}>
              <Text style={estilos.identificador}>id {item.id}</Text>
              <Text style={estilos.filaNombre}>{item.producto}</Text>
              {item.descripcion ? (
                <Text style={estilos.filaDescripcion}>{item.descripcion}</Text>
              ) : null}
              <Text style={estilos.filaPrecio}>
                {'$' + Number(item.precio ?? 0).toFixed(2)}
              </Text>
            </View>

            <Pressable
              style={[estilos.chip, borrando === item.id && estilos.botonApagado]}
              onPress={() => confirmar(item)}
              disabled={borrando === item.id}>
              <Text style={estilos.chipTexto}>
                {borrando === item.id ? '...' : 'Eliminar'}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
