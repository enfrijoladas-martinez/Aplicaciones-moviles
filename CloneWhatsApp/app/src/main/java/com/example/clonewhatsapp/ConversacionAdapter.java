package com.example.clonewhatsapp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class ConversacionAdapter extends RecyclerView.Adapter<ConversacionAdapter.Holder> {

    public interface AlTocar {
        void abrir(Conversacion conversacion);
    }

    private final List<Conversacion> todas = new ArrayList<>();
    private final List<Conversacion> visibles = new ArrayList<>();
    private final AlTocar alTocar;
    private final String miId;
    private String filtro = "";

    public ConversacionAdapter(String miId, AlTocar alTocar) {
        this.miId = miId;
        this.alTocar = alTocar;
    }

    public void poner(List<Conversacion> nuevas) {
        todas.clear();
        todas.addAll(nuevas);
        aplicar();
    }

    public void filtrar(String texto) {
        filtro = texto == null ? "" : texto.trim().toLowerCase(Locale.ROOT);
        aplicar();
    }

    private void aplicar() {
        visibles.clear();

        for (Conversacion conversacion : todas) {
            if (filtro.isEmpty()
                    || conversacion.tituloVisible().toLowerCase(Locale.ROOT).contains(filtro)
                    || conversacion.resumen().toLowerCase(Locale.ROOT).contains(filtro)) {
                visibles.add(conversacion);
            }
        }

        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public Holder onCreateViewHolder(@NonNull ViewGroup padre, int tipo) {
        View vista = LayoutInflater.from(padre.getContext())
                .inflate(R.layout.item_conversacion, padre, false);
        return new Holder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull Holder holder, int posicion) {
        Conversacion conversacion = visibles.get(posicion);

        holder.titulo.setText(conversacion.tituloVisible());
        holder.fecha.setText(Fechas.corta(conversacion.ultimaFecha));

        boolean mio = conversacion.ultimoRemitente.equals(miId) && !conversacion.ultimaFecha.isEmpty();

        holder.ultimo.setText(mio ? "Tu: " + conversacion.resumen() : conversacion.resumen());
        holder.palomitas.setVisibility(View.GONE);

        if (conversacion.sinLeer > 0) {
            holder.sinLeer.setText(String.valueOf(conversacion.sinLeer));
            holder.sinLeer.setVisibility(View.VISIBLE);
            holder.fecha.setTextColor(holder.itemView.getContext().getColor(R.color.verde_claro));
        } else {
            holder.sinLeer.setVisibility(View.GONE);
            holder.fecha.setTextColor(holder.itemView.getContext().getColor(R.color.gris));
        }

        Imagenes.cargar(holder.avatar, conversacion.avatar,
                conversacion.esGrupo ? R.drawable.avatar_grupo : R.drawable.avatar_vacio);

        holder.itemView.setOnClickListener(v -> alTocar.abrir(conversacion));
    }

    @Override
    public int getItemCount() {
        return visibles.size();
    }

    static class Holder extends RecyclerView.ViewHolder {
        final ImageView avatar;
        final TextView titulo;
        final TextView fecha;
        final TextView palomitas;
        final TextView ultimo;
        final TextView sinLeer;

        Holder(View vista) {
            super(vista);
            avatar = vista.findViewById(R.id.avatar);
            titulo = vista.findViewById(R.id.titulo);
            fecha = vista.findViewById(R.id.fecha);
            palomitas = vista.findViewById(R.id.palomitas);
            ultimo = vista.findViewById(R.id.ultimo);
            sinLeer = vista.findViewById(R.id.sinLeer);
        }
    }
}
