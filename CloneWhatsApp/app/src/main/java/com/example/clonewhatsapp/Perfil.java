package com.example.clonewhatsapp;

import org.json.JSONObject;

public class Perfil {

    public final String id;
    public final String nombre;
    public final String correo;
    public final String avatar;
    public final String ultimaConexion;

    public Perfil(String id, String nombre, String correo, String avatar, String ultimaConexion) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.avatar = avatar;
        this.ultimaConexion = ultimaConexion;
    }

    public static Perfil desdeJson(JSONObject json) {
        return new Perfil(
                json.optString("id"),
                texto(json, "name"),
                texto(json, "email"),
                texto(json, "avatar_url"),
                texto(json, "last_seen"));
    }

    static String texto(JSONObject json, String campo) {
        return json.isNull(campo) ? "" : json.optString(campo, "");
    }
}
