package com.example.persistenciaandroid;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;
import java.util.Locale;

public class ActualizarFragment extends Fragment {

    private ProductoAdapter adaptador;
    private ProgressBar rueda;
    private TextView contador;
    private TextView nota;
    private View formulario;

    private EditText producto;
    private EditText descripcion;
    private EditText precio;
    private Button actualizar;

    private int elegido = -1;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflador, @Nullable ViewGroup padre,
                             @Nullable Bundle estado) {
        return inflador.inflate(R.layout.fragment_actualizar, padre, false);
    }

    @Override
    public void onViewCreated(@NonNull View vista, @Nullable Bundle estado) {
        rueda = vista.findViewById(R.id.rueda);
        contador = vista.findViewById(R.id.contador);
        nota = vista.findViewById(R.id.nota);
        formulario = vista.findViewById(R.id.formulario);

        producto = vista.findViewById(R.id.producto);
        descripcion = vista.findViewById(R.id.descripcion);
        precio = vista.findViewById(R.id.precio);
        actualizar = vista.findViewById(R.id.actualizar);

        Button cancelar = vista.findViewById(R.id.cancelar);

        RecyclerView lista = vista.findViewById(R.id.lista);
        lista.setLayoutManager(new LinearLayoutManager(getContext()));

        adaptador = new ProductoAdapter(this::elegir, null);
        lista.setAdapter(adaptador);

        actualizar.setOnClickListener(v -> guardar());
        cancelar.setOnClickListener(v -> cancelar());

        cancelar();
        consultar();
    }

    private void consultar() {
        rueda.setVisibility(View.VISIBLE);

        Supabase.consultar(new Supabase.Respuesta<List<Producto>>() {
            @Override
            public void listo(List<Producto> productos) {
                if (!isAdded()) {
                    return;
                }

                rueda.setVisibility(View.GONE);
                adaptador.reemplazar(productos);
                contador.setText(String.valueOf(productos.size()));
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

    private void elegir(Producto item) {
        elegido = item.getId();

        producto.setText(item.getProducto());
        descripcion.setText(item.getDescripcion());
        precio.setText(String.format(Locale.US, "%.2f", item.getPrecio()));

        formulario.setVisibility(View.VISIBLE);
        nota.setText("update productos ... where id = " + elegido);
        adaptador.marcar(elegido);
    }

    private void cancelar() {
        elegido = -1;
        producto.setText("");
        descripcion.setText("");
        precio.setText("");

        formulario.setVisibility(View.GONE);
        nota.setText("Toca un producto de la lista para editarlo");
        adaptador.marcar(-1);
    }

    private void guardar() {
        if (elegido < 0) {
            return;
        }

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

        actualizar.setEnabled(false);
        actualizar.setText("Actualizando...");

        Supabase.actualizar(elegido, nombre, descripcion.getText().toString().trim(), monto,
                new Supabase.Respuesta<Producto>() {
                    @Override
                    public void listo(Producto modificado) {
                        if (!isAdded()) {
                            return;
                        }

                        actualizar.setEnabled(true);
                        actualizar.setText("Actualizar");

                        Toast.makeText(getContext(),
                                "Se modifico el registro con id " + modificado.getId(),
                                Toast.LENGTH_SHORT).show();

                        cancelar();
                        consultar();
                        avisar();
                    }

                    @Override
                    public void fallo(String mensaje) {
                        if (!isAdded()) {
                            return;
                        }

                        actualizar.setEnabled(true);
                        actualizar.setText("Actualizar");

                        Toast.makeText(getContext(), "No se pudo actualizar: " + mensaje,
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
