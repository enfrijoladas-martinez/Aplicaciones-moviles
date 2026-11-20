package com.example.clonewhatsapp;

import android.os.Handler;
import android.os.Looper;

public class Presencia {

    private static final long CADA = 30000;
    private static final Handler PRINCIPAL = new Handler(Looper.getMainLooper());

    private static int pantallasActivas = 0;

    private static final Runnable AVISAR = new Runnable() {
        @Override
        public void run() {
            Supabase.ejecutar(() -> Supabase.rpc("tocar_conexion", null),
                    new Supabase.Respuesta<String>() {
                        @Override
                        public void listo(String dato) {
                        }

                        @Override
                        public void fallo(String mensaje) {
                        }
                    });

            PRINCIPAL.postDelayed(this, CADA);
        }
    };

    public static void entrar() {
        pantallasActivas++;

        if (pantallasActivas == 1) {
            PRINCIPAL.removeCallbacks(AVISAR);
            PRINCIPAL.post(AVISAR);
        }
    }

    public static void salir() {
        pantallasActivas = Math.max(0, pantallasActivas - 1);

        if (pantallasActivas == 0) {
            PRINCIPAL.removeCallbacks(AVISAR);
        }
    }
}
