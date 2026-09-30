import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, moneda } from '../estilos/tema';
import { iconosCategoria } from '../datos/productos';

export default function ModalDetalle({ visible, producto, alMover, alEditar, alEliminar, alCerrar }) {
  const [cantidad, setCantidad] = useState('1');
  const [aviso, setAviso] = useState('');
  const [confirmando, setConfirmando] = useState(false);

  if (!producto) return null;

  const ganancia = producto.precio - producto.costo;
  const margen = producto.precio > 0 ? (ganancia / producto.precio) * 100 : 0;
  const valorInvertido = producto.costo * producto.stock;

  const mover = (tipo) => {
    const n = parseInt(cantidad, 10);

    if (isNaN(n) || n <= 0) {
      setAviso('Escribe una cantidad mayor a cero');
      return;
    }

    if (tipo === 'salida' && n > producto.stock) {
      setAviso('No puedes sacar mas de lo que hay en existencia');
      return;
    }

    setAviso('');
    setCantidad('1');
    alMover(producto, tipo, n);
  };

  const cerrar = () => {
    setAviso('');
    setCantidad('1');
    setConfirmando(false);
    alCerrar();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={cerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.tarjeta}>
          <View style={estilos.encabezado}>
            <View style={estilos.icono}>
              <Ionicons
                name={iconosCategoria[producto.categoria]}
                size={26}
                color={colores.primario}
              />
            </View>

            <View style={estilos.titulos}>
              <Text style={estilos.nombre}>{producto.nombre}</Text>
              <Text style={estilos.categoria}>{producto.categoria}</Text>
            </View>
          </View>

          <View style={estilos.datos}>
            <Dato etiqueta="Existencia" valor={String(producto.stock)} />
            <Dato etiqueta="Precio" valor={moneda(producto.precio)} />
            <Dato etiqueta="Costo" valor={moneda(producto.costo)} />
          </View>

          <View style={estilos.datos}>
            <Dato etiqueta="Ganancia" valor={moneda(ganancia)} color={colores.exito} />
            <Dato etiqueta="Margen" valor={Math.round(margen) + '%'} color={colores.exito} />
            <Dato etiqueta="Invertido" valor={moneda(valorInvertido)} />
          </View>

          {confirmando ? (
            <View style={estilos.confirmar}>
              <Text style={estilos.confirmarTexto}>
                Se eliminara este producto del inventario.
              </Text>

              <View style={estilos.acciones}>
                <Pressable style={estilos.botonSuave} onPress={() => setConfirmando(false)}>
                  <Text style={estilos.botonSuaveTexto}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={[estilos.boton, { backgroundColor: colores.peligro }]}
                  onPress={() => {
                    setConfirmando(false);
                    alEliminar(producto);
                  }}
                >
                  <Text style={estilos.botonTexto}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View>
              <Text style={estilos.etiqueta}>Registrar movimiento</Text>

              <View style={estilos.filaMovimiento}>
                <TextInput
                  style={estilos.campo}
                  keyboardType="numeric"
                  value={cantidad}
                  onChangeText={setCantidad}
                />

                <Pressable
                  style={[estilos.botonMovimiento, { backgroundColor: colores.exito }]}
                  onPress={() => mover('entrada')}
                >
                  <Ionicons name="arrow-down" size={16} color={colores.superficie} />
                  <Text style={estilos.botonMovimientoTexto}>Entrada</Text>
                </Pressable>

                <Pressable
                  style={[estilos.botonMovimiento, { backgroundColor: colores.alerta }]}
                  onPress={() => mover('salida')}
                >
                  <Ionicons name="arrow-up" size={16} color={colores.superficie} />
                  <Text style={estilos.botonMovimientoTexto}>Salida</Text>
                </Pressable>
              </View>

              {aviso !== '' && <Text style={estilos.aviso}>{aviso}</Text>}

              <View style={estilos.acciones}>
                <Pressable style={estilos.botonSuave} onPress={() => setConfirmando(true)}>
                  <Text style={[estilos.botonSuaveTexto, { color: colores.peligro }]}>
                    Eliminar
                  </Text>
                </Pressable>

                <Pressable style={estilos.boton} onPress={() => alEditar(producto)}>
                  <Text style={estilos.botonTexto}>Editar</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Pressable style={estilos.cerrar} onPress={cerrar}>
            <Text style={estilos.cerrarTexto}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Dato({ etiqueta, valor, color }) {
  return (
    <View style={estilos.dato}>
      <Text style={estilos.datoEtiqueta}>{etiqueta}</Text>
      <Text style={[estilos.datoValor, color && { color: color }]}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 20,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 20,
    padding: 22,
    width: '100%',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  icono: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulos: {
    flex: 1,
    marginLeft: 13,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
  },
  categoria: {
    fontSize: 13,
    color: colores.textoSuave,
    marginTop: 2,
  },
  datos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dato: {
    flex: 1,
  },
  datoEtiqueta: {
    fontSize: 12,
    color: colores.textoSuave,
  },
  datoValor: {
    fontSize: 16,
    fontWeight: '600',
    color: colores.texto,
    marginTop: 2,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoSuave,
    marginTop: 6,
    marginBottom: 8,
  },
  filaMovimiento: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  campo: {
    width: 62,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 16,
    color: colores.texto,
    backgroundColor: colores.fondo,
    marginRight: 10,
  },
  botonMovimiento: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
  },
  botonMovimientoTexto: {
    color: colores.superficie,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  aviso: {
    color: colores.peligro,
    fontSize: 13,
    marginTop: 10,
  },
  confirmar: {
    marginTop: 6,
  },
  confirmarTexto: {
    fontSize: 15,
    color: colores.texto,
    marginBottom: 6,
  },
  acciones: {
    flexDirection: 'row',
    marginTop: 18,
  },
  botonSuave: {
    flex: 1,
    paddingVertical: 13,
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
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: colores.primario,
    alignItems: 'center',
  },
  botonTexto: {
    color: colores.superficie,
    fontSize: 15,
    fontWeight: 'bold',
  },
  cerrar: {
    alignItems: 'center',
    marginTop: 14,
  },
  cerrarTexto: {
    color: colores.textoSuave,
    fontSize: 14,
  },
});
