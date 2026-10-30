package com.example.persistenciaandroid;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class ProductoAdapter extends RecyclerView.Adapter<ProductoAdapter.Holder> {

    public interface AlTocar {
        void tocado(Producto producto);
    }

    private final List<Producto> productos = new ArrayList<>();
    private final AlTocar alTocar;
    private final AlTocar alBorrar;
    private int elegido = -1;

    public ProductoAdapter(AlTocar alTocar, AlTocar alBorrar) {
        this.alTocar = alTocar;
        this.alBorrar = alBorrar;
    }

    public void reemplazar(List<Producto> nuevos) {
        productos.clear();
        productos.addAll(nuevos);
        notifyDataSetChanged();
    }

    public void marcar(int id) {
        elegido = id;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public Holder onCreateViewHolder(@NonNull ViewGroup padre, int tipoDeVista) {
        View vista = LayoutInflater.from(padre.getContext())
                .inflate(R.layout.item_producto, padre, false);
        return new Holder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull Holder holder, int posicion) {
        holder.pintar(productos.get(posicion), elegido, alTocar, alBorrar);
    }

    @Override
    public int getItemCount() {
        return productos.size();
    }

    public static class Holder extends RecyclerView.ViewHolder {

        private final TextView identificador;
        private final TextView nombre;
        private final TextView descripcion;
        private final TextView precio;
        private final TextView fecha;
        private final Button borrar;

        public Holder(@NonNull View vista) {
            super(vista);
            identificador = vista.findViewById(R.id.identificador);
            nombre = vista.findViewById(R.id.nombre);
            descripcion = vista.findViewById(R.id.descripcion);
            precio = vista.findViewById(R.id.precio);
            fecha = vista.findViewById(R.id.fecha);
            borrar = vista.findViewById(R.id.borrar);
        }

        void pintar(Producto producto, int elegido, AlTocar alTocar, AlTocar alBorrar) {
            identificador.setText("id " + producto.getId());
            nombre.setText(producto.getProducto());
            precio.setText(String.format(Locale.US, "$%.2f", producto.getPrecio()));

            if (producto.getDescripcion().isEmpty()) {
                descripcion.setVisibility(View.GONE);
            } else {
                descripcion.setVisibility(View.VISIBLE);
                descripcion.setText(producto.getDescripcion());
            }

            if (producto.getCreadoEn().isEmpty()) {
                fecha.setVisibility(View.GONE);
            } else {
                fecha.setVisibility(View.VISIBLE);
                fecha.setText(producto.getCreadoEn());
            }

            itemView.setAlpha(elegido == producto.getId() ? 0.55f : 1f);

            if (alBorrar == null) {
                borrar.setVisibility(View.GONE);
            } else {
                borrar.setVisibility(View.VISIBLE);
                borrar.setOnClickListener(v -> alBorrar.tocado(producto));
            }

            if (alTocar == null) {
                itemView.setOnClickListener(null);
                itemView.setClickable(false);
            } else {
                itemView.setOnClickListener(v -> alTocar.tocado(producto));
            }
        }
    }
}
