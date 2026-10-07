import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Lienzo from '../componentes/Lienzo';
import ModalResultado from '../componentes/ModalResultado';
import ModalParada from '../componentes/ModalParada';
import { colores, moneda, sombra, tiempo } from '../estilos/tema';
import { crearProyeccion, haversine } from '../utilidades/geo';
import {
  calcularMetricas,
  distanciaDeRuta,
  horaMas,
  optimizar,
  rutaSinOptimizar,
} from '../utilidades/ruta';

const ANCHO = Dimensions.get('window').width - 32;
const ALTO = 330;

export default function RutaScreen({ almacen, entregas, ajustes, alAgregarEnPunto }) {
  const [paso, setPaso] = useState(0);
  const [pasos, setPasos] = useState([]);
  const [optimizada, setOptimizada] = useState(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [simulando, setSimulando] = useState(false);
  const [visitadas, setVisitadas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [parada, setParada] = useState(null);

  const avance = useRef(new Animated.Value(0)).current;
  const temporizador = useRef(null);

  const todos = [almacen].concat(entregas);
  const proyeccion = crearProyeccion(todos, ANCHO, ALTO, 34);
  const planos = proyeccion.puntos;

  const porId = {};
  planos.forEach((p) => {
    porId[p.id] = p;
  });

  const aPlano = (lista) => lista.map((p) => porId[p.id]).filter((p) => p);

  const rutaMala = rutaSinOptimizar(almacen, entregas);
  const distanciaMala = distanciaDeRuta(rutaMala);

  const rutaActual = optimizada && pasos.length > 0 ? pasos[paso].ruta : rutaMala;
  const distanciaActual = optimizada && pasos.length > 0 ? pasos[paso].distancia : distanciaMala;

  const planosRuta = aPlano(rutaActual);
  const metricas = calcularMetricas(distanciaActual, ajustes, entregas.length);

  const datosParada = () => {
    if (!parada) return null;

    const posicion = rutaActual.findIndex((p) => p.id === parada.id);

    if (posicion <= 0) {
      return { esAlmacen: true, indice: 0, total: 0, desdeAnterior: 0, acumulada: 0, llegada: '', otros: [] };
    }

    let acumulada = 0;
    for (let i = 0; i < posicion; i++) {
      acumulada += haversine(rutaActual[i], rutaActual[i + 1]);
    }

    const desdeAnterior = haversine(rutaActual[posicion - 1], rutaActual[posicion]);
    const minutosManejo = ajustes.velocidad > 0 ? (acumulada / ajustes.velocidad) * 60 : 0;
    const minutosServicio = (posicion - 1) * (ajustes.minutosPorEntrega || 0);

    const otros = entregas.filter(
      (e) => e.id !== parada.id && e.destinatario === parada.destinatario
    );

    return {
      esAlmacen: false,
      indice: posicion,
      total: rutaActual.length - 2,
      desdeAnterior: desdeAnterior,
      acumulada: acumulada,
      llegada: horaMas(Math.round(minutosManejo + minutosServicio)),
      otros: otros,
    };
  };

  const info = datosParada();

  const alternarEntregada = (p) => {
    if (visitadas.indexOf(p.id) !== -1) {
      setVisitadas(visitadas.filter((id) => id !== p.id));
    } else {
      setVisitadas(visitadas.concat([p.id]));
    }
    setParada(null);
  };

  useEffect(() => {
    return () => {
      if (temporizador.current) clearInterval(temporizador.current);
    };
  }, []);

  useEffect(() => {
    setOptimizada(false);
    setPasos([]);
    setPaso(0);
    setSimulando(false);
    setVisitadas([]);
  }, [entregas.length, almacen.lat, almacen.lon]);

  const correrOptimizacion = () => {
    if (entregas.length < 2) return;

    const r = optimizar(almacen, entregas);
    setPasos(r.pasos);
    setPaso(0);
    setOptimizada(true);
    setSimulando(false);
    setVisitadas([]);

    setResultado({
      antes: distanciaMala,
      despues: distanciaDeRuta(r.ruta),
      mejoras: r.pasos.length - 1,
      ajustes: ajustes,
    });
  };

  const reproducir = () => {
    if (pasos.length < 2) return;

    setReproduciendo(true);
    setPaso(0);

    let i = 0;
    temporizador.current = setInterval(() => {
      i++;
      if (i >= pasos.length) {
        clearInterval(temporizador.current);
        setReproduciendo(false);
        return;
      }
      setPaso(i);
    }, 900);
  };

  const simular = () => {
    if (planosRuta.length < 2) return;

    setSimulando(true);
    setVisitadas([]);
    avance.setValue(0);

    const paradas = rutaActual;
    let indice = 0;

    const siguiente = () => {
      if (indice >= paradas.length - 1) {
        setSimulando(false);
        return;
      }

      Animated.timing(avance, {
        toValue: indice + 1,
        duration: 850,
        useNativeDriver: true,
      }).start(() => {
        indice++;
        const punto = paradas[indice];
        if (punto && punto.id !== 'almacen') {
          setVisitadas((previas) => previas.concat([punto.id]));
        }
        siguiente();
      });
    };

    siguiente();
  };

  const entradas = planosRuta.map((_, i) => i);
  const camion =
    simulando && planosRuta.length > 1
      ? {
          x: avance.interpolate({
            inputRange: entradas,
            outputRange: planosRuta.map((p) => p.x),
          }),
          y: avance.interpolate({
            inputRange: entradas,
            outputRange: planosRuta.map((p) => p.y),
          }),
        }
      : null;

  const ahorro = distanciaMala > 0 ? ((distanciaMala - distanciaActual) / distanciaMala) * 100 : 0;

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <Lienzo
        ancho={ANCHO}
        alto={ALTO}
        puntos={planos}
        ruta={planosRuta}
        colorRuta={optimizada ? colores.rutaBuena : colores.rutaMala}
        marcarCruces={!optimizada || paso < pasos.length - 1}
        camion={camion}
        visitadas={visitadas}
        alTocar={(x, y) => {
          if (simulando || reproduciendo) return;
          alAgregarEnPunto(proyeccion.aGeo(x, y));
        }}
        alTocarPunto={(p) => {
          const original = todos.find((t) => t.id === p.id);
          if (original) setParada(original);
        }}
      />

      <Text style={estilos.pista}>
        Toca una parada para ver el negocio y sus paquetes
      </Text>

      <View style={estilos.tarjetaDistancia}>
        <View>
          <Text style={estilos.etiquetaDistancia}>
            {optimizada ? 'Ruta optimizada' : 'Orden de captura'}
          </Text>
          <Text style={estilos.valorDistancia}>{distanciaActual.toFixed(2)} km</Text>
        </View>

        {optimizada && (
          <View style={estilos.insignia}>
            <Ionicons name="trending-down" size={15} color={colores.exito} />
            <Text style={estilos.insigniaTexto}>{ahorro.toFixed(1)}% menos</Text>
          </View>
        )}
      </View>

      <View style={estilos.fila}>
        <Dato icono="time-outline" valor={tiempo(metricas.minutos)} etiqueta="Tiempo" />
        <Dato icono="water-outline" valor={metricas.litros.toFixed(2) + ' L'} etiqueta="Gasolina" />
        <Dato icono="cash-outline" valor={moneda(metricas.costo)} etiqueta="Costo" />
      </View>

      <Pressable
        style={[estilos.boton, entregas.length < 2 && estilos.botonInactivo]}
        onPress={correrOptimizacion}
        disabled={entregas.length < 2}
      >
        <Ionicons name="git-network-outline" size={19} color="#FFFFFF" />
        <Text style={estilos.botonTexto}>Optimizar ruta</Text>
      </Pressable>

      {optimizada && pasos.length > 1 && (
        <View style={estilos.bloquePasos}>
          <View style={estilos.encabezadoPasos}>
            <Text style={estilos.tituloPasos}>Algoritmo 2-opt</Text>
            <Text style={estilos.contadorPasos}>
              paso {paso} de {pasos.length - 1}
            </Text>
          </View>

          <Text style={estilos.explicacion}>
            Cada paso toma dos tramos que se cruzan y los invierte. Las lineas rojas son
            cruces que todavia se pueden deshacer.
          </Text>

          <View style={estilos.controles}>
            <Pressable
              style={estilos.botonChico}
              onPress={() => setPaso(Math.max(0, paso - 1))}
              disabled={reproduciendo}
            >
              <Ionicons name="play-back" size={17} color={colores.primario} />
            </Pressable>

            <Pressable style={estilos.botonReproducir} onPress={reproducir} disabled={reproduciendo}>
              <Ionicons name="play" size={16} color="#FFFFFF" />
              <Text style={estilos.botonReproducirTexto}>
                {reproduciendo ? 'Corriendo...' : 'Ver paso a paso'}
              </Text>
            </Pressable>

            <Pressable
              style={estilos.botonChico}
              onPress={() => setPaso(Math.min(pasos.length - 1, paso + 1))}
              disabled={reproduciendo}
            >
              <Ionicons name="play-forward" size={17} color={colores.primario} />
            </Pressable>
          </View>
        </View>
      )}

      {optimizada && (
        <Pressable
          style={[estilos.botonSecundario, simulando && estilos.botonInactivo]}
          onPress={simular}
          disabled={simulando}
        >
          <Ionicons name="navigate-outline" size={18} color={colores.primario} />
          <Text style={estilos.botonSecundarioTexto}>
            {simulando ? 'Repartiendo...' : 'Simular el recorrido'}
          </Text>
        </Pressable>
      )}

      <ModalResultado
        visible={resultado !== null}
        resultado={resultado}
        alCerrar={() => setResultado(null)}
      />

      {info && (
        <ModalParada
          visible={parada !== null}
          parada={parada}
          esAlmacen={info.esAlmacen}
          indice={info.indice}
          total={info.total}
          desdeAnterior={info.desdeAnterior}
          acumulada={info.acumulada}
          llegada={info.llegada}
          otros={info.otros}
          entregado={parada ? visitadas.indexOf(parada.id) !== -1 : false}
          alMarcarEntregado={alternarEntregada}
          alCerrar={() => setParada(null)}
        />
      )}
    </ScrollView>
  );
}

function Dato({ icono, valor, etiqueta }) {
  return (
    <View style={estilos.dato}>
      <Ionicons name={icono} size={17} color={colores.primario} />
      <Text style={estilos.datoValor}>{valor}</Text>
      <Text style={estilos.datoEtiqueta}>{etiqueta}</Text>
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
  pista: {
    fontSize: 11,
    color: colores.textoSuave,
    textAlign: 'center',
    marginTop: 8,
  },
  tarjetaDistancia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    ...sombra,
  },
  etiquetaDistancia: {
    fontSize: 12,
    color: colores.textoSuave,
  },
  valorDistancia: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 2,
  },
  insignia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  insigniaTexto: {
    color: colores.exito,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dato: {
    flex: 1,
    backgroundColor: colores.superficie,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    ...sombra,
  },
  datoValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colores.texto,
    marginTop: 5,
  },
  datoEtiqueta: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 1,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.primario,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 16,
  },
  botonInactivo: {
    opacity: 0.45,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  botonSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.primarioSuave,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  botonSecundarioTexto: {
    color: colores.primario,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bloquePasos: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    ...sombra,
  },
  encabezadoPasos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloPasos: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colores.texto,
  },
  contadorPasos: {
    fontSize: 12,
    color: colores.textoSuave,
  },
  explicacion: {
    fontSize: 12,
    color: colores.textoSuave,
    lineHeight: 18,
    marginTop: 6,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  botonChico: {
    width: 44,
    height: 42,
    borderRadius: 10,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonReproducir: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.primario,
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  botonReproducirTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 7,
  },
});
