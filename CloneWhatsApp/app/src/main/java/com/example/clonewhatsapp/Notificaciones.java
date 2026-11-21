package com.example.clonewhatsapp;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.firebase.messaging.FirebaseMessaging;

import org.json.JSONObject;

import java.util.Map;

public class Notificaciones {

    public static final String CANAL_MENSAJES = "mensajes";

    public static void crearCanales(Context contexto) {
        NotificationChannel canal = new NotificationChannel(CANAL_MENSAJES, "Mensajes",
                NotificationManager.IMPORTANCE_HIGH);
        canal.setDescription("Avisos de mensajes nuevos en tus chats");
        canal.enableVibration(true);

        contexto.getSystemService(NotificationManager.class).createNotificationChannel(canal);
    }

    public static void registrarToken() {
        if (!Sesion.recuperar(App.contexto()).hayToken()) {
            return;
        }

        FirebaseMessaging.getInstance().getToken().addOnSuccessListener(Notificaciones::guardarToken);
    }

    public static void guardarToken(String token) {
        if (token == null || token.isEmpty() || !Sesion.recuperar(App.contexto()).hayToken()) {
            return;
        }

        Supabase.ejecutar(() -> {
            JSONObject argumentos = new JSONObject();
            argumentos.put("token", token);
            argumentos.put("nombre", Build.MANUFACTURER + " " + Build.MODEL);
            argumentos.put("modelo_equipo", Build.MODEL);
            return Supabase.rpc("registrar_dispositivo", argumentos);
        }, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String dato) {
            }

            @Override
            public void fallo(String mensaje) {
            }
        });
    }

    public static void quitarToken(Runnable despues) {
        FirebaseMessaging.getInstance().getToken()
                .addOnSuccessListener(token -> Supabase.ejecutar(() -> {
                    JSONObject argumentos = new JSONObject();
                    argumentos.put("token", token);
                    return Supabase.rpc("quitar_dispositivo", argumentos);
                }, new Supabase.Respuesta<String>() {
                    @Override
                    public void listo(String dato) {
                        despues.run();
                    }

                    @Override
                    public void fallo(String mensaje) {
                        despues.run();
                    }
                }))
                .addOnFailureListener(error -> despues.run());
    }

    public static void mostrarMensaje(Context contexto, Map<String, String> datos) {
        String conversacion = datos.get("id_conversacion");

        if (conversacion == null || conversacion.equals(ChatActivity.abierta)) {
            return;
        }

        String titulo = datos.containsKey("titulo") ? datos.get("titulo") : "Mensaje nuevo";
        String cuerpo = datos.containsKey("cuerpo") ? datos.get("cuerpo") : "";

        Intent lista = new Intent(contexto, MainActivity.class);

        Intent chat = new Intent(contexto, ChatActivity.class);
        chat.putExtra(ChatActivity.ID, conversacion);
        chat.putExtra(ChatActivity.TITULO, datos.get("titulo_chat"));
        chat.putExtra(ChatActivity.GRUPO, "true".equals(datos.get("es_grupo")));

        PendingIntent alTocar = PendingIntent.getActivities(contexto, conversacion.hashCode(),
                new Intent[]{lista, chat},
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder aviso = new NotificationCompat.Builder(contexto, CANAL_MENSAJES)
                .setSmallIcon(R.drawable.ic_chat)
                .setColor(contexto.getColor(R.color.verde))
                .setContentTitle(titulo)
                .setContentText(cuerpo)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(cuerpo))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setAutoCancel(true)
                .setContentIntent(alTocar);

        NotificationManagerCompat gestor = NotificationManagerCompat.from(contexto);

        if (gestor.areNotificationsEnabled()) {
            try {
                gestor.notify(conversacion.hashCode(), aviso.build());
            } catch (SecurityException sinPermiso) {
                return;
            }
        }
    }

    public static void quitarDeLaBarra(Context contexto, String conversacion) {
        NotificationManagerCompat.from(contexto).cancel(conversacion.hashCode());
    }
}
