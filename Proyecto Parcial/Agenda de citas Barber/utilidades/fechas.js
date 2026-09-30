const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function clave(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return fecha.getFullYear() + '-' + mes + '-' + dia;
}

export function hoy() {
  return clave(new Date());
}

export function desplazar(cantidadDias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + cantidadDias);
  return clave(fecha);
}

export function aTexto(valorClave) {
  const partes = valorClave.split('-');
  const fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));

  if (valorClave === hoy()) return 'Hoy';
  if (valorClave === desplazar(1)) return 'Manana';

  return dias[fecha.getDay()] + ' ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()];
}

export function aMinutos(hora) {
  const partes = hora.split(':');
  return Number(partes[0]) * 60 + Number(partes[1]);
}

export function sumarMinutos(hora, minutos) {
  const total = aMinutos(hora) + minutos;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}
