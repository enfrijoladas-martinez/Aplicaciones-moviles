import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '../supabase';
import { estilos } from '../estilos';

export default function ActualizarProducto({ version, alCambiar }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [elegido, setElegido] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

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

  function elegir(item) {
    setElegido(item.id);
    setProducto(item.producto ?? '');
    setDescripcion(item.descripcion ?? '');
    setPrecio(String(item.precio ?? ''));
  }

  function cancelar() {
    setElegido(null);
    setProducto('');
    setDescripcion('');
    setPrecio('');
  }

  async function actualizar() {
    const nombre = producto.trim();
    const monto = Number(precio.replace(',', '.'));

    if (!nombre) {
      Alert.alert('Falta el nombre', 'Escribe el nombre del producto');
      return;
    }

    if (!precio.trim() || Number.isNaN(monto) || monto < 0) {
      Alert.alert('Precio invalido', 'Escribe un numero mayor o igual a cero');
      return;
    }

    setGuardando(true);

    const { data, error } = await supabase
      .from('productos')
      .update({ producto: nombre, descripcion: descripcion.trim(), precio: monto })
      .eq('id', elegido)
      .select();

    setGuardando(false);

    if (error) {
      Alert.alert('No se pudo actualizar', error.message);
      return;
    }

    cancelar();
    alCambiar();
    Alert.alert('Actualizado', 'Se modifico el registro con id ' + data[0].id);
  }

  return (
    <KeyboardAvoidingView
      style={estilos.cuerpo}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={productos}
        contentContainerStyle={estilos.contenido}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View style={estilos.tarjeta}>
              <Text style={estilos.tarjetaTitulo}>Actualizar registro</Text>
              <Text style={estilos.tarjetaNota}>
                {elegido
                  ? 'update productos set ... where id = ' + elegido
                  : 'Toca un producto de la lista para editarlo'}
              </Text>

              {elegido ? (
                <View>
                  <Text style={estilos.etiqueta}>Producto</Text>
                  <TextInput
                    style={estilos.campo}
                    value={producto}
                    onChangeText={setProducto}
                    placeholderTextColor="#94A3B8"
                  />

                  <Text style={estilos.etiqueta}>Descripcion</Text>
                  <TextInput
                    style={[estilos.campo, estilos.campoLargo]}
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholderTextColor="#94A3B8"
                    multiline
                  />

                  <Text style={estilos.etiqueta}>Precio</Text>
                  <TextInput
                    style={estilos.campo}
                    value={precio}
                    onChangeText={setPrecio}
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                  />

                  <View style={estilos.botones}>
                    <Pressable
                      style={[
                        estilos.boton,
                        estilos.botonPrincipal,
                        guardando && estilos.botonApagado,
                      ]}
                      onPress={actualizar}
                      disabled={guardando}>
                      <Text style={estilos.botonTexto}>
                        {guardando ? 'Actualizando...' : 'Actualizar'}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[estilos.boton, estilos.botonGris]}
                      onPress={cancelar}>
                      <Text style={estilos.botonTexto}>Cancelar</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={estilos.encabezadoLista}>
              <Text style={estilos.tarjetaTitulo}>Elige cual editar</Text>
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
          <Pressable
            style={[estilos.fila, elegido === item.id && estilos.filaElegida]}
            onPress={() => elegir(item)}>
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
          </Pressable>
        )}
      />
    </KeyboardAvoidingView>
  );
}
