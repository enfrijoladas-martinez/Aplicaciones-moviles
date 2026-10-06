export const colores = {
  fondo: '#F3F5F9',
  superficie: '#FFFFFF',
  primario: '#1D4ED8',
  primarioSuave: '#DBEAFE',
  acento: '#F97316',
  texto: '#0F172A',
  textoSuave: '#64748B',
  borde: '#E2E8F0',
  exito: '#16A34A',
  alerta: '#D97706',
  peligro: '#DC2626',
  lienzo: '#0F172A',
  rejilla: 'rgba(148, 163, 184, 0.16)',
  rutaMala: '#EF4444',
  rutaBuena: '#22C55E',
  almacen: '#F97316',
  parada: '#60A5FA',
};

export const sombra = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 3,
};

export function moneda(numero) {
  const partes = Math.abs(numero).toFixed(2).split('.');
  let entero = '';
  let contador = 0;

  for (let i = partes[0].length - 1; i >= 0; i--) {
    entero = partes[0][i] + entero;
    contador++;
    if (contador % 3 === 0 && i > 0) entero = ',' + entero;
  }

  return (numero < 0 ? '-$' : '$') + entero + '.' + partes[1];
}

export function tiempo(minutos) {
  const h = Math.floor(minutos / 60);
  const m = Math.round(minutos % 60);
  if (h === 0) return m + ' min';
  return h + ' h ' + m + ' min';
}
