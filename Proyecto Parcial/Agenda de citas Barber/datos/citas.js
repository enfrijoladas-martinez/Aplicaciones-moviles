import { desplazar, hoy } from '../utilidades/fechas';

export const citasIniciales = [
  { id: 'a1', clienteId: 'c1', servicioId: 's1', fecha: hoy(), hora: '10:00', estado: 'completada' },
  { id: 'a2', clienteId: 'c2', servicioId: 's2', fecha: hoy(), hora: '11:30', estado: 'completada' },
  { id: 'a3', clienteId: 'c3', servicioId: 's3', fecha: hoy(), hora: '13:00', estado: 'pendiente' },
  { id: 'a4', clienteId: 'c4', servicioId: 's1', fecha: hoy(), hora: '16:00', estado: 'pendiente' },
  { id: 'a5', clienteId: 'c5', servicioId: 's5', fecha: hoy(), hora: '17:30', estado: 'pendiente' },
  { id: 'a6', clienteId: 'c6', servicioId: 's2', fecha: desplazar(1), hora: '09:30', estado: 'pendiente' },
  { id: 'a7', clienteId: 'c1', servicioId: 's4', fecha: desplazar(1), hora: '12:00', estado: 'pendiente' },
  { id: 'a8', clienteId: 'c3', servicioId: 's6', fecha: desplazar(2), hora: '10:30', estado: 'pendiente' },
  { id: 'a9', clienteId: 'c2', servicioId: 's1', fecha: desplazar(3), hora: '15:00', estado: 'pendiente' },
  { id: 'a10', clienteId: 'c5', servicioId: 's3', fecha: desplazar(-1), hora: '11:00', estado: 'completada' },
  { id: 'a11', clienteId: 'c4', servicioId: 's2', fecha: desplazar(-1), hora: '14:30', estado: 'completada' },
  { id: 'a12', clienteId: 'c6', servicioId: 's1', fecha: desplazar(-2), hora: '16:30', estado: 'cancelada' },
  { id: 'a13', clienteId: 'c1', servicioId: 's5', fecha: desplazar(-3), hora: '10:00', estado: 'completada' },
  { id: 'a14', clienteId: 'c3', servicioId: 's1', fecha: desplazar(-4), hora: '13:30', estado: 'completada' },
];
