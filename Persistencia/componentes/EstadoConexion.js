import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { supabase, hayCredenciales } from '../supabase';
import { estilos } from '../estilos';

export default function EstadoConexion({ version }) {
  const [conexion, setConexion] = useState('probando');
  const [detalle, setDetalle] = useState('');

  useEffect(() => {
    probar();
  }, [version]);

  async function probar() {
    if (!hayCredenciales) {
      setConexion('error');
      setDetalle('Falta pegar la URL y la anon key en supabase.js');
      return;
    }

    setConexion('probando');

    const { error, count } = await supabase
      .from('productos')
      .select('id', { count: 'exact', head: true });

    if (error) {
      setConexion('error');
      setDetalle(error.message);
      return;
    }

    setConexion('ok');
    setDetalle('Tabla productos con ' + (count ?? 0) + ' registros');
  }

  const color =
    conexion === 'ok' ? '#16A34A' : conexion === 'error' ? '#DC2626' : '#CA8A04';

  const texto =
    conexion === 'ok'
      ? 'Conectado a Supabase'
      : conexion === 'error'
        ? 'Sin conexion'
        : 'Probando conexion...';

  return (
    <Pressable style={estilos.estado} onPress={probar}>
      <View style={[estilos.punto, { backgroundColor: color }]} />
      <View style={estilos.estadoTexto}>
        <Text style={[estilos.estadoTitulo, { color }]}>{texto}</Text>
        {detalle ? <Text style={estilos.estadoDetalle}>{detalle}</Text> : null}
      </View>
      <Text style={estilos.reintentar}>Probar</Text>
    </Pressable>
  );
}
