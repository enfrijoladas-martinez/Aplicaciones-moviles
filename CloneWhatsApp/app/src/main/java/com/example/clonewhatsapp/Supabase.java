package com.example.clonewhatsapp;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URLEncoder;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class Supabase {

    public static final String URL_BASE = BuildConfig.SUPABASE_URL;
    public static final String LLAVE = BuildConfig.SUPABASE_KEY;

    private static final String AUTH = "/auth/v1";
    private static final String REST = "/rest/v1";
    private static final String STORAGE = "/storage/v1/object";

    private static final ExecutorService HILOS = Executors.newFixedThreadPool(4);
    private static final Handler PRINCIPAL = new Handler(Looper.getMainLooper());
    private static final Object CANDADO = new Object();

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private static final MediaType JPEG = MediaType.get("image/jpeg");

    private static final OkHttpClient CLIENTE = new OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(25, TimeUnit.SECONDS)
            .writeTimeout(25, TimeUnit.SECONDS)
            .build();

    public static final String SESION_VENCIDA = "Tu sesion vencio, vuelve a iniciar sesion";

    public interface Respuesta<T> {
        void listo(T dato);

        void fallo(String mensaje);
    }

    public interface Trabajo<T> {
        T hacer() throws Exception;
    }

    public static class ErrorHttp extends Exception {
        public final int codigo;

        ErrorHttp(int codigo, String mensaje) {
            super(mensaje);
            this.codigo = codigo;
        }
    }

    public static boolean hayCredenciales() {
        return URL_BASE.startsWith("https://")
                && (LLAVE.startsWith("eyJ") || LLAVE.startsWith("sb_publishable_"));
    }

    public static void registrar(String nombre, String apellido, String correo, String contrasena,
                                 Respuesta<Sesion> respuesta) {
        ejecutar(() -> {
            JSONObject datos = new JSONObject();
            datos.put("nombre", nombre);
            datos.put("apellido", apellido);

            JSONObject cuerpo = new JSONObject();
            cuerpo.put("email", correo);
            cuerpo.put("password", contrasena);
            cuerpo.put("data", datos);

            String texto = peticion("POST", AUTH + "/signup", cuerpo.toString(), null, null);
            return Sesion.desdeJson(new JSONObject(texto));
        }, respuesta);
    }

    public static void entrar(String correo, String contrasena, Respuesta<Sesion> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("email", correo);
            cuerpo.put("password", contrasena);

            String texto = peticion("POST",
                    AUTH + "/token?grant_type=password", cuerpo.toString(), null, null);

            return Sesion.desdeJson(new JSONObject(texto));
        }, respuesta);
    }

    public static void pedirCodigo(String correo, Respuesta<String> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("email", correo);

            peticion("POST", AUTH + "/recover", cuerpo.toString(), null, null);
            return correo;
        }, respuesta);
    }

    public static void verificarCodigo(String correo, String codigo, Respuesta<Sesion> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("email", correo);
            cuerpo.put("token", codigo);
            cuerpo.put("type", "recovery");

            String texto = peticion("POST", AUTH + "/verify", cuerpo.toString(), null, null);
            return Sesion.desdeJson(new JSONObject(texto));
        }, respuesta);
    }

    public static void cambiarContrasena(String token, String nueva, Respuesta<String> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("password", nueva);

            peticion("PUT", AUTH + "/user", cuerpo.toString(), token, null);
            return "ok";
        }, respuesta);
    }

    public static void salir(Context contexto, Respuesta<String> respuesta) {
        Sesion sesion = Sesion.recuperar(contexto);

        ejecutar(() -> {
            try {
                peticion("POST", AUTH + "/logout", "{}", sesion.getAccessToken(), null);
            } catch (Exception ignorado) {
                return "ok";
            }
            return "ok";
        }, respuesta);
    }

    public static String token() throws Exception {
        synchronized (CANDADO) {
            Context contexto = App.contexto();
            Sesion sesion = Sesion.recuperar(contexto);

            if (!sesion.hayToken()) {
                throw new Exception(SESION_VENCIDA);
            }

            if (!sesion.vencida()) {
                return sesion.getAccessToken();
            }

            JSONObject cuerpo = new JSONObject();
            cuerpo.put("refresh_token", sesion.getRefreshToken());

            try {
                String texto = peticion("POST", AUTH + "/token?grant_type=refresh_token",
                        cuerpo.toString(), null, null);

                Sesion nueva = Sesion.desdeJson(new JSONObject(texto));
                nueva.guardar(contexto);
                return nueva.getAccessToken();
            } catch (ErrorHttp error) {
                Sesion.borrar(contexto);
                throw new Exception(SESION_VENCIDA);
            }
        }
    }

    public static String miId() {
        return Sesion.recuperar(App.contexto()).getIdUsuario();
    }

    public static String codificar(String texto) {
        try {
            return URLEncoder.encode(texto, "UTF-8").replace("+", "%20");
        } catch (Exception error) {
            return texto;
        }
    }

    public static JSONArray consultar(String ruta) throws Exception {
        String texto = peticion("GET", REST + ruta, null, token(), null);
        return new JSONArray(texto.isEmpty() ? "[]" : texto);
    }

    public static JSONObject insertar(String tabla, JSONObject fila) throws Exception {
        String texto = peticion("POST", REST + "/" + tabla, fila.toString(), token(),
                "return=representation");
        JSONArray filas = new JSONArray(texto);
        return filas.length() > 0 ? filas.getJSONObject(0) : fila;
    }

    public static JSONArray actualizar(String ruta, JSONObject cambios) throws Exception {
        String texto = peticion("PATCH", REST + ruta, cambios.toString(), token(),
                "return=representation");
        return new JSONArray(texto.isEmpty() ? "[]" : texto);
    }

    public static String rpc(String funcion, JSONObject argumentos) throws Exception {
        return peticion("POST", REST + "/rpc/" + funcion,
                argumentos == null ? "{}" : argumentos.toString(), token(), null);
    }

    public static String subirImagen(String cubeta, String ruta, byte[] datos) throws Exception {
        Request.Builder pedido = base(URL_BASE + STORAGE + "/" + cubeta + "/" + ruta, token())
                .post(RequestBody.create(datos, JPEG));

        enviar(pedido.build());

        return URL_BASE + STORAGE + "/public/" + cubeta + "/" + ruta;
    }

    public static OkHttpClient cliente() {
        return CLIENTE;
    }

    private static Request.Builder base(String url, String token) {
        return new Request.Builder()
                .url(url)
                .header("apikey", LLAVE)
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + (token == null ? LLAVE : token));
    }

    private static String peticion(String metodo, String ruta, String cuerpo, String token,
                                   String prefer) throws Exception {
        Request.Builder pedido = base(URL_BASE + ruta, token);

        if (prefer != null) {
            pedido.header("Prefer", prefer);
        }

        RequestBody contenido = cuerpo == null ? null : RequestBody.create(cuerpo, JSON);
        pedido.method(metodo, contenido);

        return enviar(pedido.build());
    }

    private static String enviar(Request pedido) throws Exception {
        try (Response respuesta = CLIENTE.newCall(pedido).execute()) {
            ResponseBody cuerpo = respuesta.body();
            String texto = cuerpo == null ? "" : cuerpo.string();

            if (!respuesta.isSuccessful()) {
                throw new ErrorHttp(respuesta.code(), explicar(respuesta.code(), texto));
            }

            return texto;
        } catch (java.io.IOException error) {
            throw new Exception("Sin conexion a internet");
        }
    }

    private static String explicar(int codigo, String texto) {
        String mensaje = texto;

        try {
            JSONObject json = new JSONObject(texto);

            if (!json.isNull("error_description")) {
                mensaje = json.optString("error_description");
            } else if (!json.isNull("msg")) {
                mensaje = json.optString("msg");
            } else if (!json.isNull("message")) {
                mensaje = json.optString("message");
            } else if (!json.isNull("error")) {
                mensaje = json.optString("error");
            }
        } catch (Exception ignorado) {
            mensaje = texto;
        }

        if (mensaje.contains("Invalid login credentials")) {
            return "Correo o contrasena incorrectos";
        }

        if (mensaje.contains("Email not confirmed")) {
            return "Primero confirma tu correo con el enlace que te enviamos";
        }

        if (mensaje.contains("User already registered")) {
            return "Ese correo ya tiene una cuenta";
        }

        if (mensaje.contains("Token has expired") || mensaje.contains("otp")) {
            return "El codigo es incorrecto o ya vencio";
        }

        if (mensaje.contains("JWT expired")) {
            return SESION_VENCIDA;
        }

        if (mensaje.contains("Password should be")) {
            return "La contrasena debe tener al menos 6 caracteres";
        }

        if (mensaje.contains("rate limit") || mensaje.contains("Email rate")) {
            return "Demasiados intentos. Espera unos minutos";
        }

        if (mensaje.contains("row-level security") || codigo == 403) {
            return "No tienes permiso para hacer eso";
        }

        return "HTTP " + codigo + ": " + mensaje;
    }

    public static <T> void ejecutar(Trabajo<T> trabajo, Respuesta<T> respuesta) {
        HILOS.execute(() -> {
            try {
                T resultado = trabajo.hacer();
                PRINCIPAL.post(() -> respuesta.listo(resultado));
            } catch (Exception error) {
                String mensaje = error.getMessage() == null
                        ? "Sin conexion a internet"
                        : error.getMessage();
                PRINCIPAL.post(() -> respuesta.fallo(mensaje));
            }
        });
    }
}
