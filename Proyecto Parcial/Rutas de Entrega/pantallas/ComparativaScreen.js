import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Barra from '../componentes/Barra';
import Contador from '../componentes/Contador';
import { colores, moneda, sombra, tiempo } from '../estilos/tema';
import { haversine } from '../utilidades/geo';
import {
  calcularMetricas,
  distanciaDeRuta,
  optimizar,
  partirPorCapacidad,
  rutaSinOptimizar,
  vecinoMasCercano,
} from '../utilidades/ruta';

export default function ComparativaScreen({ almacen, entregas, ajustes }) {
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrada, { toValue: 1, duration: 650, useNativeDriver: true }).start();
  }, []);

  if (entregas.length < 2) {
    return (
      <View style={estilos.centrado}>
        <Ionicons name="analytics-outline" size={46} color={colores.borde} />
        <Text style={estilos.vacioTitulo}>No hay carga confirmada</Text>
        <Text style={estilos.vacioTexto}>
          Selecciona al menos dos paquetes en la pantalla de Carga para comparar rutas.
        </Text>
      </View>
    );
  }

  const mala = rutaSinOptimizar(almacen, entregas);
  const vecino = vecinoMasCercano(almacen, entregas);
  const r = optimizar(almacen, entregas);

  const dMala = distanciaDeRuta(mala);
  const dVecino = distanciaDeRuta(vecino);
  const dFinal = distanciaDeRuta(r.ruta);

  const mMala = calcularMetricas(dMala, ajustes, entregas.length);
  const mFinal = calcularMetricas(dFinal, ajustes, entregas.length);

  const ahorroKm = dMala - dFinal;
  const ahorroPesos = mMala.costo - mFinal.costo;
  const ahorroMin = mMala.minutos - mFinal.minutos;

  const viajes = ajustes.usarCapacidad
    ? partirPorCapacidad(almacen, r.ruta, ajustes.capacidad)
    : [r.ruta];

  const masLejana = entregas
    .map((e) => ({ ...e, d: haversine(almacen, e) }))
    .sort((a, b) => b.d - a.d)[0];

  const subida = entrada.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Animated.View style={{ opacity: entrada, transform: [{ translateY: subida }] }}>
        <View style={estilos.principal}>
          <Text style={estilos.principalEtiqueta}>Ahorro por viaje</Text>
          <Contador valor={ahorroPesos} formato="moneda" estilo={estilos.principalValor} />
          <Text style={estilos.principalNota}>
            {ahorroKm.toFixed(2)} km y {ahorroMin} minutos menos en cada salida
          </Text>
        </View>

        <Text style={estilos.seccion}>Los tres metodos</Text>

        <View style={estilos.bloque}>
          <Metodo
            nombre="Orden de captura"
            descripcion="Visitar en el orden que se registraron"
            distancia={dMala}
            maximo={dMala}
            color={colores.peligro}
            ajustes={ajustes}
          />

          <Metodo
            nombre="Vecino mas cercano"
            descripcion="Siempre ir al punto mas proximo"
            distancia={dVecino}
            maximo={dMala}
            color={colores.alerta}
            ajustes={ajustes}
          />

          <Metodo
            nombre="Vecino mas cercano + 2-opt"
            descripcion="Deshacer los cruces que quedaron"
            distancia={dFinal}
            maximo={dMala}
            color={colores.exito}
            ajustes={ajustes}
          />
        </View>

        <Text style={estilos.seccion}>Proyeccion de ahorro</Text>

        <View style={estilos.bloque}>
          <Proyeccion etiqueta="A la semana" dias={6} ahorro={ahorroPesos} />
          <Proyeccion etiqueta="Al mes" dias={26} ahorro={ahorroPesos} />
          <Proyeccion etiqueta="Al ano" dias={312} ahorro={ahorroPesos} />
        </View>

        <Text style={estilos.seccion}>Datos del reparto</Text>

        <View style={estilos.bloque}>
          <Renglon etiqueta="Paquetes cargados" valor={String(entregas.length)} />
          <Renglon etiqueta="Carga total" valor={entregas.reduce((s, e) => s + e.peso, 0) + ' kg'} />
          <Renglon etiqueta="Viajes necesarios" valor={String(viajes.length)} />
          <Renglon etiqueta="Distancia final" valor={dFinal.toFixed(2) + ' km'} />
          <Renglon etiqueta="Tiempo estimado" valor={tiempo(mFinal.minutos)} />
          <Renglon etiqueta="Combustible" valor={mFinal.litros.toFixed(2) + ' L'} />
          <Renglon
            etiqueta="Entrega mas lejana"
            valor={masLejana.destinatario + ' (' + masLejana.d.toFixed(1) + ' km)'}
          />
          <Renglon etiqueta="Mejoras del 2-opt" valor={String(r.pasos.length - 1)} />
        </View>

        {ajustes.usarCapacidad && viajes.length > 1 && (
          <View>
            <Text style={estilos.seccion}>Reparto por capacidad</Text>

            <View style={estilos.bloque}>
              {viajes.map((v, i) => {
                const carga = v.reduce((s, p) => s + (p.peso || 0), 0);
                return (
                  <View key={i} style={estilos.viaje}>
                    <View style={estilos.viajeNumero}>
                      <Text style={estilos.viajeNumeroTexto}>{i + 1}</Text>
                    </View>

                    <View style={estilos.viajeTextos}>
                      <Text style={estilos.viajeTitulo}>
                        {v.length - 2} entregas, {carga} kg
                      </Text>
                      <Barra
                        proporcion={carga / ajustes.capacidad}
                        color={carga > ajustes.capacidad * 0.9 ? colores.alerta : colores.primario}
                        grosor={6}
                      />
                    </View>

                    <Text style={estilos.viajeKm}>{distanciaDeRuta(v).toFixed(1)} km</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

function Metodo({ nombre, descripcion, distancia, maximo, color, ajustes }) {
  const m = calcularMetricas(distancia, ajustes);

  return (
    <View style={estilos.metodo}>
      <View style={estilos.metodoEncabezado}>
        <View style={estilos.metodoTextos}>
          <Text style={estilos.metodoNombre}>{nombre}</Text>
          <Text style={estilos.metodoDescripcion}>{descripcion}</Text>
        </View>

        <Text style={[estilos.metodoValor, { color: color }]}>
          {distancia.toFixed(2)} km
        </Text>
      </View>

      <Barra proporcion={distancia / maximo} color={color} grosor={7} />

      <Text style={estilos.metodoPie}>
        {tiempo(m.minutos)} · {moneda(m.costo)} de gasolina
      </Text>
    </View>
  );
}

function Proyeccion({ etiqueta, dias, ahorro }) {
  return (
    <View style={estilos.renglon}>
      <Text style={estilos.renglonEtiqueta}>{etiqueta}</Text>
      <Text style={[estilos.renglonValor, { color: colores.exito }]}>
        {moneda(ahorro * dias)}
      </Text>
    </View>
  );
}

function Renglon({ etiqueta, valor }) {
  return (
    <View style={estilos.renglon}>
      <Text style={estilos.renglonEtiqueta}>{etiqueta}</Text>
      <Text style={estilos.renglonValor}>{valor}</Text>
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
  centrado: {
    flex: 1,
    backgroundColor: colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  vacioTitulo: {
    fontSize: 17,
    fontWeight: '600',
    color: colores.texto,
    marginTop: 14,
  },
  vacioTexto: {
    fontSize: 14,
    color: colores.textoSuave,
    textAlign: 'center',
    marginTop: 6,
  },
  principal: {
    backgroundColor: colores.primario,
    borderRadius: 18,
    padding: 22,
  },
  principalEtiqueta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  principalValor: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 4,
  },
  principalNota: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 4,
  },
  seccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 4,
  },
  bloque: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 16,
    ...sombra,
  },
  metodo: {
    marginBottom: 18,
  },
  metodoEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  metodoTextos: {
    flex: 1,
    marginRight: 10,
  },
  metodoNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  metodoDescripcion: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 1,
  },
  metodoValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metodoPie: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 6,
  },
  renglon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  renglonEtiqueta: {
    fontSize: 13,
    color: colores.textoSuave,
    flex: 1,
  },
  renglonValor: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.texto,
    textAlign: 'right',
  },
  viaje: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  viajeNumero: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viajeNumeroTexto: {
    color: colores.primario,
    fontWeight: 'bold',
    fontSize: 13,
  },
  viajeTextos: {
    flex: 1,
    marginHorizontal: 12,
  },
  viajeTitulo: {
    fontSize: 13,
    color: colores.texto,
    marginBottom: 5,
  },
  viajeKm: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoSuave,
  },
});
