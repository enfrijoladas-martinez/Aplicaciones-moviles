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
        id = Perfil.texto(json, "id_message");
        conversacionId = Perfil.texto(json, "id_conversacion");
        remitenteId = Perfil.texto(json, "id_remitente");
        contenido = Perfil.texto(json, "contenido");
        imagen = Perfil.texto(json, "url_adjunto");
        estado = json.isNull("estado") ? ENVIADO : json.optString("estado", ENVIADO);
        eliminado = json.optBoolean("eliminado", false);
        fecha = Perfil.texto(json, "created_at");

        JSONObject remitente = json.optJSONObject("remitente");
        remitenteNombre = remitente == null
                ? ""
                : Perfil.completo(Perfil.texto(remitente, "nombre"), Perfil.texto(remitente, "apellido"));
    }

    public boolean esMio(String miId) {
        return remitenteId.equals(miId);
    }

    public boolean tieneImagen() {
        return !eliminado && !imagen.isEmpty();
    }
}
