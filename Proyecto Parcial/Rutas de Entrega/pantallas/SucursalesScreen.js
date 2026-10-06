import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, sombra } from '../estilos/tema';
import { sucursales } from '../datos/sucursales';
import { coloresZona } from '../datos/paquetes';

export default function SucursalesScreen({ usuario, paquetes, alElegir, alSalir }) {
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrada, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const subida = entrada.interpolate({ inputRange: [0, 1], outputRange: [22, 0] });

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.encabezado}>
        <View style={estilos.saludoBloque}>
          <Text style={estilos.saludo}>Hola, {usuario.nombre.split(' ')[0]}</Text>
          <Text style={estilos.subtitulo}>{usuario.vehiculo} · {usuario.placas}</Text>
        </View>

        <Pressable style={estilos.salir} onPress={alSalir}>
          <Ionicons name="log-out-outline" size={21} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: entrada, transform: [{ translateY: subida }] }}>
          <Text style={estilos.pregunta}>En que central vas a cargar hoy?</Text>

          {sucursales.map((s) => {
            const suyos = paquetes.filter((p) => p.sucursalId === s.id);
            const peso = suyos.reduce((suma, p) => suma + p.peso, 0);
            const urgentes = suyos.filter((p) => p.prioridad === 'alta').length;

            const porZona = {};
            suyos.forEach((p) => {
              porZona[p.zona] = (porZona[p.zona] || 0) + 1;
            });

            return (
              <Pressable key={s.id} style={estilos.tarjeta} onPress={() => alElegir(s)}>
                <View style={estilos.tarjetaEncabezado}>
                  <View style={estilos.icono}>
                    <Ionicons name="business" size={22} color="#FFFFFF" />
                  </View>

                  <View style={estilos.tarjetaTextos}>
                    <Text style={estilos.nombre}>{s.nombre}</Text>
                    <Text style={estilos.direccion}>{s.direccion}</Text>
                    <Text style={estilos.horario}>Carga de {s.horario}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color={colores.borde} />
                </View>

                <View style={estilos.numeros}>
                  <View style={estilos.numeroBloque}>
                    <Text style={estilos.numero}>{suyos.length}</Text>
                    <Text style={estilos.numeroEtiqueta}>paquetes</Text>
                  </View>

                  <View style={estilos.numeroBloque}>
                    <Text style={estilos.numero}>{peso} kg</Text>
                    <Text style={estilos.numeroEtiqueta}>carga</Text>
                  </View>

                  <View style={estilos.numeroBloque}>
                    <Text style={[estilos.numero, urgentes > 0 && { color: colores.peligro }]}>
                      {urgentes}
                    </Text>
                    <Text style={estilos.numeroEtiqueta}>urgentes</Text>
                  </View>
                </View>

                <View style={estilos.zonas}>
                  {Object.keys(porZona).map((z) => (
                    <View key={z} style={[estilos.zona, { borderColor: coloresZona[z] }]}>
                      <View style={[estilos.punto, { backgroundColor: coloresZona[z] }]} />
                      <Text style={estilos.zonaTexto}>
                        {z} ({porZona[z]})
                      </Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}

          <Text style={estilos.nota}>
            Cada central tiene sus propios paquetes. Al entrar podras elegir cuales de esas
            direcciones te llevas en este viaje.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.primario,
    paddingTop: 54,
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  saludoBloque: {
    flex: 1,
  },
  saludo: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 3,
  },
  salir: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenido: {
    padding: 16,
    paddingBottom: 30,
  },
  pregunta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 14,
    marginLeft: 4,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 16,
    padding: 16,
    marginBottom: 13,
    ...sombra,
  },
  tarjetaEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icono: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colores.acento,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tarjetaTextos: {
    flex: 1,
    marginHorizontal: 13,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
  },
  direccion: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  horario: {
    fontSize: 11,
    color: colores.primario,
    marginTop: 3,
    fontWeight: '600',
  },
  numeros: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colores.fondo,
  },
  numeroBloque: {
    flex: 1,
    alignItems: 'center',
  },
  numero: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colores.texto,
  },
  numeroEtiqueta: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 1,
  },
  zonas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 13,
  },
  zona: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginRight: 7,
    marginBottom: 6,
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  zonaTexto: {
    fontSize: 11,
    color: colores.textoSuave,
  },
  nota: {
    fontSize: 12,
    color: colores.textoSuave,
    lineHeight: 18,
    marginTop: 6,
    marginHorizontal: 4,
  },
});
