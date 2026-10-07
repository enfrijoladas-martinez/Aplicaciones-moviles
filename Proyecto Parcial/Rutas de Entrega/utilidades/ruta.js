import { haversine } from './geo';

export function distanciaDeRuta(orden) {
  let total = 0;

  for (let i = 0; i < orden.length - 1; i++) {
    total += haversine(orden[i], orden[i + 1]);
  }

  return total;
}

export function rutaSinOptimizar(almacen, entregas) {
  return [almacen].concat(entregas).concat([almacen]);
}

export function vecinoMasCercano(almacen, entregas) {
  const pendientes = entregas.slice();
  const orden = [almacen];
  let actual = almacen;

  while (pendientes.length > 0) {
    let mejorIndice = 0;
    let mejorDistancia = haversine(actual, pendientes[0]);

    for (let i = 1; i < pendientes.length; i++) {
      const d = haversine(actual, pendientes[i]);
      if (d < mejorDistancia) {
        mejorDistancia = d;
        mejorIndice = i;
      }
    }

    actual = pendientes[mejorIndice];
    orden.push(actual);
    pendientes.splice(mejorIndice, 1);
  }

  orden.push(almacen);
  return orden;
}

export function dosOpt(rutaInicial) {
  let ruta = rutaInicial.slice();
  const pasos = [{ ruta: ruta.slice(), distancia: distanciaDeRuta(ruta), cambio: null }];

  let mejoro = true;
  let vueltas = 0;

  while (mejoro && vueltas < 60) {
    mejoro = false;
    vueltas++;

    for (let i = 1; i < ruta.length - 2; i++) {
      for (let j = i + 1; j < ruta.length - 1; j++) {
        const actual =
          haversine(ruta[i - 1], ruta[i]) + haversine(ruta[j], ruta[j + 1]);

        const propuesta =
          haversine(ruta[i - 1], ruta[j]) + haversine(ruta[i], ruta[j + 1]);

        if (propuesta < actual - 0.00001) {
          const medio = ruta.slice(i, j + 1).reverse();
          ruta = ruta.slice(0, i).concat(medio).concat(ruta.slice(j + 1));

          pasos.push({
            ruta: ruta.slice(),
            distancia: distanciaDeRuta(ruta),
            cambio: { desde: i, hasta: j },
          });

          mejoro = true;
          break;
        }
      }

      if (mejoro) break;
    }
  }

  return { ruta: ruta, pasos: pasos };
}

export function optimizar(almacen, entregas) {
  if (entregas.length === 0) {
    return { ruta: [almacen], pasos: [], inicial: [almacen] };
  }

  const inicial = vecinoMasCercano(almacen, entregas);
  const resultado = dosOpt(inicial);

  return { ruta: resultado.ruta, pasos: resultado.pasos, inicial: inicial };
}

export function partirPorCapacidad(almacen, orden, capacidad) {
  if (!capacidad || capacidad <= 0) return [orden];

  const viajes = [];
  let actual = [almacen];
  let carga = 0;

  orden.forEach((punto) => {
    if (punto.id === almacen.id) return;

    const peso = punto.peso || 0;

    if (carga + peso > capacidad && actual.length > 1) {
      actual.push(almacen);
      viajes.push(actual);
      actual = [almacen];
      carga = 0;
    }

    actual.push(punto);
    carga += peso;
  });

  if (actual.length > 1) {
    actual.push(almacen);
    viajes.push(actual);
  }

  return viajes;
}

export function calcularMetricas(distancia, ajustes, paradas) {
  const horas = ajustes.velocidad > 0 ? distancia / ajustes.velocidad : 0;
  const litros = ajustes.rendimiento > 0 ? distancia / ajustes.rendimiento : 0;
  const costo = litros * ajustes.precioLitro;
  const servicio = paradas ? paradas * (ajustes.minutosPorEntrega || 0) : 0;

  return {
    distancia: distancia,
    minutos: Math.round(horas * 60) + servicio,
    minutosManejo: Math.round(horas * 60),
    minutosServicio: servicio,
    litros: litros,
    costo: costo,
  };
}

export function horaMas(minutos) {
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() + minutos);

  const h = String(ahora.getHours()).padStart(2, '0');
  const m = String(ahora.getMinutes()).padStart(2, '0');

  return h + ':' + m;
}
