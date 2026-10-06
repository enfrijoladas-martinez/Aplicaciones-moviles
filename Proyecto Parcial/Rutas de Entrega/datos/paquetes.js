export const zonas = ['Centro', 'Norte', 'Sur', 'Playa', 'Mandinga'];

export const coloresZona = {
  Centro: '#2563EB',
  Norte: '#7C3AED',
  Sur: '#0D9488',
  Playa: '#EA580C',
  Mandinga: '#BE123C',
};

export const paquetesIniciales = [
  { id: 'p01', sucursalId: 'c1', guia: 'VZ-10041', destinatario: 'Abarrotes La Esquina', direccion: 'Independencia 450', zona: 'Centro', lat: 19.1902, lon: -96.143, peso: 18, prioridad: 'normal' },
  { id: 'p02', sucursalId: 'c1', guia: 'VZ-10042', destinatario: 'Farmacia del Puerto', direccion: 'Costa de Oro 118', zona: 'Playa', lat: 19.1608, lon: -96.1189, peso: 7, prioridad: 'alta' },
  { id: 'p03', sucursalId: 'c1', guia: 'VZ-10043', destinatario: 'Papeleria Escolar', direccion: 'Av. Cuauhtemoc 76', zona: 'Norte', lat: 19.2041, lon: -96.1352, peso: 12, prioridad: 'baja' },
  { id: 'p04', sucursalId: 'c1', guia: 'VZ-10044', destinatario: 'Ferreteria Hidalgo', direccion: 'Prolongacion Hidalgo 1240', zona: 'Norte', lat: 19.2118, lon: -96.1489, peso: 45, prioridad: 'normal' },
  { id: 'p05', sucursalId: 'c1', guia: 'VZ-10045', destinatario: 'Hotel Playa Norte', direccion: 'Blvd. Avila Camacho 320', zona: 'Playa', lat: 19.1819, lon: -96.1163, peso: 15, prioridad: 'alta' },
  { id: 'p06', sucursalId: 'c1', guia: 'VZ-10046', destinatario: 'Cafeteria Los Portales', direccion: 'Zamora 55, Centro', zona: 'Centro', lat: 19.1954, lon: -96.1372, peso: 9, prioridad: 'normal' },
  { id: 'p07', sucursalId: 'c1', guia: 'VZ-10047', destinatario: 'Taller Diaz Miron', direccion: 'Diaz Miron 1890', zona: 'Centro', lat: 19.1866, lon: -96.1528, peso: 62, prioridad: 'baja' },
  { id: 'p08', sucursalId: 'c1', guia: 'VZ-10048', destinatario: 'Escuela Primaria Juarez', direccion: 'Av. Circunvalacion 210', zona: 'Norte', lat: 19.2195, lon: -96.1398, peso: 24, prioridad: 'normal' },
  { id: 'p09', sucursalId: 'c1', guia: 'VZ-10049', destinatario: 'Mariscos El Faro', direccion: 'Blvd. Costero 77', zona: 'Playa', lat: 19.1735, lon: -96.1091, peso: 31, prioridad: 'normal' },

  { id: 'p10', sucursalId: 'c2', guia: 'BR-20081', destinatario: 'Restaurante El Muelle', direccion: 'Blvd. Ruiz Cortines 890', zona: 'Sur', lat: 19.1361, lon: -96.1067, peso: 32, prioridad: 'normal' },
  { id: 'p11', sucursalId: 'c2', guia: 'BR-20082', destinatario: 'Tienda Mandinga', direccion: 'Carretera Mandinga km 4', zona: 'Mandinga', lat: 19.1245, lon: -96.0954, peso: 23, prioridad: 'baja' },
  { id: 'p12', sucursalId: 'c2', guia: 'BR-20083', destinatario: 'Plaza Sol Local 14', direccion: 'Av. Los Rios 1200', zona: 'Sur', lat: 19.1412, lon: -96.1185, peso: 11, prioridad: 'alta' },
  { id: 'p13', sucursalId: 'c2', guia: 'BR-20084', destinatario: 'Clinica Santa Fe', direccion: 'Jacarandas 340', zona: 'Sur', lat: 19.1298, lon: -96.1222, peso: 6, prioridad: 'alta' },
  { id: 'p14', sucursalId: 'c2', guia: 'BR-20085', destinatario: 'Vivero La Antigua', direccion: 'Camino a Mandinga 820', zona: 'Mandinga', lat: 19.1102, lon: -96.0881, peso: 54, prioridad: 'baja' },
  { id: 'p15', sucursalId: 'c2', guia: 'BR-20086', destinatario: 'Gimnasio Olimpo', direccion: 'Av. Ejercito Mexicano 55', zona: 'Sur', lat: 19.1455, lon: -96.1134, peso: 38, prioridad: 'normal' },
  { id: 'p16', sucursalId: 'c2', guia: 'BR-20087', destinatario: 'Hotel Mocambo', direccion: 'Calzada Ruiz Cortines 4000', zona: 'Playa', lat: 19.1522, lon: -96.0999, peso: 19, prioridad: 'normal' },
  { id: 'p17', sucursalId: 'c2', guia: 'BR-20088', destinatario: 'Pescaderia La Boca', direccion: 'Malecon de Boca 12', zona: 'Mandinga', lat: 19.1189, lon: -96.1043, peso: 27, prioridad: 'alta' },

  { id: 'p18', sucursalId: 'c3', guia: 'LV-30011', destinatario: 'Mini Super Las Vegas', direccion: 'Calle 12 num. 55', zona: 'Centro', lat: 19.1455, lon: -96.1398, peso: 28, prioridad: 'normal' },
  { id: 'p19', sucursalId: 'c3', guia: 'LV-30012', destinatario: 'Lavanderia Express', direccion: 'Av. Lafragua 230', zona: 'Centro', lat: 19.1712, lon: -96.1461, peso: 8, prioridad: 'baja' },
  { id: 'p20', sucursalId: 'c3', guia: 'LV-30013', destinatario: 'Panaderia San Jose', direccion: 'Calle 5 num. 310', zona: 'Norte', lat: 19.1888, lon: -96.1289, peso: 14, prioridad: 'normal' },
  { id: 'p21', sucursalId: 'c3', guia: 'LV-30014', destinatario: 'Refaccionaria Centro', direccion: 'Av. Cuauhtemoc 980', zona: 'Norte', lat: 19.1801, lon: -96.1372, peso: 71, prioridad: 'normal' },
  { id: 'p22', sucursalId: 'c3', guia: 'LV-30015', destinatario: 'Veterinaria Patitas', direccion: 'Bolivar 44', zona: 'Sur', lat: 19.1544, lon: -96.1256, peso: 5, prioridad: 'alta' },
];
