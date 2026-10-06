const RADIO_TIERRA = 6371;

function aRadianes(grados) {
  return (grados * Math.PI) / 180;
}

export function haversine(a, b) {
  const dLat = aRadianes(b.lat - a.lat);
  const dLon = aRadianes(b.lon - a.lon);

  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(aRadianes(a.lat)) *
      Math.cos(aRadianes(b.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return RADIO_TIERRA * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function crearProyeccion(puntos, ancho, alto, margen) {
  if (puntos.length === 0) {
    return { puntos: [], aGeo: () => ({ lat: 0, lon: 0 }) };
  }

  const lats = puntos.map((p) => p.lat);
  const lons = puntos.map((p) => p.lon);

  const latMin = Math.min.apply(null, lats);
  const latMax = Math.max.apply(null, lats);
  const lonMin = Math.min.apply(null, lons);
  const lonMax = Math.max.apply(null, lons);

  const rangoLat = latMax - latMin || 0.001;
  const rangoLon = lonMax - lonMin || 0.001;

  const utilAncho = ancho - margen * 2;
  const utilAlto = alto - margen * 2;

  const escala = Math.min(utilAncho / rangoLon, utilAlto / rangoLat);

  const sobranteX = (utilAncho - rangoLon * escala) / 2;
  const sobranteY = (utilAlto - rangoLat * escala) / 2;

  const baseX = margen + sobranteX;
  const baseY = margen + sobranteY;

  const proyectados = puntos.map((p) => ({
    ...p,
    x: baseX + (p.lon - lonMin) * escala,
    y: baseY + (latMax - p.lat) * escala,
  }));

  const aGeo = (x, y) => ({
    lon: lonMin + (x - baseX) / escala,
    lat: latMax - (y - baseY) / escala,
  });

  return { puntos: proyectados, aGeo: aGeo };
}

export function seCruzan(a, b, c, d) {
  const orientacion = (p, q, r) => {
    const valor = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (Math.abs(valor) < 0.0001) return 0;
    return valor > 0 ? 1 : 2;
  };

  const o1 = orientacion(a, b, c);
  const o2 = orientacion(a, b, d);
  const o3 = orientacion(c, d, a);
  const o4 = orientacion(c, d, b);

  return o1 !== o2 && o3 !== o4;
}

export function anguloEntre(a, b) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

export function largoEntre(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
