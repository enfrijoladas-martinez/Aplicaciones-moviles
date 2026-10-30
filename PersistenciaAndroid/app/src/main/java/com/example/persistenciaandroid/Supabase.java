package com.example.persistenciaandroid;

import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Supabase {

    public static final String URL_BASE = "https://ivfprelaxelnooopjabf.supabase.co";
    public static final String ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZnByZWxheGVsbm9vb3BqYWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNTA2OTksImV4cCI6MjEwODcyNjY5OX0.BBa5DvLfN07EucH2yPQIVflDCaAVBe2St-SCv6HPG1o";

    private static final String TABLA = "/rest/v1/productos";

    private static final ExecutorService HILOS = Executors.newFixedThreadPool(4);
    private static final Handler PRINCIPAL = new Handler(Looper.getMainLooper());

    public interface Respuesta<T> {
        void listo(T dato);

        void fallo(String mensaje);
    }

    private interface Trabajo<T> {
        T hacer() throws Exception;
    }

    public static void contar(Respuesta<Integer> respuesta) {
        ejecutar(() -> {
            String cuerpo = peticion("GET", TABLA + "?select=id", null);
            return new JSONArray(cuerpo).length();
        }, respuesta);
    }

    public static void consultar(Respuesta<List<Producto>> respuesta) {
        ejecutar(() -> {
            String cuerpo = peticion("GET", TABLA + "?select=*&order=id.desc", null);
            JSONArray arreglo = new JSONArray(cuerpo);
            List<Producto> lista = new ArrayList<>();

            for (int i = 0; i < arreglo.length(); i++) {
                lista.add(Producto.desdeJson(arreglo.getJSONObject(i)));
            }

            return lista;
        }, respuesta);
    }

    public static void agregar(String producto, String descripcion, double precio,
                               Respuesta<Producto> respuesta) {
        ejecutar(() -> {
            JSONObject fila = new JSONObject();
            fila.put("producto", producto);
            fila.put("descripcion", descripcion);
            fila.put("precio", precio);

            String cuerpo = peticion("POST", TABLA, fila.toString());
            return Producto.desdeJson(new JSONArray(cuerpo).getJSONObject(0));
        }, respuesta);
    }

    public static void actualizar(int id, String producto, String descripcion, double precio,
                                  Respuesta<Producto> respuesta) {
        ejecutar(() -> {
            JSONObject fila = new JSONObject();
            fila.put("producto", producto);
            fila.put("descripcion", descripcion);
            fila.put("precio", precio);

            String cuerpo = peticion("PATCH", TABLA + "?id=eq." + id, fila.toString());
            return Producto.desdeJson(new JSONArray(cuerpo).getJSONObject(0));
        }, respuesta);
    }

    public static void eliminar(int id, Respuesta<Integer> respuesta) {
        ejecutar(() -> {
            peticion("DELETE", TABLA + "?id=eq." + id, null);
            return id;
        }, respuesta);
    }

    private static String peticion(String metodo, String ruta, String cuerpoEnviado)
            throws Exception {
        URL direccion = new URL(URL_BASE + ruta);
        HttpURLConnection conexion = (HttpURLConnection) direccion.openConnection();

        conexion.setRequestMethod(metodo);
        conexion.setConnectTimeout(15000);
        conexion.setReadTimeout(15000);
        conexion.setRequestProperty("apikey", ANON_KEY);
        conexion.setRequestProperty("Authorization", "Bearer " + ANON_KEY);
        conexion.setRequestProperty("Accept", "application/json");

        if (cuerpoEnviado != null) {
            conexion.setRequestProperty("Content-Type", "application/json");
            conexion.setRequestProperty("Prefer", "return=representation");
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
            throw new Exception("HTTP " + codigo + " " + texto);
        }

        return texto;
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
