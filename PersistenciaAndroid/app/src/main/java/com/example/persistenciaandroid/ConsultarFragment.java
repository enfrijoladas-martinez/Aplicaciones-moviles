package com.example.persistenciaandroid;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class ConsultarFragment extends Fragment {

    private ProductoAdapter adaptador;
    private ProgressBar rueda;
    private TextView contador;
    private TextView vacio;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflador, @Nullable ViewGroup padre,
                             @Nullable Bundle estado) {
        return inflador.inflate(R.layout.fragment_consultar, padre, false);
    }

    @Override
    public void onViewCreated(@NonNull View vista, @Nullable Bundle estado) {
        rueda = vista.findViewById(R.id.rueda);
        contador = vista.findViewById(R.id.contador);
        vacio = vista.findViewById(R.id.vacio);

        RecyclerView lista = vista.findViewById(R.id.lista);
        lista.setLayoutManager(new LinearLayoutManager(getContext()));

        adaptador = new ProductoAdapter(null, null);
        lista.setAdapter(adaptador);

        Button recargar = vista.findViewById(R.id.recargar);
        recargar.setOnClickListener(v -> consultar());

        consultar();
    }

    private void consultar() {
        rueda.setVisibility(View.VISIBLE);
        vacio.setVisibility(View.GONE);

        Supabase.consultar(new Supabase.Respuesta<List<Producto>>() {
            @Override
            public void listo(List<Producto> productos) {
                if (!isAdded()) {
                    return;
                }

                rueda.setVisibility(View.GONE);
                adaptador.reemplazar(productos);
                contador.setText(String.valueOf(productos.size()));
                vacio.setVisibility(productos.isEmpty() ? View.VISIBLE : View.GONE);
            }

            @Override
            public void fallo(String mensaje) {
                if (!isAdded()) {
                    return;
                }

                rueda.setVisibility(View.GONE);
                Toast.makeText(getContext(), "No se pudo consultar: " + mensaje,
                        Toast.LENGTH_LONG).show();
            }
        });
    }
}
