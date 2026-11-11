package com.example.custompassemailrecovery;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONObject;

public class Sesion {

    private static final String ARCHIVO = "sesion";

    private final String accessToken;
    private final String refreshToken;
    private final String correo;
    private final String idUsuario;
    private final long venceEn;

    public Sesion(String accessToken, String refreshToken, String correo,
                  String idUsuario, long venceEn) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.correo = correo;
        this.idUsuario = idUsuario;
        this.venceEn = venceEn;
    }

    public static Sesion desdeJson(JSONObject json) {
        JSONObject usuario = json.optJSONObject("user");

        String correo = "";
        String idUsuario = "";

        if (usuario != null) {
            correo = usuario.isNull("email") ? "" : usuario.optString("email");
            idUsuario = usuario.isNull("id") ? "" : usuario.optString("id");
        } else {
            correo = json.isNull("email") ? "" : json.optString("email");
            idUsuario = json.isNull("id") ? "" : json.optString("id");
        }

        return new Sesion(
                json.isNull("access_token") ? "" : json.optString("access_token"),
                json.isNull("refresh_token") ? "" : json.optString("refresh_token"),
                correo,
                idUsuario,
                json.optLong("expires_at", 0));
    }

    public boolean hayToken() {
        return accessToken != null && !accessToken.isEmpty();
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getCorreo() {
        return correo;
    }

    public String getIdUsuario() {
        return idUsuario;
    }

    public String getTokenRecortado() {
        if (accessToken == null || accessToken.length() < 40) {
            return accessToken;
        }
        return accessToken.substring(0, 20) + "..." + accessToken.substring(accessToken.length() - 12);
    }

    public String getPayload() {
        try {
            String[] partes = accessToken.split("\\.");

            if (partes.length < 2) {
                return "";
            }

            byte[] bytes = android.util.Base64.decode(partes[1],
                    android.util.Base64.URL_SAFE | android.util.Base64.NO_PADDING);

            JSONObject json = new JSONObject(new String(bytes, "UTF-8"));
            return json.toString(2);
        } catch (Exception error) {
            return "";
        }
    }

    public void guardar(Context contexto) {
        SharedPreferences.Editor editor = contexto
                .getSharedPreferences(ARCHIVO, Context.MODE_PRIVATE)
                .edit();

        editor.putString("access_token", accessToken);
        editor.putString("refresh_token", refreshToken);
        editor.putString("correo", correo);
        editor.putString("id_usuario", idUsuario);
        editor.putLong("vence_en", venceEn);
        editor.apply();
    }

    public static Sesion recuperar(Context contexto) {
        SharedPreferences preferencias = contexto
                .getSharedPreferences(ARCHIVO, Context.MODE_PRIVATE);

        return new Sesion(
                preferencias.getString("access_token", ""),
                preferencias.getString("refresh_token", ""),
                preferencias.getString("correo", ""),
                preferencias.getString("id_usuario", ""),
                preferencias.getLong("vence_en", 0));
    }

    public static void borrar(Context contexto) {
        contexto.getSharedPreferences(ARCHIVO, Context.MODE_PRIVATE)
                .edit()
                .clear()
                .apply();
    }
}
