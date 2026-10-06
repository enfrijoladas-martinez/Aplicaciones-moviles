import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, sombra } from '../estilos/tema';

const temas = [
  { icono: 'phone-portrait-outline', titulo: 'Splash Screen', detalle: 'Animated con spring, sequence y barra de progreso' },
  { icono: 'menu-outline', titulo: 'Navegacion Drawer', detalle: 'createDrawerNavigator con cinco pantallas' },
  { icono: 'albums-outline', titulo: 'Modales', detalle: 'Alta de entregas y resultado de la optimizacion' },
  { icono: 'pulse-outline', titulo: 'Animaciones', detalle: 'Trazado de ruta, camion en movimiento y contadores' },
  { icono: 'list-outline', titulo: 'Listas', detalle: 'FlatList con buscador y ordenamiento por distancia' },
  { icono: 'create-outline', titulo: 'Formularios', detalle: 'TextInput, Switch y validacion de coordenadas' },
  { icono: 'hardware-chip-outline', titulo: 'Hardware', detalle: 'GPS del telefono con expo-location, sin internet' },
  { icono: 'git-network-outline', titulo: 'Algoritmos', detalle: 'Vecino mas cercano, 2-opt y Haversine' },
];

export default function AcercaScreen() {
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrada, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const subida = entrada.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Animated.View style={{ opacity: entrada, transform: [{ translateY: subida }] }}>
        <View style={estilos.portada}>
          <View style={estilos.logo}>
            <Ionicons name="navigate" size={34} color="#FFFFFF" />
          </View>
          <Text style={estilos.nombre}>RutaOptima</Text>
          <Text style={estilos.version}>Version 1.0</Text>
        </View>

        <View style={estilos.bloque}>
          <Text style={estilos.titulo}>Que resuelve</Text>
          <Text style={estilos.parrafo}>
            Una empresa de reparto tiene varios clientes que visitar en el dia. El orden en
            que los visita cambia por completo cuanto maneja, cuanto tarda y cuanta gasolina
            gasta. Esta aplicacion calcula el orden que menos kilometros recorre y traduce
            ese ahorro a pesos.
          </Text>
        </View>

        <View style={estilos.bloque}>
          <Text style={estilos.titulo}>Como lo calcula</Text>
          <Text style={estilos.parrafo}>
            Es el problema del agente viajero. Encontrar la mejor ruta exacta es inviable
            porque las combinaciones crecen de forma factorial: con 8 paradas hay mas de 40
            mil ordenes posibles, con 15 son billones.
          </Text>
          <Text style={estilos.parrafo}>
            Por eso se usan dos heuristicas. Primero vecino mas cercano, que arma una ruta
            rapida yendo siempre al punto mas proximo. Despues 2-opt, que revisa pares de
            tramos y los invierte cuando eso acorta el recorrido, deshaciendo los cruces que
            dejo el primer metodo.
          </Text>
        </View>

        <View style={estilos.bloque}>
          <Text style={estilos.titulo}>Sin internet</Text>
          <Text style={estilos.parrafo}>
            Las entregas se guardan en archivos del propio proyecto. El plano se dibuja con
            Views rotadas, sin librerias de graficos ni mapas en linea. Lo unico que toca
            hardware es el GPS, que no hace peticiones a ningun servidor.
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
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, paddingBottom: 30 },
  portada: { alignItems: 'center', paddingVertical: 22 },
  logo: {
    width: 74, height: 74, borderRadius: 23, backgroundColor: colores.primario,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  nombre: { fontSize: 24, fontWeight: 'bold', color: colores.texto },
  version: { fontSize: 13, color: colores.textoSuave, marginTop: 2 },
  bloque: {
    backgroundColor: colores.superficie, borderRadius: 14, padding: 16,
    marginBottom: 12, ...sombra,
  },
  titulo: { fontSize: 15, fontWeight: 'bold', color: colores.texto, marginBottom: 6 },
  parrafo: { fontSize: 14, color: colores.textoSuave, lineHeight: 21, marginBottom: 8 },
  seccion: {
    fontSize: 16, fontWeight: 'bold', color: colores.texto,
    marginTop: 10, marginBottom: 10, marginLeft: 4,
  },
  tema: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  temaIcono: {
    width: 34, height: 34, borderRadius: 11, backgroundColor: colores.primarioSuave,
    alignItems: 'center', justifyContent: 'center',
  },
  temaTextos: { flex: 1, marginLeft: 12 },
  temaTitulo: { fontSize: 14, fontWeight: '600', color: colores.texto },
  temaDetalle: { fontSize: 12, color: colores.textoSuave, marginTop: 1 },
  autor: { alignItems: 'center', marginTop: 18 },
  autorNombre: { fontSize: 15, fontWeight: '600', color: colores.texto },
  autorDato: { fontSize: 13, color: colores.textoSuave, marginTop: 2 },
});
