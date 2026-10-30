package com.example.persistenciaandroid;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class AgregarFragment extends Fragment {

    private EditText producto;
    private EditText descripcion;
    private EditText precio;
    private Button guardar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflador, @Nullable ViewGroup padre,
                             @Nullable Bundle estado) {
        return inflador.inflate(R.layout.fragment_agregar, padre, false);
    }

    @Override
    public void onViewCreated(@NonNull View vista, @Nullable Bundle estado) {
        producto = vista.findViewById(R.id.producto);
        descripcion = vista.findViewById(R.id.descripcion);
        precio = vista.findViewById(R.id.precio);
        guardar = vista.findViewById(R.id.guardar);

        Button limpiar = vista.findViewById(R.id.limpiar);

        guardar.setOnClickListener(v -> guardar());
        limpiar.setOnClickListener(v -> limpiar());
    }

    private void limpiar() {
        producto.setText("");
        descripcion.setText("");
        precio.setText("");
        producto.requestFocus();
    }

    private void guardar() {
        String nombre = producto.getText().toString().trim();
        String texto = precio.getText().toString().trim().replace(',', '.');

        if (nombre.isEmpty()) {
            Toast.makeText(getContext(), "Escribe el nombre del producto",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        double monto;

        try {
            monto = Double.parseDouble(texto);
        } catch (NumberFormatException error) {
            Toast.makeText(getContext(), "El precio tiene que ser un numero",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        if (monto < 0) {
            Toast.makeText(getContext(), "El precio no puede ser negativo",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        guardar.setEnabled(false);
        guardar.setText("Guardando...");

        Supabase.agregar(nombre, descripcion.getText().toString().trim(), monto,
                new Supabase.Respuesta<Producto>() {
                    @Override
                    public void listo(Producto creado) {
                        if (!isAdded()) {
                            return;
                        }

                        guardar.setEnabled(true);
                        guardar.setText("Guardar");
                        limpiar();

                        Toast.makeText(getContext(),
                                "Se creo el registro con id " + creado.getId(),
                                Toast.LENGTH_SHORT).show();

                        avisar();
                    }

                    @Override
                    public void fallo(String mensaje) {
                        if (!isAdded()) {
                            return;
                        }

                        guardar.setEnabled(true);
                        guardar.setText("Guardar");

                        Toast.makeText(getContext(), "No se pudo guardar: " + mensaje,
                                Toast.LENGTH_LONG).show();
                    }
                });
    }

    private void avisar() {
        if (getActivity() instanceof MainActivity) {
            ((MainActivity) getActivity()).avisarCambio();
        }
    }
}
