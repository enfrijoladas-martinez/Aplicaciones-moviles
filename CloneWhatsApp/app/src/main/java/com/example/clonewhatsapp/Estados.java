package com.example.clonewhatsapp;

import android.widget.TextView;

public class Estados {

    public static void pintar(TextView vista, String estado) {
        if (Mensaje.LEIDO.equals(estado)) {
            vista.setText("✓✓");
            vista.setTextColor(vista.getContext().getColor(R.color.azul_visto));
            return;
        }

        if (Mensaje.RECIBIDO.equals(estado)) {
            vista.setText("✓✓");
            vista.setTextColor(vista.getContext().getColor(R.color.gris));
            return;
        }

        vista.setText("✓");
        vista.setTextColor(vista.getContext().getColor(R.color.gris));
    }
}
