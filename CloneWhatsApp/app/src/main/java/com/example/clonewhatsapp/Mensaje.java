package com.example.clonewhatsapp;

import org.json.JSONObject;

public class Mensaje {

    public static final String ENVIADO = "enviado";
    public static final String RECIBIDO = "recibido";
    public static final String LEIDO = "leido";

    public final String id;
    public final String conversacionId;
    public final String remitenteId;
    public String remitenteNombre;
    public final String contenido;
    public final String imagen;
    public final String estado;
    public final boolean eliminado;
    public final String fecha;

    public Mensaje(JSONObject json) {
        id = json.optString("id");
        conversacionId = Perfil.texto(json, "conversation_id");
        remitenteId = Perfil.texto(json, "sender_id");
        contenido = Perfil.texto(json, "content");
        imagen = Perfil.texto(json, "image_url");
        estado = json.isNull("status") ? ENVIADO : json.optString("status", ENVIADO);
        eliminado = json.optBoolean("deleted", false);
        fecha = Perfil.texto(json, "created_at");

        JSONObject remitente = json.optJSONObject("sender");
        remitenteNombre = remitente == null ? "" : Perfil.texto(remitente, "name");
    }

    public boolean esMio(String miId) {
        return remitenteId.equals(miId);
    }

    public boolean tieneImagen() {
        return !eliminado && !imagen.isEmpty();
    }
}
