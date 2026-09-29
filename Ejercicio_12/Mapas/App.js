
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';
import MapView, {Marker} from 'react-native-maps';

export default function App() {
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      // 1. Pedir permiso de ubicacion al usuario
      const {status} = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permiso de ubicacion denegado');
        return;
      }

      // 2. Obtener la posicion actual del dispositivo
      const posicion = await Location.getCurrentPositionAsync({});
      setUbicacion(posicion.coords);
    })();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!ubicacion) {
    return (
      <View style={styles.container}>
        <Text>Obteniendo ubicacion...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude: ubicacion.latitude,
          longitude: ubicacion.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: ubicacion.latitude,
            longitude: ubicacion.longitude,
          }}
          title="Aqui estoy"
          description="Mi ubicacion actual"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapa: {
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
