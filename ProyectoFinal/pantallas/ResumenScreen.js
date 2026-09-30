import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Contador from '../componentes/Contador';
import BarraStock from '../componentes/BarraStock';
import { colores, moneda, sombra } from '../estilos/tema';
import { categorias } from '../datos/productos';

export default function ResumenScreen({ productos, movimientos }) {
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrada, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();
  }, []);

  const totalPiezas = productos.reduce((suma, p) => suma + p.stock, 0);
  const valorInventario = productos.reduce((suma, p) => suma + p.costo * p.stock, 0);
  const valorVenta = productos.reduce((suma, p) => suma + p.precio * p.stock, 0);
  const gananciaPotencial = valorVenta - valorInventario;
  const bajos = productos.filter((p) => p.minimo > 0 && p.stock <= p.minimo);

  const porCategoria = categorias
    .map((c) => {
      const delGrupo = productos.filter((p) => p.categoria === c);
      const piezas = delGrupo.reduce((suma, p) => suma + p.stock, 0);
      const valor = delGrupo.reduce((suma, p) => suma + p.costo * p.stock, 0);
      return { categoria: c, piezas: piezas, valor: valor, articulos: delGrupo.length };
    })
    .filter((g) => g.articulos > 0)
    .sort((a, b) => b.valor - a.valor);

  const mayorValor = porCategoria.length > 0 ? porCategoria[0].valor : 1;

  const desplazamiento = entrada.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Animated.View style={{ opacity: entrada, transform: [{ translateY: desplazamiento }] }}>
        <View style={estilos.principal}>
          <Text style={estilos.principalEtiqueta}>Valor del inventario</Text>
          <Contador valor={valorInventario} formato="moneda" estilo={estilos.principalValor} />

          <View style={estilos.principalPie}>
            <Ionicons name="trending-up" size={15} color="rgba(255,255,255,0.85)" />
            <Text style={estilos.principalPieTexto}>
              Ganancia potencial {moneda(gananciaPotencial)}
            </Text>
          </View>
        </View>

        <View style={estilos.fila}>
          <Ficha
            icono="cube-outline"
            etiqueta="Articulos"
            valor={productos.length}
            color={colores.primario}
          />
          <Ficha
            icono="layers-outline"
            etiqueta="Piezas"
            valor={totalPiezas}
            color={colores.exito}
          />
          <Ficha
            icono="alert-circle-outline"
            etiqueta="Stock bajo"
            valor={bajos.length}
            color={bajos.length > 0 ? colores.peligro : colores.textoSuave}
          />
        </View>

        <Text style={estilos.seccion}>Valor por categoria</Text>

        <View style={estilos.bloque}>
          {porCategoria.map((g) => (
            <View key={g.categoria} style={estilos.lineaCategoria}>
              <View style={estilos.lineaEncabezado}>
                <Text style={estilos.lineaNombre}>{g.categoria}</Text>
                <Text style={estilos.lineaValor}>{moneda(g.valor)}</Text>
              </View>

              <BarraStock proporcion={g.valor / mayorValor} color={colores.primario} />

              <Text style={estilos.lineaDetalle}>
                {g.articulos} articulos · {g.piezas} piezas
              </Text>
            </View>
          ))}
        </View>

        <Text style={estilos.seccion}>Necesitan resurtido</Text>

        <View style={estilos.bloque}>
          {bajos.length === 0 ? (
            <View style={estilos.vacio}>
              <Ionicons name="checkmark-circle" size={30} color={colores.exito} />
              <Text style={estilos.vacioTexto}>Todo el inventario esta por arriba del minimo</Text>
            </View>
          ) : (
            bajos.map((p) => (
              <View key={p.id} style={estilos.alerta}>
                <View style={estilos.alertaTextos}>
                  <Text style={estilos.alertaNombre}>{p.nombre}</Text>
                  <Text style={estilos.alertaDetalle}>
                    Quedan {p.stock} · minimo {p.minimo}
                  </Text>
                </View>

                <View style={estilos.alertaFaltan}>
                  <Text style={estilos.alertaFaltanNumero}>{p.minimo - p.stock + 1}</Text>
                  <Text style={estilos.alertaFaltanTexto}>faltan</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <Text style={estilos.seccion}>Actividad</Text>

        <View style={estilos.bloque}>
          <Text style={estilos.actividad}>
            {movimientos.length === 0
              ? 'Aun no se registran movimientos en esta sesion.'
              : movimientos.length + ' movimientos registrados en esta sesion.'}
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function Ficha({ icono, etiqueta, valor, color }) {
  return (
    <View style={estilos.ficha}>
      <Ionicons name={icono} size={20} color={color} />
      <Contador valor={valor} estilo={[estilos.fichaValor, { color: color }]} />
      <Text style={estilos.fichaEtiqueta}>{etiqueta}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    padding: 16,
    paddingBottom: 30,
  },
  principal: {
    backgroundColor: colores.primario,
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
  },
  principalEtiqueta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  principalValor: {
    color: colores.superficie,
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 4,
  },
  principalPie: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  principalPieTexto: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginLeft: 6,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ficha: {
    flex: 1,
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    ...sombra,
  },
  fichaValor: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 6,
  },
  fichaEtiqueta: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 4,
  },
  bloque: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 16,
    ...sombra,
  },
  lineaCategoria: {
    marginBottom: 14,
  },
  lineaEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  lineaNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  lineaValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colores.primario,
  },
  lineaDetalle: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 5,
  },
  vacio: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  vacioTexto: {
    color: colores.textoSuave,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colores.fondo,
  },
  alertaTextos: {
    flex: 1,
  },
  alertaNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  alertaDetalle: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  alertaFaltan: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  alertaFaltanNumero: {
    color: colores.peligro,
    fontSize: 17,
    fontWeight: 'bold',
  },
  alertaFaltanTexto: {
    color: colores.peligro,
    fontSize: 10,
  },
  actividad: {
    fontSize: 14,
    color: colores.textoSuave,
  },
});
