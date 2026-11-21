package com.example.clonewhatsapp;

import org.json.JSONObject;

public class Perfil {

    public final String id;
    public final String nombre;
    public final String apellido;
    public final String numero;
    public final String avatar;
    public final String ultimaConexion;

    public Perfil(JSONObject json) {
        id = texto(json, "id_profile");
        nombre = texto(json, "nombre");
        apellido = texto(json, "apellido");
        numero = texto(json, "numero");
        avatar = texto(json, "foto_perfil");
        ultimaConexion = texto(json, "ultima_conexion");
    }

    public String nombreCompleto() {
        return completo(nombre, apellido);
    }

    static String completo(String nombre, String apellido) {
        if (apellido.isEmpty() || "Sin apellido".equals(apellido)) {
            return nombre;
        }
        return (nombre + " " + apellido).trim();
    }

    static String texto(JSONObject json, String campo) {
        return json == null || json.isNull(campo) ? "" : json.optString(campo, "");
    }
}
