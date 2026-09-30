import 'react-native-gesture-handler';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './pantallas/SplashScreen';
import ResumenScreen from './pantallas/ResumenScreen';
import ProductosScreen from './pantallas/ProductosScreen';
import MovimientosScreen from './pantallas/MovimientosScreen';
import AcercaScreen from './pantallas/AcercaScreen';

import { productosIniciales } from './datos/productos';
import { colores } from './estilos/tema';

const Drawer = createDrawerNavigator();

export default function App() {
  const [listo, setListo] = useState(false);
  const [productos, setProductos] = useState(productosIniciales);
  const [movimientos, setMovimientos] = useState([]);

  const guardarProducto = (producto) => {
    const existe = productos.some((p) => p.id === producto.id);

    if (existe) {
      setProductos(productos.map((p) => (p.id === producto.id ? producto : p)));
    } else {
      setProductos([producto].concat(productos));
    }
  };

  const eliminarProducto = (producto) => {
    setProductos(productos.filter((p) => p.id !== producto.id));
  };

  const registrarMovimiento = (producto, tipo, cantidad) => {
    const restante =
      tipo === 'entrada' ? producto.stock + cantidad : producto.stock - cantidad;

    setProductos(
      productos.map((p) => (p.id === producto.id ? { ...p, stock: restante } : p))
    );

    const ahora = new Date();
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const fecha = dias[ahora.getDay()] + ' ' + ahora.getDate();
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const hora = ahora.getHours() + ':' + minutos;

    setMovimientos(
      [
        {
          id: String(Date.now()),
          nombre: producto.nombre,
          tipo: tipo,
          cantidad: cantidad,
          precio: producto.precio,
          restante: restante,
          fecha: fecha,
          hora: hora,
        },
      ].concat(movimientos)
    );
  };

  if (!listo) {
    return <SplashScreen alTerminar={() => setListo(true)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Resumen"
          screenOptions={{
            headerStyle: { backgroundColor: colores.primario },
            headerTintColor: colores.superficie,
            headerTitleStyle: { fontWeight: 'bold' },
            drawerActiveTintColor: colores.primario,
            drawerActiveBackgroundColor: colores.primarioSuave,
            drawerInactiveTintColor: colores.textoSuave,
            drawerLabelStyle: { fontSize: 15, marginLeft: -12 },
          }}
        >
          <Drawer.Screen
            name="Resumen"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="stats-chart-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <ResumenScreen {...props} productos={productos} movimientos={movimientos} />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Productos"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="cube-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <ProductosScreen
                {...props}
                productos={productos}
                alGuardarProducto={guardarProducto}
                alEliminarProducto={eliminarProducto}
                alRegistrarMovimiento={registrarMovimiento}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Movimientos"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="swap-vertical-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => <MovimientosScreen {...props} movimientos={movimientos} />}
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

      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
