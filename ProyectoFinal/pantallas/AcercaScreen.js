import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, sombra } from '../estilos/tema';

const temas = [
  { icono: 'phone-portrait-outline', titulo: 'Splash Screen', detalle: 'Animated con spring, timing, sequence y parallel' },
  { icono: 'menu-outline', titulo: 'Navegacion Drawer', detalle: 'createDrawerNavigator con cuatro pantallas' },
  { icono: 'albums-outline', titulo: 'Modales', detalle: 'Formulario de producto y detalle con confirmacion' },
  { icono: 'pulse-outline', titulo: 'Animaciones', detalle: 'Contadores progresivos y barras de nivel' },
  { icono: 'list-outline', titulo: 'Listas', detalle: 'FlatList con busqueda y SectionList por fecha' },
  { icono: 'create-outline', titulo: 'Formularios', detalle: 'TextInput, Switch y validacion de datos' },
  { icono: 'calculator-outline', titulo: 'Calculos', detalle: 'Valor invertido, margen de ganancia y minimos' },
  { icono: 'cube-outline', titulo: 'Componentes', detalle: 'Reutilizables con props y estilos compartidos' },
];

export default function AcercaScreen() {
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrada, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const subida = entrada.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Animated.View style={{ opacity: entrada, transform: [{ translateY: subida }] }}>
        <View style={estilos.portada}>
          <View style={estilos.logo}>
            <Ionicons name="cube" size={38} color={colores.superficie} />
          </View>
          <Text style={estilos.nombre}>StockFacil</Text>
          <Text style={estilos.version}>Version 1.0</Text>
        </View>

        <View style={estilos.bloque}>
          <Text style={estilos.titulo}>Para que sirve</Text>
          <Text style={estilos.parrafo}>
            Herramienta para que un negocio pequeno lleve el control de su inventario sin
            depender de internet. Permite registrar productos, dar entradas y salidas de
            mercancia, y saber en todo momento cuanto dinero hay invertido y que articulos
            estan por agotarse.
          </Text>
        </View>

        <View style={estilos.bloque}>
          <Text style={estilos.titulo}>Funciona sin conexion</Text>
          <Text style={estilos.parrafo}>
            Toda la informacion vive dentro del proyecto. Los productos iniciales se cargan
            desde el archivo datos/productos.js y los cambios se manejan en memoria mientras
            la aplicacion esta abierta. No hay base de datos ni peticiones a servidores.
          </Text>
        </View>

        <Text style={estilos.seccion}>Temas aplicados</Text>

        <View style={estilos.bloque}>
          {temas.map((t) => (
            <View key={t.titulo} style={estilos.tema}>
              <View style={estilos.temaIcono}>
                <Ionicons name={t.icono} size={18} color={colores.primario} />
              </View>

              <View style={estilos.temaTextos}>
                <Text style={estilos.temaTitulo}>{t.titulo}</Text>
                <Text style={estilos.temaDetalle}>{t.detalle}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={estilos.autor}>
          <Text style={estilos.autorNombre}>Elias Martinez Garcia</Text>
          <Text style={estilos.autorDato}>Matricula 202260437</Text>
          <Text style={estilos.autorDato}>Aplicaciones Moviles</Text>
        </View>
      </Animated.View>
    </ScrollView>
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
  portada: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: colores.primario,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colores.texto,
  },
  version: {
    fontSize: 13,
    color: colores.textoSuave,
    marginTop: 2,
  },
  bloque: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    ...sombra,
  },
  titulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 6,
  },
  parrafo: {
    fontSize: 14,
    color: colores.textoSuave,
    lineHeight: 21,
  },
  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 4,
  },
  tema: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  temaIcono: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temaTextos: {
    flex: 1,
    marginLeft: 12,
  },
  temaTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  temaDetalle: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 1,
  },
  autor: {
    alignItems: 'center',
    marginTop: 18,
  },
  autorNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  autorDato: {
    fontSize: 13,
    color: colores.textoSuave,
    marginTop: 2,
  },
});
