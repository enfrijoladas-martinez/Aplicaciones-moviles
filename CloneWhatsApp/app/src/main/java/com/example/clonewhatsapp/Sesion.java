package com.example.clonewhatsapp;

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
        JSONObject fuente = usuario != null ? usuario : json;

        String correo = fuente.isNull("email") ? "" : fuente.optString("email");
        String idUsuario = fuente.isNull("id") ? "" : fuente.optString("id");

        long vence = json.optLong("expires_at", 0);

        if (vence == 0 && json.has("expires_in")) {
            vence = System.currentTimeMillis() / 1000 + json.optLong("expires_in");
        }

        return new Sesion(
                json.isNull("access_token") ? "" : json.optString("access_token"),
                json.isNull("refresh_token") ? "" : json.optString("refresh_token"),
                correo,
                idUsuario,
                vence);
    }

    public boolean hayToken() {
        return accessToken != null && !accessToken.isEmpty();
    }

    public boolean vencida() {
        return venceEn > 0 && venceEn - 60 < System.currentTimeMillis() / 1000;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getCorreo() {
        return correo;
    }

    public String getIdUsuario() {
        return idUsuario;
    }

    public void guardar(Context contexto) {
        SharedPreferences.Editor editor = contexto
                .getSharedPreferences(ARCHIVO, Context.MODE_PRIVATE)
                .edit();

        editor.putString("access_token", Cifrado.cifrar(accessToken));
        editor.putString("refresh_token", Cifrado.cifrar(refreshToken));
        editor.putString("correo", correo);
        editor.putString("id_usuario", idUsuario);
        editor.putLong("vence_en", venceEn);
        editor.apply();
    }

    public static Sesion recuperar(Context contexto) {
        SharedPreferences preferencias = contexto
                .getSharedPreferences(ARCHIVO, Context.MODE_PRIVATE);

        return new Sesion(
                Cifrado.descifrar(preferencias.getString("access_token", "")),
                Cifrado.descifrar(preferencias.getString("refresh_token", "")),
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
