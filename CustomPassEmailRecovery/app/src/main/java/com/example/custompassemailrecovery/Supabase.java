package com.example.custompassemailrecovery;

import android.os.Handler;
import android.os.Looper;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Supabase {

    public static final String URL_BASE = "https://ypclpjtjhiirunieakuu.supabase.co";
    public static final String ANON_KEY = "sb_publishable_JQFVYKHyIBAtW0Co-s8n-A_cHu38Z55";

    private static final String AUTH = "/auth/v1";

    private static final ExecutorService HILOS = Executors.newFixedThreadPool(4);
    private static final Handler PRINCIPAL = new Handler(Looper.getMainLooper());

    public interface Respuesta<T> {
        void listo(T dato);

        void fallo(String mensaje);
    }

    private interface Trabajo<T> {
        T hacer() throws Exception;
    }

    public static boolean hayCredenciales() {
        return URL_BASE.startsWith("https://")
                && (ANON_KEY.startsWith("eyJ") || ANON_KEY.startsWith("sb_publishable_"));
    }

    public static void registrar(String correo, String contrasena, Respuesta<Sesion> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("email", correo);
            cuerpo.put("password", contrasena);

            String texto = peticion("POST", AUTH + "/signup", cuerpo.toString(), null);
            return Sesion.desdeJson(new JSONObject(texto));
        }, respuesta);
    }

    public static void entrar(String correo, String contrasena, Respuesta<Sesion> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("email", correo);
            cuerpo.put("password", contrasena);

            String texto = peticion("POST",
                    AUTH + "/token?grant_type=password", cuerpo.toString(), null);

            return Sesion.desdeJson(new JSONObject(texto));
        }, respuesta);
    }

    public static void pedirCodigo(String correo, Respuesta<String> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("email", correo);

            peticion("POST", AUTH + "/recover", cuerpo.toString(), null);
            return correo;
        }, respuesta);
    }

    public static void verificarCodigo(String correo, String codigo, Respuesta<Sesion> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("email", correo);
            cuerpo.put("token", codigo);
            cuerpo.put("type", "recovery");

            String texto = peticion("POST", AUTH + "/verify", cuerpo.toString(), null);
            return Sesion.desdeJson(new JSONObject(texto));
        }, respuesta);
    }

    public static void cambiarContrasena(String token, String nueva, Respuesta<String> respuesta) {
        ejecutar(() -> {
            JSONObject cuerpo = new JSONObject();
            cuerpo.put("password", nueva);

            String texto = peticion("PUT", AUTH + "/user", cuerpo.toString(), token);
            JSONObject usuario = new JSONObject(texto);

            return usuario.isNull("email") ? "" : usuario.optString("email");
        }, respuesta);
    }

    public static void salir(String token, Respuesta<String> respuesta) {
        ejecutar(() -> {
            peticion("POST", AUTH + "/logout", "{}", token);
            return "ok";
        }, respuesta);
    }

    private static String peticion(String metodo, String ruta, String cuerpoEnviado, String token)
            throws Exception {
        URL direccion = new URL(URL_BASE + ruta);
        HttpURLConnection conexion = (HttpURLConnection) direccion.openConnection();

        conexion.setRequestMethod(metodo);
        conexion.setConnectTimeout(15000);
        conexion.setReadTimeout(15000);
        conexion.setRequestProperty("apikey", ANON_KEY);
        conexion.setRequestProperty("Accept", "application/json");

        conexion.setRequestProperty("Authorization",
                "Bearer " + (token == null ? ANON_KEY : token));

        if (cuerpoEnviado != null) {
            conexion.setRequestProperty("Content-Type", "application/json");
            conexion.setDoOutput(true);

            OutputStream salida = conexion.getOutputStream();
            salida.write(cuerpoEnviado.getBytes(StandardCharsets.UTF_8));
            salida.flush();
            salida.close();
        }

        int codigo = conexion.getResponseCode();

        InputStream flujo = codigo >= 400
                ? conexion.getErrorStream()
                : conexion.getInputStream();

        String texto = leer(flujo);
        conexion.disconnect();

        if (codigo >= 400) {
            throw new Exception(explicar(codigo, texto));
        }

        return texto;
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

        if (mensaje.contains("User already registered")) {
            return "Ese correo ya tiene una cuenta";
        }

        if (mensaje.contains("Token has expired") || mensaje.contains("invalid")) {
            return "El codigo es incorrecto o ya vencio";
        }

        if (mensaje.contains("Password should be")) {
            return "La contrasena debe tener al menos 6 caracteres";
        }

        if (mensaje.contains("rate limit") || mensaje.contains("Email rate")) {
            return "Demasiados intentos. Espera unos minutos";
        }

        return "HTTP " + codigo + ": " + mensaje;
    }

    private static String leer(InputStream flujo) throws Exception {
        if (flujo == null) {
            return "";
        }

        BufferedReader lector = new BufferedReader(
                new InputStreamReader(flujo, StandardCharsets.UTF_8));

        StringBuilder acumulado = new StringBuilder();
        String linea;

        while ((linea = lector.readLine()) != null) {
            acumulado.append(linea);
        }

        lector.close();
        return acumulado.toString();
    }

    private static <T> void ejecutar(Trabajo<T> trabajo, Respuesta<T> respuesta) {
        HILOS.execute(() -> {
            try {
                T resultado = trabajo.hacer();
                PRINCIPAL.post(() -> respuesta.listo(resultado));
            } catch (Exception error) {
                String mensaje = error.getMessage() == null
                        ? error.toString()
                        : error.getMessage();
                PRINCIPAL.post(() -> respuesta.fallo(mensaje));
            }
        });
    }
}
