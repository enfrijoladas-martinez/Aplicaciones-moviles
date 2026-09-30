import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, moneda, sombra } from '../estilos/tema';

export default function MovimientosScreen({ movimientos }) {
  const porFecha = {};

  movimientos.forEach((m) => {
    if (!porFecha[m.fecha]) porFecha[m.fecha] = [];
    porFecha[m.fecha].push(m);
  });

  const secciones = Object.keys(porFecha).map((fecha) => ({
    title: fecha,
    data: porFecha[fecha],
  }));

  const entradas = movimientos.filter((m) => m.tipo === 'entrada');
  const salidas = movimientos.filter((m) => m.tipo === 'salida');
  const piezasEntrada = entradas.reduce((suma, m) => suma + m.cantidad, 0);
  const piezasSalida = salidas.reduce((suma, m) => suma + m.cantidad, 0);
  const vendido = salidas.reduce((suma, m) => suma + m.cantidad * m.precio, 0);

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.resumen}>
        <View style={estilos.bloqueResumen}>
          <Ionicons name="arrow-down-circle" size={22} color={colores.exito} />
          <Text style={estilos.numeroResumen}>{piezasEntrada}</Text>
          <Text style={estilos.etiquetaResumen}>Entradas</Text>
        </View>

        <View style={estilos.bloqueResumen}>
          <Ionicons name="arrow-up-circle" size={22} color={colores.alerta} />
          <Text style={estilos.numeroResumen}>{piezasSalida}</Text>
          <Text style={estilos.etiquetaResumen}>Salidas</Text>
        </View>

        <View style={estilos.bloqueResumen}>
          <Ionicons name="cash-outline" size={22} color={colores.primario} />
          <Text style={estilos.numeroResumen}>{moneda(vendido)}</Text>
          <Text style={estilos.etiquetaResumen}>Vendido</Text>
        </View>
      </View>

      <SectionList
        sections={secciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <Text style={estilos.encabezadoSeccion}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={estilos.fila}>
            <View
              style={[
                estilos.icono,
                { backgroundColor: item.tipo === 'entrada' ? '#DCFCE7' : '#FEF3C7' },
              ]}
            >
              <Ionicons
                name={item.tipo === 'entrada' ? 'arrow-down' : 'arrow-up'}
                size={17}
                color={item.tipo === 'entrada' ? colores.exito : colores.alerta}
              />
            </View>

            <View style={estilos.textos}>
              <Text style={estilos.nombre} numberOfLines={1}>{item.nombre}</Text>
              <Text style={estilos.hora}>{item.hora}</Text>
            </View>

            <View style={estilos.derecha}>
              <Text
                style={[
                  estilos.cantidad,
                  { color: item.tipo === 'entrada' ? colores.exito : colores.alerta },
                ]}
              >
                {item.tipo === 'entrada' ? '+' : '-'}{item.cantidad}
              </Text>
              <Text style={estilos.restante}>quedan {item.restante}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={estilos.vacio}>
            <Ionicons name="time-outline" size={42} color={colores.borde} />
            <Text style={estilos.vacioTitulo}>Sin movimientos</Text>
            <Text style={estilos.vacioTexto}>
              Entra a Productos, toca uno y registra una entrada o salida.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  resumen: {
    flexDirection: 'row',
    backgroundColor: colores.superficie,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 16,
    ...sombra,
  },
  bloqueResumen: {
    flex: 1,
    alignItems: 'center',
  },
  numeroResumen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 5,
  },
  etiquetaResumen: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 1,
  },
  lista: {
    padding: 16,
    paddingBottom: 30,
  },
  encabezadoSeccion: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colores.textoSuave,
    backgroundColor: colores.fondo,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: 12,
    padding: 13,
    marginBottom: 9,
    ...sombra,
  },
  icono: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    marginLeft: 12,
  },
  nombre: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  hora: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  derecha: {
    alignItems: 'flex-end',
  },
  cantidad: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  restante: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 2,
  },
  vacio: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  vacioTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: colores.texto,
    marginTop: 12,
  },
  vacioTexto: {
    fontSize: 13,
    color: colores.textoSuave,
    textAlign: 'center',
    marginTop: 6,
  },
});
