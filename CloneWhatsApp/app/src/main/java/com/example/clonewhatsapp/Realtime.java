package com.example.clonewhatsapp;

import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

public class Realtime {

    public interface Oyente {
        void cambio(String tipo, JSONObject registro);

        void difusion(String evento, JSONObject datos);
    }

    private static final long LATIDO = 25000;
    private static final long REINTENTO = 4000;

    private final String tema;
    private final String filtro;
    private final Oyente oyente;
    private final Handler principal = new Handler(Looper.getMainLooper());

    private WebSocket socket;
    private boolean cerrado = false;
    private boolean unido = false;
    private int referencia = 0;

    private final Runnable latido = new Runnable() {
        @Override
        public void run() {
            mandar("phoenix", "heartbeat", new JSONObject());
            principal.postDelayed(this, LATIDO);
        }
    };

    public Realtime(String canal, String filtro, Oyente oyente) {
        this.tema = "realtime:" + canal;
        this.filtro = filtro;
        this.oyente = oyente;
    }

    public void conectar() {
        cerrado = false;

        Supabase.ejecutar(Supabase::token, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String token) {
                if (!cerrado) {
                    abrir(token);
                }
            }

            @Override
            public void fallo(String mensaje) {
                reintentar();
            }
        });
    }

    private void abrir(String token) {
        String url = Supabase.URL_BASE.replace("https://", "wss://")
                + "/realtime/v1/websocket?apikey=" + Supabase.LLAVE + "&vsn=1.0.0";

        Request pedido = new Request.Builder().url(url).build();

        socket = Supabase.cliente().newWebSocket(pedido, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                unirse(token);
                principal.removeCallbacks(latido);
                principal.postDelayed(latido, LATIDO);
            }

            @Override
            public void onMessage(WebSocket webSocket, String texto) {
                recibir(texto);
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable error, Response response) {
                unido = false;
                principal.removeCallbacks(latido);
                reintentar();
            }

            @Override
            public void onClosed(WebSocket webSocket, int codigo, String razon) {
                unido = false;
                principal.removeCallbacks(latido);
            }
        });
    }

    private void unirse(String token) {
        try {
            JSONObject cambios = new JSONObject();
            cambios.put("event", "*");
            cambios.put("schema", "public");
            cambios.put("table", "messages");

            if (filtro != null) {
                cambios.put("filter", filtro);
            }

            JSONObject difusion = new JSONObject();
            difusion.put("self", false);
            difusion.put("ack", false);

            JSONObject presencia = new JSONObject();
            presencia.put("key", "");

            JSONObject config = new JSONObject();
            config.put("broadcast", difusion);
            config.put("presence", presencia);
            config.put("postgres_changes", new JSONArray().put(cambios));
            config.put("private", false);

            JSONObject carga = new JSONObject();
            carga.put("config", config);
            carga.put("access_token", token);

            mandar(tema, "phx_join", carga);
            unido = true;
        } catch (Exception ignorado) {
            unido = false;
        }
    }

    private void recibir(String texto) {
        try {
            JSONObject mensaje = new JSONObject(texto);
            String evento = mensaje.optString("event");
            JSONObject carga = mensaje.optJSONObject("payload");

            if (carga == null || !tema.equals(mensaje.optString("topic"))) {
                return;
            }

            if ("postgres_changes".equals(evento)) {
                JSONObject datos = carga.optJSONObject("data");

                if (datos == null) {
                    return;
                }

                String tipo = datos.optString("type");
                JSONObject registro = datos.optJSONObject("record");

                if (registro != null) {
                    principal.post(() -> oyente.cambio(tipo, registro));
                }
                return;
            }

            if ("broadcast".equals(evento)) {
                String nombre = carga.optString("event");
                JSONObject datos = carga.optJSONObject("payload");

                principal.post(() -> oyente.difusion(nombre,
                        datos == null ? new JSONObject() : datos));
            }
        } catch (Exception ignorado) {
        }
    }

    public void difundir(String evento, JSONObject datos) {
        if (!unido) {
            return;
        }

        try {
            JSONObject carga = new JSONObject();
            carga.put("type", "broadcast");
            carga.put("event", evento);
            carga.put("payload", datos);

            mandar(tema, "broadcast", carga);
        } catch (Exception ignorado) {
        }
    }

    private void mandar(String destino, String evento, JSONObject carga) {
        if (socket == null) {
            return;
        }

        try {
            referencia++;

            JSONObject mensaje = new JSONObject();
            mensaje.put("topic", destino);
            mensaje.put("event", evento);
            mensaje.put("payload", carga);
            mensaje.put("ref", String.valueOf(referencia));

            if ("phx_join".equals(evento)) {
                mensaje.put("join_ref", String.valueOf(referencia));
            }

            socket.send(mensaje.toString());
        } catch (Exception ignorado) {
        }
    }

    private void reintentar() {
        if (cerrado) {
            return;
        }

        principal.postDelayed(() -> {
            if (!cerrado) {
                conectar();
            }
        }, REINTENTO);
    }

    public void cerrar() {
        cerrado = true;
        unido = false;
        principal.removeCallbacksAndMessages(null);

        if (socket != null) {
            mandar(tema, "phx_leave", new JSONObject());
            socket.close(1000, "fin");
            socket = null;
        }
    }
}
