import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import EstadoConexion from './componentes/EstadoConexion';
import AgregarProducto from './componentes/AgregarProducto';
import ConsultarProductos from './componentes/ConsultarProductos';
import ActualizarProducto from './componentes/ActualizarProducto';
import EliminarProducto from './componentes/EliminarProducto';
import { estilos } from './estilos';

const PESTANAS = [
  { id: 'agregar', titulo: 'Agregar' },
  { id: 'consultar', titulo: 'Consultar' },
  { id: 'actualizar', titulo: 'Actualizar' },
  { id: 'eliminar', titulo: 'Eliminar' },
];

export default function App() {
  const [pestana, setPestana] = useState('agregar');
  const [version, setVersion] = useState(0);

  function alCambiar() {
    setVersion((anterior) => anterior + 1);
  }

  return (
    <View style={estilos.pantalla}>
      <StatusBar style="light" />

      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>Persistencia</Text>
        <Text style={estilos.subtitulo}>React Native + Supabase</Text>
      </View>

      <EstadoConexion version={version} />

      <View style={estilos.pestanas}>
        {PESTANAS.map((item) => (
          <Pressable
            key={item.id}
            style={[estilos.pestana, pestana === item.id && estilos.pestanaActiva]}
            onPress={() => setPestana(item.id)}>
            <Text
              style={[
                estilos.pestanaTexto,
                pestana === item.id && estilos.pestanaTextoActivo,
              ]}>
              {item.titulo}
            </Text>
          </Pressable>
        ))}
      </View>

      {pestana === 'agregar' ? <AgregarProducto alCambiar={alCambiar} /> : null}

      {pestana === 'consultar' ? <ConsultarProductos version={version} /> : null}

      {pestana === 'actualizar' ? (
        <ActualizarProducto version={version} alCambiar={alCambiar} />
      ) : null}

      {pestana === 'eliminar' ? (
        <EliminarProducto version={version} alCambiar={alCambiar} />
      ) : null}
    </View>
  );
}
