package com.example.clonewhatsapp;

import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class Bordes {

    public static void ajustar(Activity actividad) {
        ajustar(actividad, true);
    }

    public static void ajustar(Activity actividad, boolean barraOscura) {
        WindowCompat.setDecorFitsSystemWindows(actividad.getWindow(), false);

        WindowInsetsControllerCompat controlador = WindowCompat.getInsetsController(
                actividad.getWindow(), actividad.getWindow().getDecorView());
        controlador.setAppearanceLightStatusBars(!barraOscura);
        controlador.setAppearanceLightNavigationBars(!barraOscura);

        ViewGroup contenido = actividad.findViewById(android.R.id.content);
        View raiz = contenido.getChildAt(0);

        ViewCompat.setOnApplyWindowInsetsListener(raiz, (vista, bordes) -> {
            Insets sistema = bordes.getInsets(WindowInsetsCompat.Type.systemBars());
            Insets teclado = bordes.getInsets(WindowInsetsCompat.Type.ime());

            vista.setPadding(sistema.left, sistema.top, sistema.right,
                    Math.max(sistema.bottom, teclado.bottom));

            return WindowInsetsCompat.CONSUMED;
        });
    }
}
