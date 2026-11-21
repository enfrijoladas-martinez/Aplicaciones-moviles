package com.example.clonewhatsapp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class ContactoAdapter extends RecyclerView.Adapter<ContactoAdapter.Holder> {

    public interface AlTocar {
        void elegir(Perfil perfil);
    }

    private final List<Perfil> perfiles = new ArrayList<>();
    private final Set<String> elegidos = new LinkedHashSet<>();
    private final boolean multiple;
    private final AlTocar alTocar;

    public ContactoAdapter(boolean multiple, AlTocar alTocar) {
        this.multiple = multiple;
        this.alTocar = alTocar;
    }

    public void poner(List<Perfil> nuevos) {
        perfiles.clear();
        perfiles.addAll(nuevos);
        notifyDataSetChanged();
    }

    public List<String> getElegidos() {
        return new ArrayList<>(elegidos);
    }

    @NonNull
    @Override
    public Holder onCreateViewHolder(@NonNull ViewGroup padre, int tipo) {
        View vista = LayoutInflater.from(padre.getContext())
                .inflate(R.layout.item_contacto, padre, false);
        return new Holder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull Holder holder, int posicion) {
        Perfil perfil = perfiles.get(posicion);

        holder.nombre.setText(perfil.nombreCompleto());

        String conexion = Fechas.ultimaConexion(perfil.ultimaConexion);
        holder.detalle.setText(conexion.isEmpty() ? perfil.numero : conexion);

        Imagenes.cargar(holder.avatar, perfil.avatar, R.drawable.avatar_vacio);

        holder.elegido.setVisibility(multiple ? View.VISIBLE : View.GONE);
        holder.elegido.setChecked(elegidos.contains(perfil.id));

        holder.itemView.setOnClickListener(v -> {
            if (multiple) {
                if (!elegidos.remove(perfil.id)) {
                    elegidos.add(perfil.id);
                }
                notifyItemChanged(holder.getBindingAdapterPosition());
            }
            alTocar.elegir(perfil);
        });
    }

    @Override
    public int getItemCount() {
        return perfiles.size();
    }

    static class Holder extends RecyclerView.ViewHolder {
        final ImageView avatar;
        final TextView nombre;
        final TextView detalle;
        final CheckBox elegido;

        Holder(View vista) {
            super(vista);
            avatar = vista.findViewById(R.id.avatar);
            nombre = vista.findViewById(R.id.nombre);
            detalle = vista.findViewById(R.id.detalle);
            elegido = vista.findViewById(R.id.elegido);
        }
    }
}
