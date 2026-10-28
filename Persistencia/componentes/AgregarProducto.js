import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '../supabase';
import { estilos } from '../estilos';

export default function AgregarProducto({ alCambiar }) {
  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [guardando, setGuardando] = useState(false);

  function limpiar() {
    setProducto('');
    setDescripcion('');
    setPrecio('');
  }

  async function guardar() {
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
      .insert({ producto: nombre, descripcion: descripcion.trim(), precio: monto })
      .select();

    setGuardando(false);

    if (error) {
      Alert.alert('No se pudo guardar', error.message);
      return;
    }

    limpiar();
    alCambiar();
    Alert.alert('Guardado', 'Se creo el registro con id ' + data[0].id);
  }

  return (
    <KeyboardAvoidingView
      style={estilos.cuerpo}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={estilos.cuerpo}
        contentContainerStyle={estilos.contenido}
        keyboardShouldPersistTaps="handled">
        <View style={estilos.tarjeta}>
          <Text style={estilos.tarjetaTitulo}>Agregar registro</Text>
          <Text style={estilos.tarjetaNota}>insert into productos</Text>

          <Text style={estilos.etiqueta}>Producto</Text>
          <TextInput
            style={estilos.campo}
            value={producto}
            onChangeText={setProducto}
            placeholder="Teclado mecanico"
            placeholderTextColor="#94A3B8"
          />

          <Text style={estilos.etiqueta}>Descripcion</Text>
          <TextInput
            style={[estilos.campo, estilos.campoLargo]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Switches rojos, 87 teclas"
            placeholderTextColor="#94A3B8"
            multiline
          />

          <Text style={estilos.etiqueta}>Precio</Text>
          <TextInput
            style={estilos.campo}
            value={precio}
            onChangeText={setPrecio}
            placeholder="1299.50"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
          />

          <View style={estilos.botones}>
            <Pressable
              style={[
                estilos.boton,
                estilos.botonVerde,
                guardando && estilos.botonApagado,
              ]}
              onPress={guardar}
              disabled={guardando}>
              <Text style={estilos.botonTexto}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </Text>
            </Pressable>

            <Pressable style={[estilos.boton, estilos.botonGris]} onPress={limpiar}>
              <Text style={estilos.botonTexto}>Limpiar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
