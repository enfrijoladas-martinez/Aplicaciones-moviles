import 'react-native-gesture-handler';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './pantallas/SplashScreen';
import LoginScreen from './pantallas/LoginScreen';
import SucursalesScreen from './pantallas/SucursalesScreen';
import CargaScreen from './pantallas/CargaScreen';
import RutaScreen from './pantallas/RutaScreen';
import ComparativaScreen from './pantallas/ComparativaScreen';
import AjustesScreen from './pantallas/AjustesScreen';
import AcercaScreen from './pantallas/AcercaScreen';

import MenuLateral from './componentes/MenuLateral';
import ModalPaquete from './componentes/ModalPaquete';

import { paquetesIniciales } from './datos/paquetes';
import { ajustesIniciales } from './datos/ajustes';
import { colores } from './estilos/tema';

const Drawer = createDrawerNavigator();

export default function App() {
  const [listo, setListo] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [sucursal, setSucursal] = useState(null);
  const [paquetes, setPaquetes] = useState(paquetesIniciales);
  const [seleccionados, setSeleccionados] = useState([]);
  const [ajustes, setAjustes] = useState(ajustesIniciales);
  const [puntoNuevo, setPuntoNuevo] = useState(null);

  const cerrarSesion = () => {
    setUsuario(null);
    setSucursal(null);
    setSeleccionados([]);
  };

  const cambiarSucursal = () => {
    setSucursal(null);
    setSeleccionados([]);
  };

  const alternar = (id) => {
    if (seleccionados.indexOf(id) !== -1) {
      setSeleccionados(seleccionados.filter((x) => x !== id));
    } else {
      setSeleccionados(seleccionados.concat([id]));
    }
  };

  const seleccionarVarios = (ids, marcar) => {
    if (marcar) {
      const nuevos = ids.filter((id) => seleccionados.indexOf(id) === -1);
      setSeleccionados(seleccionados.concat(nuevos));
    } else {
      setSeleccionados(seleccionados.filter((id) => ids.indexOf(id) === -1));
    }
  };

  const guardarPaquete = (paquete) => {
    const existe = paquetes.some((p) => p.id === paquete.id);

    if (existe) {
      setPaquetes(paquetes.map((p) => (p.id === paquete.id ? paquete : p)));
    } else {
      setPaquetes(paquetes.concat([paquete]));
      setSeleccionados(seleccionados.concat([paquete.id]));
    }
  };

  const eliminarPaquete = (paquete) => {
    setPaquetes(paquetes.filter((p) => p.id !== paquete.id));
    setSeleccionados(seleccionados.filter((id) => id !== paquete.id));
  };

  if (!listo) {
    return <SplashScreen alTerminar={() => setListo(true)} />;
  }

  if (!usuario) {
    return <LoginScreen alEntrar={setUsuario} />;
  }

  if (!sucursal) {
    return (
      <SucursalesScreen
        usuario={usuario}
        paquetes={paquetes}
        alElegir={setSucursal}
        alSalir={cerrarSesion}
      />
    );
  }

  const almacen = {
    ...sucursal,
    id: 'almacen',
    destinatario: sucursal.nombre,
    peso: 0,
  };

  const deLaSucursal = paquetes.filter((p) => p.sucursalId === sucursal.id);
  const cargados = paquetes.filter((p) => seleccionados.indexOf(p.id) !== -1);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Carga"
          drawerContent={(props) => (
            <MenuLateral
              {...props}
              usuario={usuario}
              sucursal={sucursal}
              seleccionados={cargados.length}
              alCambiarSucursal={cambiarSucursal}
              alSalir={cerrarSesion}
            />
          )}
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
            name="Carga"
            options={{
              title: 'Paquetes por entregar',
              drawerIcon: ({ color }) => (
                <Ionicons name="cube-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <CargaScreen
                {...props}
                sucursal={almacen}
                paquetes={deLaSucursal}
                seleccionados={seleccionados}
                ajustes={ajustes}
                alAlternar={alternar}
                alSeleccionarVarios={seleccionarVarios}
                alGuardarPaquete={guardarPaquete}
                alEliminarPaquete={eliminarPaquete}
                alConfirmar={() => {}}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Ruta"
            options={{
              title: 'Ruta optimizada',
              drawerIcon: ({ color }) => (
                <Ionicons name="map-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <RutaScreen
                {...props}
                almacen={almacen}
                entregas={cargados}
                ajustes={ajustes}
                alAgregarEnPunto={setPuntoNuevo}
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
                entregas={cargados}
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
                alMoverAlmacen={(coords) =>
                  setSucursal({
                    ...sucursal,
                    nombre: 'Mi ubicacion actual',
                    direccion: 'Tomada del GPS',
                    lat: coords.lat,
                    lon: coords.lon,
                  })
                }
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

      <ModalPaquete
        visible={puntoNuevo !== null}
        entrega={null}
        sucursal={sucursal}
        sugerencia={puntoNuevo}
        alGuardar={(paquete) => {
          guardarPaquete(paquete);
          setPuntoNuevo(null);
        }}
        alEliminar={() => setPuntoNuevo(null)}
        alCerrar={() => setPuntoNuevo(null)}
      />

      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
