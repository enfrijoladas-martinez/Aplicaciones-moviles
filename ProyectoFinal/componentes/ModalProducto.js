import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colores } from '../estilos/tema';
import { categorias } from '../datos/productos';

export default function ModalProducto({ visible, producto, alGuardar, alCerrar }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState(categorias[0]);
  const [precio, setPrecio] = useState('');
  const [costo, setCosto] = useState('');
  const [stock, setStock] = useState('');
  const [minimo, setMinimo] = useState('');
  const [controlar, setControlar] = useState(true);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    if (!visible) return;

    if (producto) {
      setNombre(producto.nombre);
      setCategoria(producto.categoria);
      setPrecio(String(producto.precio));
      setCosto(String(producto.costo));
      setStock(String(producto.stock));
      setMinimo(String(producto.minimo));
      setControlar(producto.minimo > 0);
    } else {
      setNombre('');
      setCategoria(categorias[0]);
      setPrecio('');
      setCosto('');
      setStock('');
      setMinimo('');
      setControlar(true);
    }

    setAviso('');
  }, [visible, producto]);

  const guardar = () => {
    const p = parseFloat(precio);
    const c = parseFloat(costo);
    const s = parseInt(stock, 10);
    const m = controlar ? parseInt(minimo, 10) : 0;

    if (!nombre.trim()) {
      setAviso('Escribe el nombre del producto');
      return;
    }

    if (isNaN(p) || isNaN(c) || isNaN(s) || p < 0 || c < 0 || s < 0) {
      setAviso('Precio, costo y existencia deben ser numeros validos');
      return;
    }

    if (controlar && (isNaN(m) || m < 0)) {
      setAviso('El minimo debe ser un numero valido');
      return;
    }

    if (c > p) {
      setAviso('El costo no puede ser mayor que el precio de venta');
      return;
    }

    alGuardar({
      id: producto ? producto.id : String(Date.now()),
      nombre: nombre.trim(),
      categoria: categoria,
      precio: p,
      costo: c,
      stock: s,
      minimo: m,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={alCerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.hoja}>
          <View style={estilos.barra} />

          <Text style={estilos.titulo}>
            {producto ? 'Editar producto' : 'Nuevo producto'}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={estilos.etiqueta}>Nombre</Text>
            <TextInput
              style={estilos.campo}
              placeholder="Ej. Agua natural 1L"
              placeholderTextColor={colores.textoSuave}
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={estilos.etiqueta}>Categoria</Text>
            <View style={estilos.fichas}>
              {categorias.map((c) => (
                <Pressable
                  key={c}
                  style={[estilos.ficha, categoria === c && estilos.fichaActiva]}
                  onPress={() => setCategoria(c)}
                >
                  <Text style={[estilos.fichaTexto, categoria === c && estilos.fichaTextoActivo]}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={estilos.fila}>
              <View style={estilos.mitad}>
                <Text style={estilos.etiqueta}>Costo</Text>
                <TextInput
                  style={estilos.campo}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colores.textoSuave}
                  value={costo}
                  onChangeText={setCosto}
                />
              </View>

              <View style={estilos.mitad}>
                <Text style={estilos.etiqueta}>Precio venta</Text>
                <TextInput
                  style={estilos.campo}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colores.textoSuave}
                  value={precio}
                  onChangeText={setPrecio}
                />
              </View>
            </View>

            <Text style={estilos.etiqueta}>Existencia inicial</Text>
            <TextInput
              style={estilos.campo}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colores.textoSuave}
              value={stock}
              onChangeText={setStock}
            />

            <View style={estilos.filaSwitch}>
              <Text style={estilos.etiquetaSwitch}>Avisar cuando sea bajo</Text>
              <Switch value={controlar} onValueChange={setControlar} />
            </View>

            {controlar && (
              <TextInput
                style={estilos.campo}
                keyboardType="numeric"
                placeholder="Existencia minima"
                placeholderTextColor={colores.textoSuave}
                value={minimo}
                onChangeText={setMinimo}
              />
            )}

            {aviso !== '' && <Text style={estilos.aviso}>{aviso}</Text>}
          </ScrollView>

          <View style={estilos.acciones}>
            <Pressable style={estilos.botonSuave} onPress={alCerrar}>
              <Text style={estilos.botonSuaveTexto}>Cancelar</Text>
            </Pressable>

            <Pressable style={estilos.boton} onPress={guardar}>
              <Text style={estilos.botonTexto}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  hoja: {
    backgroundColor: colores.superficie,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingBottom: 26,
    paddingTop: 10,
    maxHeight: '88%',
  },
  barra: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colores.borde,
    alignSelf: 'center',
    marginBottom: 14,
  },
  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 16,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoSuave,
    marginBottom: 6,
    marginTop: 4,
  },
  campo: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: colores.texto,
    marginBottom: 12,
    backgroundColor: colores.fondo,
  },
  fichas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  ficha: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colores.fondo,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: 8,
    marginBottom: 8,
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
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mitad: {
    width: '48%',
  },
  filaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  etiquetaSwitch: {
    fontSize: 15,
    color: colores.texto,
  },
  aviso: {
    color: colores.peligro,
    fontSize: 13,
    marginBottom: 6,
  },
  acciones: {
    flexDirection: 'row',
    marginTop: 16,
  },
  botonSuave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colores.fondo,
    alignItems: 'center',
    marginRight: 10,
  },
  botonSuaveTexto: {
    color: colores.textoSuave,
    fontSize: 15,
    fontWeight: '600',
  },
  boton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colores.primario,
    alignItems: 'center',
  },
  botonTexto: {
    color: colores.superficie,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
