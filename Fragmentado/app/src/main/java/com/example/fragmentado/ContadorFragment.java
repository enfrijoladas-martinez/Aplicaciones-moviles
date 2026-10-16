package com.example.fragmentado;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class ContadorFragment extends Fragment {

    private static final String ARG_INICIAL = "inicial";
    private static final String ARG_PASO = "paso";
    private static final String ESTADO_VALOR = "valor";

    private int valor;
    private int paso;
    private TextView textoNumero;

    public static ContadorFragment nuevo(int inicial, int paso) {
        ContadorFragment fragmento = new ContadorFragment();

        Bundle argumentos = new Bundle();
        argumentos.putInt(ARG_INICIAL, inicial);
        argumentos.putInt(ARG_PASO, paso);
        fragmento.setArguments(argumentos);

        return fragmento;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_contador, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View vista, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(vista, savedInstanceState);

        textoNumero = vista.findViewById(R.id.textoNumero);
        TextView textoArgumentos = vista.findViewById(R.id.textoArgumentos);
        Button botonMas = vista.findViewById(R.id.botonMas);
        Button botonMenos = vista.findViewById(R.id.botonMenos);

        int inicial = 0;
        paso = 1;

        if (getArguments() != null) {
            inicial = getArguments().getInt(ARG_INICIAL, 0);
            paso = getArguments().getInt(ARG_PASO, 1);
        }

        if (savedInstanceState != null) {
            valor = savedInstanceState.getInt(ESTADO_VALOR, inicial);
        } else {
            valor = inicial;
        }

        pintar();

        textoArgumentos.setText("Argumentos recibidos en el Bundle:\n"
                + ARG_INICIAL + " = " + inicial + "\n"
                + ARG_PASO + " = " + paso);

        botonMas.setOnClickListener(v -> {
            valor = valor + paso;
            pintar();
        });

        botonMenos.setOnClickListener(v -> {
            valor = valor - paso;
            pintar();
        });
    }

    @Override
    public void onSaveInstanceState(@NonNull Bundle estado) {
        super.onSaveInstanceState(estado);
        estado.putInt(ESTADO_VALOR, valor);
    }

    private void pintar() {
        textoNumero.setText(String.valueOf(valor));
    }
}
