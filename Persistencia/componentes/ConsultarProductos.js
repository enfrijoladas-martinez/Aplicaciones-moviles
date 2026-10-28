import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { supabase } from '../supabase';
import { estilos } from '../estilos';

export default function ConsultarProductos({ version }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    consultar();
  }, [version]);

  async function consultar() {
    setCargando(true);

    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false });

    setCargando(false);

    if (error) {
      setMensaje(error.message);
      setProductos([]);
      return;
    }

    setMensaje('');
    setProductos(data ?? []);
  }

  function fecha(valor) {
    if (!valor) {
      return '';
    }
    return new Date(valor).toLocaleString();
  }

  return (
    <View style={estilos.cuerpo}>
      <FlatList
        data={productos}
        contentContainerStyle={estilos.contenido}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={consultar} />
        }
        ListHeaderComponent={
          <View>
            <View style={estilos.tarjeta}>
              <Text style={estilos.tarjetaTitulo}>Consultar registros</Text>
              <Text style={estilos.tarjetaNota}>select * from productos</Text>

              <View style={estilos.botones}>
                <Pressable
                  style={[estilos.boton, estilos.botonPrincipal]}
                  onPress={consultar}>
                  <Text style={estilos.botonTexto}>Recargar</Text>
                </Pressable>
              </View>
            </View>

            <View style={estilos.encabezadoLista}>
              <Text style={estilos.tarjetaTitulo}>Resultados</Text>
              <Text style={estilos.contador}>{productos.length}</Text>
            </View>

            {cargando ? (
              <ActivityIndicator color="#1D4ED8" style={estilos.spinner} />
            ) : null}

            {mensaje ? <Text style={estilos.vacio}>{mensaje}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          !cargando && !mensaje ? (
            <Text style={estilos.vacio}>La tabla esta vacia</Text>
          ) : null
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
              <Text style={estilos.filaFecha}>{fecha(item.creado_en)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
