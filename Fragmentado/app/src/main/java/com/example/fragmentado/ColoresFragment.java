package com.example.fragmentado;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class ColoresFragment extends Fragment {

    private static final String ARG_COLOR_INICIAL = "colorInicial";

    private LinearLayout raiz;
    private TextView textoColorActual;

    public static ColoresFragment nuevo(String colorInicial) {
        ColoresFragment fragmento = new ColoresFragment();

        Bundle argumentos = new Bundle();
        argumentos.putString(ARG_COLOR_INICIAL, colorInicial);
        fragmento.setArguments(argumentos);

        return fragmento;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_colores, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View vista, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(vista, savedInstanceState);

        raiz = vista.findViewById(R.id.raizColores);
        textoColorActual = vista.findViewById(R.id.textoColorActual);
        TextView textoArgumentos = vista.findViewById(R.id.textoArgumentos);

        Button botonAzul = vista.findViewById(R.id.botonAzul);
        Button botonVerde = vista.findViewById(R.id.botonVerde);
        Button botonNaranja = vista.findViewById(R.id.botonNaranja);

        String inicial = "Azul";

        if (getArguments() != null) {
            inicial = getArguments().getString(ARG_COLOR_INICIAL, inicial);
        }

        aplicar(inicial);

        textoArgumentos.setText("Argumentos recibidos en el Bundle:\n"
                + ARG_COLOR_INICIAL + " = " + inicial);

        botonAzul.setOnClickListener(v -> aplicar("Azul"));
        botonVerde.setOnClickListener(v -> aplicar("Verde"));
        botonNaranja.setOnClickListener(v -> aplicar("Naranja"));
    }

    private void aplicar(String nombre) {
        int color;

        if (nombre.equals("Verde")) {
            color = Color.parseColor("#DCFCE7");
        } else if (nombre.equals("Naranja")) {
            color = Color.parseColor("#FFEDD5");
        } else {
            color = Color.parseColor("#DBEAFE");
        }

        raiz.setBackgroundColor(color);
        textoColorActual.setText("Color aplicado al fondo: " + nombre);
    }
}
