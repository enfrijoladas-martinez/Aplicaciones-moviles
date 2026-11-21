package com.example.clonewhatsapp;

import org.json.JSONObject;

public class Conversacion {

    public final String id;
    public final boolean esGrupo;
    public final String titulo;
    public final String avatar;
    public final String otroId;
    public final String ultimoMensaje;
    public final String ultimoTipo;
    public final String ultimaFecha;
    public final String ultimoRemitente;
    public final int sinLeer;

    public Conversacion(JSONObject json) {
        id = Perfil.texto(json, "id_conversacion");
        esGrupo = "grupal".equals(Perfil.texto(json, "tipo"));
        titulo = esGrupo
                ? Perfil.texto(json, "nombre_grupo")
                : Perfil.completo(Perfil.texto(json, "otro_nombre"), Perfil.texto(json, "otro_apellido"));
        avatar = esGrupo ? Perfil.texto(json, "foto_grupo") : Perfil.texto(json, "otro_foto");
        otroId = Perfil.texto(json, "otro_id");
        ultimoMensaje = Perfil.texto(json, "ultimo_mensaje");
        ultimoTipo = Perfil.texto(json, "ultimo_tipo");
        ultimaFecha = Perfil.texto(json, "ultimo_en");
        ultimoRemitente = Perfil.texto(json, "ultimo_remitente");
        sinLeer = json.optInt("no_leidos", 0);
    }

    public String tituloVisible() {
        if (!titulo.isEmpty()) {
            return titulo;
        }
        return esGrupo ? "Grupo" : "Usuario";
    }

    public String resumen() {
        if (ultimaFecha.isEmpty()) {
            return esGrupo ? "Grupo creado" : "Toca para escribir";
        }

        if ("imagen".equals(ultimoTipo)) {
            return ultimoMensaje.isEmpty() ? "Foto" : "Foto: " + ultimoMensaje;
        }

        return ultimoMensaje.isEmpty() ? "Mensaje eliminado" : ultimoMensaje;
    }
}
