package com.example.fragmentado;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class PerfilFragment extends Fragment {

    private static final String ARG_NOMBRE = "nombre";
    private static final String ARG_MATRICULA = "matricula";
    private static final String ARG_SEMESTRE = "semestre";

    public static PerfilFragment nuevo(String nombre, String matricula, int semestre) {
        PerfilFragment fragmento = new PerfilFragment();

        Bundle argumentos = new Bundle();
        argumentos.putString(ARG_NOMBRE, nombre);
        argumentos.putString(ARG_MATRICULA, matricula);
        argumentos.putInt(ARG_SEMESTRE, semestre);
        fragmento.setArguments(argumentos);

        return fragmento;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_perfil, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View vista, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(vista, savedInstanceState);

        TextView textoTitular = vista.findViewById(R.id.textoTitular);
        TextView textoDatos = vista.findViewById(R.id.textoDatos);
        TextView textoArgumentos = vista.findViewById(R.id.textoArgumentos);

        String nombre = "Sin nombre";
        String matricula = "Sin matricula";
        int semestre = 0;

        if (getArguments() != null) {
            nombre = getArguments().getString(ARG_NOMBRE, nombre);
            matricula = getArguments().getString(ARG_MATRICULA, matricula);
            semestre = getArguments().getInt(ARG_SEMESTRE, 0);
        }

        textoTitular.setText(nombre);
        textoDatos.setText("Matricula: " + matricula + "\n"
                + "Semestre: " + semestre + "\n"
                + "Carrera: Ingenieria en Sistemas");

        textoArgumentos.setText("Argumentos recibidos en el Bundle:\n"
                + ARG_NOMBRE + " = " + nombre + "\n"
                + ARG_MATRICULA + " = " + matricula + "\n"
                + ARG_SEMESTRE + " = " + semestre);
    }
}
