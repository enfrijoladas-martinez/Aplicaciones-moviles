export const colores = {
  fondo: '#F6F7F9',
  superficie: '#FFFFFF',
  primario: '#0D9488',
  primarioSuave: '#CCFBF1',
  acento: '#F97316',
  texto: '#111827',
  textoSuave: '#6B7280',
  borde: '#E5E7EB',
  exito: '#059669',
  alerta: '#D97706',
  peligro: '#DC2626',
};

export const sombra = {
  shadowColor: '#111827',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 3,
};

export function moneda(numero) {
  const entero = Math.round(numero);
  const texto = String(Math.abs(entero));
  let salida = '';
  let contador = 0;

  for (let i = texto.length - 1; i >= 0; i--) {
    salida = texto[i] + salida;
    contador++;
    if (contador % 3 === 0 && i > 0) {
      salida = ',' + salida;
    }
  }

  return (entero < 0 ? '-$' : '$') + salida;
}
