package com.example.clonewhatsapp;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onNewToken(@NonNull String token) {
        Notificaciones.guardarToken(token);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage mensaje) {
        if (!mensaje.getData().isEmpty()) {
            Notificaciones.mostrarMensaje(this, mensaje.getData());
        }
    }
}
