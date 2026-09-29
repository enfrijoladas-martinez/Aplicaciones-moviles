// Unica linea que hay que cambiar cuando la URL del servidor cambia.
//
// - Celular en la misma WiFi que la compu:  http://TU_IP_LOCAL:4000
//   (saca tu IP con  ipconfig  en Windows, es la IPv4 de tu adaptador WiFi)
// - Con tunel de ngrok:                     https://loquesea.ngrok-free.dev
//
// OJO: no sirve localhost, porque para el celular "localhost" es el celular mismo.
export const API_URL = 'http://192.168.1.47:4000';

// ngrok gratis mete una pagina de advertencia antes de responder.
// Este header la brinca. Con IP local no estorba.
export const HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};
