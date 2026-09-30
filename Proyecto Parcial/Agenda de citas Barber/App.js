import 'react-native-gesture-handler';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './pantallas/SplashScreen';
import HoyScreen from './pantallas/HoyScreen';
import AgendaScreen from './pantallas/AgendaScreen';
import ClientesScreen from './pantallas/ClientesScreen';
import ServiciosScreen from './pantallas/ServiciosScreen';
import AcercaScreen from './pantallas/AcercaScreen';

import ModalCita from './componentes/ModalCita';
import ModalDetalleCita from './componentes/ModalDetalleCita';

import { citasIniciales } from './datos/citas';
import { clientesIniciales } from './datos/clientes';
import { serviciosIniciales } from './datos/servicios';
import { colores } from './estilos/tema';

const Drawer = createDrawerNavigator();

export default function App() {
  const [listo, setListo] = useState(false);
  const [citas, setCitas] = useState(citasIniciales);
  const [clientes, setClientes] = useState(clientesIniciales);
  const [servicios, setServicios] = useState(serviciosIniciales);
  const [detalle, setDetalle] = useState(null);
  const [formulario, setFormulario] = useState(false);

  const agendar = (datos) => {
    let idCliente = datos.clienteId;

    if (datos.nuevoCliente) {
      idCliente = 'c' + Date.now();
      setClientes(
        clientes.concat([
          {
            id: idCliente,
            nombre: datos.nuevoCliente.nombre,
            telefono: datos.nuevoCliente.telefono || 'Sin telefono',
          },
        ])
      );
    }

    setCitas(
      citas.concat([
        {
          id: 'a' + Date.now(),
          clienteId: idCliente,
          servicioId: datos.servicioId,
          fecha: datos.fecha,
          hora: datos.hora,
          estado: 'pendiente',
        },
      ])
    );

    setFormulario(false);
  };

  const cambiarEstado = (cita, estado) => {
    setCitas(citas.map((c) => (c.id === cita.id ? { ...c, estado: estado } : c)));
    setDetalle(null);
  };

  const eliminarCita = (cita) => {
    setCitas(citas.filter((c) => c.id !== cita.id));
    setDetalle(null);
  };

  const guardarServicio = (servicio) => {
    const existe = servicios.some((s) => s.id === servicio.id);

    if (existe) {
      setServicios(servicios.map((s) => (s.id === servicio.id ? servicio : s)));
    } else {
      setServicios(servicios.concat([servicio]));
    }
  };

  if (!listo) {
    return <SplashScreen alTerminar={() => setListo(true)} />;
  }

  const citaAbierta = citas.find((c) => detalle !== null && c.id === detalle.id);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Hoy"
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
            name="Hoy"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="today-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <HoyScreen
                {...props}
                citas={citas}
                clientes={clientes}
                servicios={servicios}
                alAbrirCita={setDetalle}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Agenda"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="calendar-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <AgendaScreen
                {...props}
                citas={citas}
                clientes={clientes}
                servicios={servicios}
                alAbrirCita={setDetalle}
                alAbrirFormulario={() => setFormulario(true)}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Clientes"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="people-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <ClientesScreen
                {...props}
                clientes={clientes}
                citas={citas}
                servicios={servicios}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen
            name="Servicios"
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="pricetags-outline" size={20} color={color} />
              ),
            }}
          >
            {(props) => (
              <ServiciosScreen
                {...props}
                servicios={servicios}
                citas={citas}
                alGuardarServicio={guardarServicio}
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

      <ModalCita
        visible={formulario}
        clientes={clientes}
        servicios={servicios}
        citas={citas}
        alGuardar={agendar}
        alCerrar={() => setFormulario(false)}
      />

      <ModalDetalleCita
        visible={detalle !== null}
        cita={citaAbierta}
        cliente={citaAbierta ? clientes.find((c) => c.id === citaAbierta.clienteId) : null}
        servicio={citaAbierta ? servicios.find((s) => s.id === citaAbierta.servicioId) : null}
        alCambiarEstado={cambiarEstado}
        alEliminar={eliminarCita}
        alCerrar={() => setDetalle(null)}
      />

      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
