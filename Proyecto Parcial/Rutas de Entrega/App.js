import 'react-native-gesture-handler';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './pantallas/SplashScreen';
import RutaScreen from './pantallas/RutaScreen';
import EntregasScreen from './pantallas/EntregasScreen';
import ComparativaScreen from './pantallas/ComparativaScreen';
import AjustesScreen from './pantallas/AjustesScreen';
import AcercaScreen from './pantallas/AcercaScreen';

import ModalEntrega from './componentes/ModalEntrega';

import { almacenInicial, entregasIniciales, ajustesIniciales } from './datos/entregas';
import { colores } from './estilos/tema';

const Drawer = createDrawerNavigator();

export default function App() {
  const [listo, setListo] = useState(false);
  const [almacen, setAlmacen] = useState(almacenInicial);
  const [entregas, setEntregas] = useState(entregasIniciales);
  const [ajustes, setAjustes] = useState(ajustesIniciales);
  const [sugerencia, setSugerencia] = useState(null);

  const guardarEntrega = (entrega) => {
    const existe = entregas.some((e) => e.id === entrega.id);

    if (existe) {
      setEntregas(entregas.map((e) => (e.id === entrega.id ? entrega : e)));
    } else {
      setEntregas(entregas.concat([entrega]));
    }
  };

  const eliminarEntrega = (entrega) => {
    setEntregas(entregas.filter((e) => e.id !== entrega.id));
  };

  const moverAlmacen = (coords) => {
    setAlmacen({
      ...almacen,
      nombre: 'Mi ubicacion actual',
      direccion: 'Tomada del GPS',
      lat: coords.lat,
      lon: coords.lon,
    });
  };

  if (!listo) {
    return <SplashScreen alTerminar={() => setListo(true)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Ruta"
          screenOptions={{
            headerStyle: { backgroundColor: colores.primario },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
            drawerActiveTintColor: colores.primario,
            drawerActiveBackgroundColor: colores.primarioSuave,
            drawerInactiveTintColor: colores.textoSuave,
            drawerLabelStyle: { fontSize: 15, marginLeft: -12 },
          }}
        >
          <Drawer.Screen
            name="Ruta"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="map-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <RutaScreen
                {...props}
                almacen={almacen}
                entregas={entregas}
                ajustes={ajustes}
                alAgregarEnPunto={(coords) => {
                  setSugerencia(coords);
                }}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Entregas"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="cube-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <EntregasScreen
                {...props}
                almacen={almacen}
                entregas={entregas}
                alGuardarEntrega={guardarEntrega}
                alEliminarEntrega={eliminarEntrega}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Comparativa"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="analytics-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <ComparativaScreen
                {...props}
                almacen={almacen}
                entregas={entregas}
                ajustes={ajustes}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Ajustes"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="settings-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <AjustesScreen
                {...props}
                almacen={almacen}
                ajustes={ajustes}
                alCambiarAjustes={setAjustes}
                alMoverAlmacen={moverAlmacen}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Acerca de"
            component={AcercaScreen}
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="information-circle-outline" size={20} color={color} />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>

      <ModalEntrega
        visible={sugerencia !== null}
        entrega={null}
        sugerencia={sugerencia}
        alGuardar={(entrega) => {
          guardarEntrega(entrega);
          setSugerencia(null);
        }}
        alEliminar={() => setSugerencia(null)}
        alCerrar={() => setSugerencia(null)}
      />

      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
