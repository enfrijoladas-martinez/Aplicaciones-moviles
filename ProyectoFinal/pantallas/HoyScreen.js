import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Contador from '../componentes/Contador';
import Barra from '../componentes/Barra';
import TarjetaCita from '../componentes/TarjetaCita';
import { colores, moneda, sombra } from '../estilos/tema';
import { aMinutos, hoy } from '../utilidades/fechas';

export default function HoyScreen({ citas, clientes, servicios, alAbrirCita }) {
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrada, {
      toValue: 1,
      duration: 620,
      useNativeDriver: true,
    }).start();
  }, []);

  const buscarCliente = (id) => clientes.find((c) => c.id === id);
  const buscarServicio = (id) => servicios.find((s) => s.id === id);

  const deHoy = citas
    .filter((c) => c.fecha === hoy())
    .sort((a, b) => aMinutos(a.hora) - aMinutos(b.hora));

  const activas = deHoy.filter((c) => c.estado !== 'cancelada');
  const completadas = deHoy.filter((c) => c.estado === 'completada');
  const pendientes = deHoy.filter((c) => c.estado === 'pendiente');

  const ingresoLogrado = completadas.reduce((suma, c) => {
    const s = buscarServicio(c.servicioId);
    return suma + (s ? s.precio : 0);
  }, 0);

  const ingresoEsperado = activas.reduce((suma, c) => {
    const s = buscarServicio(c.servicioId);
    return suma + (s ? s.precio : 0);
  }, 0);

  const minutosOcupados = activas.reduce((suma, c) => {
    const s = buscarServicio(c.servicioId);
    return suma + (s ? s.duracion : 0);
  }, 0);

  const jornada = 480;
  const avance = ingresoEsperado > 0 ? ingresoLogrado / ingresoEsperado : 0;
  const siguiente = pendientes.length > 0 ? pendientes[0] : null;

  const desplazamiento = entrada.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
  });

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Animated.View style={{ opacity: entrada, transform: [{ translateY: desplazamiento }] }}>
        <View style={estilos.principal}>
          <Text style={estilos.principalEtiqueta}>Ingreso del dia</Text>
          <Contador valor={ingresoLogrado} formato="moneda" estilo={estilos.principalValor} />

          <Text style={estilos.principalMeta}>
            de {moneda(ingresoEsperado)} agendados
          </Text>

          <View style={estilos.barraPrincipal}>
            <Barra proporcion={avance} color={colores.superficie} />
          </View>
        </View>

        <View style={estilos.fila}>
          <Ficha
            icono="calendar-outline"
            etiqueta="Citas hoy"
            valor={activas.length}
            color={colores.primario}
          />
          <Ficha
            icono="checkmark-circle-outline"
            etiqueta="Atendidas"
            valor={completadas.length}
            color={colores.exito}
          />
          <Ficha
            icono="hourglass-outline"
            etiqueta="Pendientes"
            valor={pendientes.length}
            color={colores.alerta}
          />
        </View>

        <View style={estilos.bloqueOcupacion}>
          <View style={estilos.ocupacionEncabezado}>
            <Text style={estilos.ocupacionTitulo}>Ocupacion de la jornada</Text>
            <Text style={estilos.ocupacionPorcentaje}>
              {Math.round((minutosOcupados / jornada) * 100)}%
            </Text>
          </View>

          <Barra proporcion={minutosOcupados / jornada} color={colores.primario} />

          <Text style={estilos.ocupacionDetalle}>
            {Math.floor(minutosOcupados / 60)} h {minutosOcupados % 60} min ocupados de 8 horas
          </Text>
        </View>

        {siguiente && (
          <View style={estilos.siguiente}>
            <View style={estilos.siguienteIcono}>
              <Ionicons name="alarm-outline" size={20} color={colores.acento} />
            </View>

            <View style={estilos.siguienteTextos}>
              <Text style={estilos.siguienteEtiqueta}>Siguiente cita</Text>
              <Text style={estilos.siguienteNombre}>
                {buscarCliente(siguiente.clienteId).nombre} a las {siguiente.hora}
              </Text>
            </View>
          </View>
        )}

        <Text style={estilos.seccion}>Citas de hoy</Text>

        {deHoy.length === 0 ? (
          <View style={estilos.vacio}>
            <Ionicons name="cafe-outline" size={40} color={colores.borde} />
            <Text style={estilos.vacioTexto}>No hay citas agendadas para hoy</Text>
          </View>
        ) : (
          deHoy.map((c) => (
            <TarjetaCita
              key={c.id}
              cita={c}
              cliente={buscarCliente(c.clienteId)}
              servicio={buscarServicio(c.servicioId)}
              alPresionar={alAbrirCita}
            />
          ))
        )}
      </Animated.View>
    </ScrollView>
  );
}

function Ficha({ icono, etiqueta, valor, color }) {
  return (
    <View style={estilos.ficha}>
      <Ionicons name={icono} size={19} color={color} />
      <Contador valor={valor} estilo={[estilos.fichaValor, { color: color }]} />
      <Text style={estilos.fichaEtiqueta}>{etiqueta}</Text>
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
  principal: {
    backgroundColor: colores.primario,
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
  },
  principalEtiqueta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  principalValor: {
    color: colores.superficie,
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 4,
  },
  principalMeta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 12,
  },
  barraPrincipal: {
    opacity: 0.9,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ficha: {
    flex: 1,
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    ...sombra,
  },
  fichaValor: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
  fichaEtiqueta: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 2,
  },
  bloqueOcupacion: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    ...sombra,
  },
  ocupacionEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  ocupacionTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  ocupacionPorcentaje: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colores.primario,
  },
  ocupacionDetalle: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 7,
  },
  siguiente: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  siguienteIcono: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  siguienteTextos: {
    flex: 1,
    marginLeft: 12,
  },
  siguienteEtiqueta: {
    fontSize: 11,
    color: colores.acento,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  siguienteNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
    marginTop: 2,
  },
  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 4,
  },
  vacio: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  vacioTexto: {
    color: colores.textoSuave,
    fontSize: 14,
    marginTop: 10,
  },
});
