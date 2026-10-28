import { Platform, StatusBar as BarraNativa, StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  encabezado: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : (BarraNativa.currentHeight ?? 24) + 16,
    paddingBottom: 18,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  estadoTexto: {
    flex: 1,
  },
  estadoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  estadoDetalle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  reintentar: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  pestanas: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 4,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 10,
  },
  pestana: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  pestanaActiva: {
    backgroundColor: '#1D4ED8',
  },
  pestanaTexto: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pestanaTextoActivo: {
    color: '#FFFFFF',
  },
  cuerpo: {
    flex: 1,
  },
  contenido: {
    padding: 16,
    paddingBottom: 40,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  tarjetaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  tarjetaNota: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  etiqueta: {
    color: '#475569',
    fontSize: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  campo: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  campoLargo: {
    height: 72,
    textAlignVertical: 'top',
  },
  botones: {
    flexDirection: 'row',
    marginTop: 16,
  },
  boton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonPrincipal: {
    backgroundColor: '#1D4ED8',
  },
  botonVerde: {
    backgroundColor: '#16A34A',
  },
  botonRojo: {
    backgroundColor: '#DC2626',
  },
  botonGris: {
    backgroundColor: '#64748B',
    marginLeft: 10,
  },
  botonApagado: {
    opacity: 0.5,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  encabezadoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
  },
  contador: {
    backgroundColor: '#1D4ED8',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  spinner: {
    marginVertical: 20,
  },
  vacio: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 24,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  filaElegida: {
    borderWidth: 2,
    borderColor: '#1D4ED8',
  },
  filaTexto: {
    flex: 1,
    paddingRight: 10,
  },
  filaNombre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  filaDescripcion: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  filaPrecio: {
    color: '#16A34A',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6,
  },
  filaFecha: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#DC2626',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  identificador: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
