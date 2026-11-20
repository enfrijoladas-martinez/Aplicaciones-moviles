import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library/legacy';
import { detectarRostros } from './detectorRostros';

export default function App() {
  const [permisoCamara, pedirCamara] = useCameraPermissions();
  const [permisoGaleria, pedirGaleria] = MediaLibrary.usePermissions({ writeOnly: true });

  const camara = useRef(null);
  const [lado, setLado] = useState('front');
  const [foto, setFoto] = useState(null);
  const [analisis, setAnalisis] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [guardada, setGuardada] = useState(false);

  if (!permisoCamara || !permisoGaleria) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator color="#22c55e" size="large" />
        <Text style={estilos.texto}>Revisando permisos...</Text>
      </View>
    );
  }

  if (!permisoCamara.granted || !permisoGaleria.granted) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.titulo}>FaceRecognition</Text>
        <Text style={estilos.texto}>
          Para detectar rostros la app necesita usar la camara y guardar las fotos en tu galeria.
        </Text>

        {!permisoCamara.granted && (
          <Pressable style={estilos.boton} onPress={pedirCamara}>
            <Text style={estilos.textoBoton}>Permitir camara</Text>
          </Pressable>
        )}

        {!permisoGaleria.granted && (
          <Pressable style={estilos.boton} onPress={pedirGaleria}>
            <Text style={estilos.textoBoton}>Permitir galeria</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const tomarFoto = async () => {
    if (!camara.current || ocupado) {
      return;
    }

    setOcupado(true);

    try {
      const capturada = await camara.current.takePictureAsync({ quality: 0.6, base64: true });
      setFoto(capturada.uri);
      setGuardada(false);
      setAnalisis(null);

      setTimeout(() => {
        try {
          setAnalisis(detectarRostros(capturada.base64));
        } catch (error) {
          setAnalisis({ proporcion: capturada.width / capturada.height, rostros: [], error: true });
        } finally {
          setOcupado(false);
        }
      }, 60);
    } catch (error) {
      setOcupado(false);
      Alert.alert('Error', 'No se pudo tomar la foto.');
    }
  };

  const guardar = async () => {
    try {
      await MediaLibrary.saveToLibraryAsync(foto);
      setGuardada(true);
      Alert.alert('Listo', 'La foto se guardo en tu galeria.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la foto.');
    }
  };

  const repetir = () => {
    setFoto(null);
    setAnalisis(null);
    setGuardada(false);
  };

  if (foto) {
    const cuantos = analisis ? analisis.rostros.length : 0;
    let mensaje = 'Analizando rostro...';

    if (analisis && analisis.error) {
      mensaje = 'No se pudo analizar la foto';
    } else if (analisis) {
      mensaje = cuantos === 0
        ? 'No se detecto ningun rostro'
        : cuantos === 1
          ? 'Rostro detectado'
          : `${cuantos} rostros detectados`;
    }

    return (
      <View style={estilos.centro}>
        <StatusBar style="light" />

        <View style={[estilos.marcoFoto, { aspectRatio: analisis ? analisis.proporcion : 3 / 4 }]}>
          <Image source={{ uri: foto }} style={StyleSheet.absoluteFill} resizeMode="cover" />

          {analisis && analisis.rostros.map((rostro, indice) => (
            <View
              key={indice}
              style={[
                estilos.recuadro,
                {
                  left: `${rostro.x * 100}%`,
                  top: `${rostro.y * 100}%`,
                  width: `${rostro.ancho * 100}%`,
                  height: `${rostro.alto * 100}%`,
                },
              ]}
            />
          ))}
        </View>

        <View style={estilos.resultado}>
          {!analisis && <ActivityIndicator color="#22c55e" />}
          <Text style={[estilos.mensaje, analisis && cuantos === 0 && estilos.mensajeError]}>
            {mensaje}
          </Text>
        </View>

        <View style={estilos.fila}>
          <Pressable style={[estilos.boton, estilos.botonSecundario]} onPress={repetir}>
            <Text style={estilos.textoBoton}>Tomar otra</Text>
          </Pressable>

          <Pressable
            style={[estilos.boton, guardada && estilos.botonApagado]}
            onPress={guardar}
            disabled={guardada || !analisis}
          >
            <Text style={estilos.textoBoton}>{guardada ? 'Guardada' : 'Guardar'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={estilos.pantalla}>
      <StatusBar style="light" />
      <CameraView ref={camara} style={StyleSheet.absoluteFill} facing={lado} />

      <View style={estilos.capa} pointerEvents="box-none">
        <Text style={estilos.indicacion}>Coloca tu cara dentro del ovalo</Text>
        <View style={estilos.guia} />

        <View style={estilos.controles}>
          <View style={estilos.espacio} />

          <Pressable style={estilos.disparador} onPress={tomarFoto} disabled={ocupado}>
            {ocupado
              ? <ActivityIndicator color="#ffffff" />
              : <View style={estilos.disparadorCentro} />}
          </Pressable>

          <Pressable
            style={estilos.girar}
            onPress={() => setLado(lado === 'front' ? 'back' : 'front')}
          >
            <Text style={estilos.textoGirar}>⟲</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#000' },
  centro: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  texto: { color: '#cbd5e1', fontSize: 15, textAlign: 'center', marginVertical: 16 },
  boton: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 22,
    marginTop: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  botonSecundario: { backgroundColor: '#334155', marginRight: 12 },
  botonApagado: { backgroundColor: '#475569' },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  capa: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 70,
    paddingBottom: 48,
  },
  indicacion: {
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  guia: {
    width: 240,
    height: 310,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: 'rgba(34,197,94,0.85)',
    borderStyle: 'dashed',
  },
  controles: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  espacio: { width: 52 },
  disparador: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disparadorCentro: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
  girar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoGirar: { color: '#fff', fontSize: 26 },
  marcoFoto: {
    width: '100%',
    maxHeight: '65%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  recuadro: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#22c55e',
    borderRadius: 8,
  },
  resultado: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  mensaje: { color: '#4ade80', fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  mensajeError: { color: '#fca5a5' },
  fila: { flexDirection: 'row' },
});
