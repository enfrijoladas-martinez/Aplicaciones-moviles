import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colores, sombra } from '../estilos/tema';

export default function AjustesScreen({ almacen, ajustes, alCambiarAjustes, alMoverAlmacen }) {
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState('');

  const usarMiUbicacion = async () => {
    setBuscando(true);
    setAviso('');

    try {
      const permiso = await Location.requestForegroundPermissionsAsync();

      if (permiso.status !== 'granted') {
        setAviso('Necesito permiso de ubicacion para usar el GPS');
        setBuscando(false);
        return;
      }

      const posicion = await Location.getCurrentPositionAsync({});

      alMoverAlmacen({
        lat: posicion.coords.latitude,
        lon: posicion.coords.longitude,
      });

      setAviso('Almacen movido a tu posicion actual');
    } catch (e) {
      setAviso('No se pudo obtener la ubicacion. Revisa que el GPS este encendido');
    } finally {
      setBuscando(false);
    }
  };

  const cambiarNumero = (campo, texto) => {
    const valor = parseFloat(texto);
    alCambiarAjustes({ ...ajustes, [campo]: isNaN(valor) ? 0 : valor });
  };

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Text style={estilos.seccion}>Punto de partida</Text>

      <View style={estilos.bloque}>
        <View style={estilos.almacen}>
          <View style={estilos.almacenIcono}>
            <Ionicons name="business" size={20} color="#FFFFFF" />
          </View>

          <View style={estilos.almacenTextos}>
            <Text style={estilos.almacenNombre}>{almacen.nombre}</Text>
            <Text style={estilos.almacenCoords}>
              {almacen.lat.toFixed(5)}, {almacen.lon.toFixed(5)}
            </Text>
          </View>
        </View>

        <Pressable style={estilos.botonGps} onPress={usarMiUbicacion} disabled={buscando}>
          {buscando ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Ionicons name="locate" size={17} color="#FFFFFF" />
          )}
          <Text style={estilos.botonGpsTexto}>
            {buscando ? 'Buscando senal...' : 'Usar mi ubicacion actual'}
          </Text>
        </Pressable>

        {aviso !== '' && <Text style={estilos.aviso}>{aviso}</Text>}

        <Text style={estilos.nota}>
          El GPS es hardware del telefono, no necesita internet. Las distancias se calculan
          con la formula de Haversine, que mide sobre la curvatura de la Tierra.
        </Text>
      </View>

      <Text style={estilos.seccion}>Datos del vehiculo</Text>

      <View style={estilos.bloque}>
        <Campo
          etiqueta="Velocidad promedio"
          sufijo="km/h"
          valor={ajustes.velocidad}
          alCambiar={(t) => cambiarNumero('velocidad', t)}
          ayuda="En ciudad con trafico ronda los 25 a 30"
        />

        <Campo
          etiqueta="Rendimiento"
          sufijo="km/L"
          valor={ajustes.rendimiento}
          alCambiar={(t) => cambiarNumero('rendimiento', t)}
          ayuda="Una camioneta de reparto da entre 8 y 12"
        />

        <Campo
          etiqueta="Precio de la gasolina"
          sufijo="por litro"
          valor={ajustes.precioLitro}
          alCambiar={(t) => cambiarNumero('precioLitro', t)}
          ayuda="Se usa para calcular el costo del viaje"
        />
      </View>

      <Text style={estilos.seccion}>Capacidad de carga</Text>

      <View style={estilos.bloque}>
        <View style={estilos.filaSwitch}>
          <View style={estilos.switchTextos}>
            <Text style={estilos.switchTitulo}>Partir la ruta en varios viajes</Text>
            <Text style={estilos.switchAyuda}>
              Si la carga no cabe de una vez, se divide en viajes que regresan al almacen
            </Text>
          </View>

          <Switch
            value={ajustes.usarCapacidad}
            onValueChange={(v) => alCambiarAjustes({ ...ajustes, usarCapacidad: v })}
          />
        </View>

        {ajustes.usarCapacidad && (
          <Campo
            etiqueta="Capacidad maxima"
            sufijo="kg"
            valor={ajustes.capacidad}
            alCambiar={(t) => cambiarNumero('capacidad', t)}
            ayuda="Cuanto aguanta el vehiculo por viaje"
          />
        )}
      </View>
    </ScrollView>
  );
}

function Campo({ etiqueta, sufijo, valor, alCambiar, ayuda }) {
  return (
    <View style={estilos.campo}>
      <View style={estilos.campoFila}>
        <Text style={estilos.campoEtiqueta}>{etiqueta}</Text>

        <View style={estilos.campoEntrada}>
          <TextInput
            style={estilos.campoTexto}
            keyboardType="numeric"
            value={String(valor)}
            onChangeText={alCambiar}
          />
          <Text style={estilos.campoSufijo}>{sufijo}</Text>
        </View>
      </View>

      <Text style={estilos.campoAyuda}>{ayuda}</Text>
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
  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 14,
    marginBottom: 10,
    marginLeft: 4,
  },
  bloque: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 16,
    ...sombra,
  },
  almacen: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  almacenIcono: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colores.acento,
    alignItems: 'center',
    justifyContent: 'center',
  },
  almacenTextos: {
    flex: 1,
    marginLeft: 12,
  },
  almacenNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  almacenCoords: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  botonGps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.primario,
    borderRadius: 11,
    paddingVertical: 13,
  },
  botonGpsTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  aviso: {
    fontSize: 13,
    color: colores.primario,
    marginTop: 10,
    textAlign: 'center',
  },
  nota: {
    fontSize: 12,
    color: colores.textoSuave,
    lineHeight: 18,
    marginTop: 12,
  },
  campo: {
    marginBottom: 14,
  },
  campoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  campoEtiqueta: {
    fontSize: 14,
    color: colores.texto,
    flex: 1,
  },
  campoEntrada: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  campoTexto: {
    width: 70,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 9,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 15,
    color: colores.texto,
    backgroundColor: colores.fondo,
  },
  campoSufijo: {
    fontSize: 12,
    color: colores.textoSuave,
    marginLeft: 7,
    width: 58,
  },
  campoAyuda: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 5,
  },
  filaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchTextos: {
    flex: 1,
    marginRight: 12,
  },
  switchTitulo: {
    fontSize: 14,
    color: colores.texto,
  },
  switchAyuda: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 3,
    lineHeight: 16,
  },
});
