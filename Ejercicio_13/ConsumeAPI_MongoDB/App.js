import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LoginScreen from './components/LoginScreen';
import MovieModal from './components/MovieModal';
import { API_URL, HEADERS } from './config';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);

  // Solo pedimos las peliculas cuando ya hay sesion iniciada.
  useEffect(() => {
    if (!usuario) return;

    const traerPeliculas = async () => {
      setCargando(true);
      setError('');

      try {
        const respuesta = await fetch(API_URL + '/movies', { headers: HEADERS });

        if (!respuesta.ok) {
          setError('El servidor respondio ' + respuesta.status);
          return;
        }

        setPeliculas(await respuesta.json());
      } catch (e) {
        setError('No hay conexion con el servidor. Revisa API_URL en config.js');
      } finally {
        setCargando(false);
      }
    };

    traerPeliculas();
  }, [usuario]);

  if (!usuario) {
    return <LoginScreen onLogin={setUsuario} />;
  }

  return (
    <View style={styles.container}>

      <View style={styles.encabezado}>
        <View>
          <Text style={styles.titulo}>Catalogo</Text>
          <Text style={styles.correo}>{usuario.email}</Text>
        </View>

        <Pressable onPress={() => { setUsuario(null); setPeliculas([]); }}>
          <Text style={styles.salir}>Salir</Text>
        </Pressable>
      </View>

      {cargando && <ActivityIndicator size="large" color="#e11d48" style={styles.centrado} />}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {!cargando && error === '' && (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <Pressable style={styles.tarjeta} onPress={() => setSeleccionada(item)}>
              {item.poster ? (
                <Image style={styles.miniatura} source={{ uri: item.poster }} />
              ) : (
                <View style={[styles.miniatura, styles.sinPoster]} />
              )}

              <View style={styles.datos}>
                <Text style={styles.nombre} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.resumen} numberOfLines={3}>
                  {item.fullplot || 'Sin descripcion'}
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.vacio}>No llegaron peliculas</Text>
          }
        />
      )}

      <MovieModal
        movie={seleccionada}
        visible={seleccionada !== null}
        onClose={() => setSeleccionada(null)}
      />

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 55,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titulo: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: 'bold',
  },
  correo: {
    color: '#94a3b8',
    fontSize: 13,
  },
  salir: {
    color: '#e11d48',
    fontSize: 15,
    fontWeight: 'bold',
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  miniatura: {
    width: 85,
    height: 125,
    resizeMode: 'cover',
  },
  sinPoster: {
    backgroundColor: '#334155',
  },
  datos: {
    flex: 1,
    padding: 12,
  },
  nombre: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resumen: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  centrado: {
    marginTop: 40,
  },
  error: {
    color: '#fbbf24',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  vacio: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 30,
  },
});
