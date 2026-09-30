import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BarraStock from './BarraStock';
import { colores, moneda, sombra } from '../estilos/tema';
import { iconosCategoria } from '../datos/productos';

export default function TarjetaProducto({ producto, alPresionar }) {
  const bajo = producto.stock <= producto.minimo;
  const color = bajo ? colores.peligro : colores.exito;
  const proporcion = producto.stock / Math.max(producto.minimo * 2, 1);

  return (
    <Pressable style={estilos.tarjeta} onPress={() => alPresionar(producto)}>
      <View style={estilos.encabezado}>
        <View style={[estilos.icono, { backgroundColor: colores.primarioSuave }]}>
          <Ionicons
            name={iconosCategoria[producto.categoria]}
            size={20}
            color={colores.primario}
          />
        </View>

        <View style={estilos.centro}>
          <Text style={estilos.nombre} numberOfLines={1}>{producto.nombre}</Text>
          <Text style={estilos.categoria}>{producto.categoria}</Text>
        </View>

        <Text style={estilos.precio}>{moneda(producto.precio)}</Text>
      </View>

      <BarraStock proporcion={proporcion} color={color} />

      <View style={estilos.pie}>
        <Text style={[estilos.stock, { color: color }]}>
          {producto.stock} en existencia
        </Text>

        {bajo ? (
          <View style={estilos.etiqueta}>
            <Ionicons name="alert-circle" size={13} color={colores.peligro} />
            <Text style={estilos.etiquetaTexto}>Stock bajo</Text>
          </View>
        ) : (
          <Text style={estilos.minimo}>Minimo {producto.minimo}</Text>
        )}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...sombra,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icono: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centro: {
    flex: 1,
    marginHorizontal: 12,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  categoria: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.primario,
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  stock: {
    fontSize: 13,
    fontWeight: '600',
  },
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  etiquetaTexto: {
    color: colores.peligro,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  minimo: {
    fontSize: 12,
    color: colores.textoSuave,
  },
});
