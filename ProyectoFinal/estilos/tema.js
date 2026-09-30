export const colores = {
  fondo: '#F1F5F9',
  superficie: '#FFFFFF',
  primario: '#4F46E5',
  primarioSuave: '#EEF2FF',
  texto: '#0F172A',
  textoSuave: '#64748B',
  borde: '#E2E8F0',
  exito: '#16A34A',
  alerta: '#F59E0B',
  peligro: '#DC2626',
};

export const sombra = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
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
