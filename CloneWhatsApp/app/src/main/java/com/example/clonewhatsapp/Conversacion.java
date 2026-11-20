package com.example.clonewhatsapp;

import org.json.JSONObject;

public class Conversacion {

    public final String id;
    public final boolean esGrupo;
    public final String titulo;
    public final String avatar;
    public final String otroId;
    public final String ultimoMensaje;
    public final String ultimaFecha;
    public final String ultimoRemitente;
    public final String ultimoEstado;
    public final int sinLeer;

    public Conversacion(JSONObject json) {
        id = json.optString("id");
        esGrupo = json.optBoolean("is_group", false);
        titulo = Perfil.texto(json, "titulo");
        avatar = Perfil.texto(json, "avatar_url");
        otroId = Perfil.texto(json, "otro_id");
        ultimoMensaje = Perfil.texto(json, "ultimo_mensaje");
        ultimaFecha = Perfil.texto(json, "ultima_fecha");
        ultimoRemitente = Perfil.texto(json, "ultimo_remitente");
        ultimoEstado = Perfil.texto(json, "ultimo_estado");
        sinLeer = json.optInt("sin_leer", 0);
    }

    public String tituloVisible() {
        if (!titulo.isEmpty()) {
            return titulo;
        }
        return esGrupo ? "Grupo" : "Usuario";
    }
}
