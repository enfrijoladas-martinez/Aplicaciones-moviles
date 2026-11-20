package com.example.clonewhatsapp;

import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MensajeAdapter extends RecyclerView.Adapter<MensajeAdapter.Holder> {

    public interface Acciones {
        void verImagen(String url);

        void eliminar(Mensaje mensaje);
    }

    private static final int ENVIADO = 1;
    private static final int RECIBIDO = 2;

    private final List<Mensaje> mensajes = new ArrayList<>();
    private final String miId;
    private final boolean esGrupo;
    private final Map<String, String> nombres;
    private final Acciones acciones;
    private String resaltado = "";

    public MensajeAdapter(String miId, boolean esGrupo, Map<String, String> nombres,
                          Acciones acciones) {
        this.miId = miId;
        this.esGrupo = esGrupo;
        this.nombres = nombres;
        this.acciones = acciones;
    }

    public void poner(List<Mensaje> nuevos) {
        mensajes.clear();
        mensajes.addAll(nuevos);
        notifyDataSetChanged();
    }

    public int agregarOActualizar(Mensaje mensaje) {
        int posicion = posicionDe(mensaje.id);

        if (posicion >= 0) {
            if (mensaje.remitenteNombre.isEmpty()) {
                mensaje.remitenteNombre = mensajes.get(posicion).remitenteNombre;
            }
            mensajes.set(posicion, mensaje);
            notifyItemChanged(posicion);
            return posicion;
        }

        mensajes.add(mensaje);
        notifyItemInserted(mensajes.size() - 1);
        return mensajes.size() - 1;
    }

    public int posicionDe(String id) {
        for (int i = 0; i < mensajes.size(); i++) {
            if (mensajes.get(i).id.equals(id)) {
                return i;
            }
        }
        return -1;
    }

    public void resaltar(String id) {
        int anterior = posicionDe(resaltado);
        resaltado = id;

        if (anterior >= 0) {
            notifyItemChanged(anterior);
        }

        int actual = posicionDe(id);

        if (actual >= 0) {
            notifyItemChanged(actual);
        }
    }

    @Override
    public int getItemViewType(int posicion) {
        return mensajes.get(posicion).esMio(miId) ? ENVIADO : RECIBIDO;
    }

    @NonNull
    @Override
    public Holder onCreateViewHolder(@NonNull ViewGroup padre, int tipo) {
        int diseno = tipo == ENVIADO ? R.layout.item_mensaje_enviado : R.layout.item_mensaje_recibido;
        View vista = LayoutInflater.from(padre.getContext()).inflate(diseno, padre, false);
        return new Holder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull Holder holder, int posicion) {
        Mensaje mensaje = mensajes.get(posicion);
        boolean mio = mensaje.esMio(miId);

        if (esGrupo && !mio) {
            String nombre = mensaje.remitenteNombre.isEmpty()
                    ? nombres.get(mensaje.remitenteId)
                    : mensaje.remitenteNombre;

            holder.remitente.setText(nombre == null || nombre.isEmpty() ? "Participante" : nombre);
            holder.remitente.setVisibility(View.VISIBLE);
        } else {
            holder.remitente.setVisibility(View.GONE);
        }

        if (mensaje.eliminado) {
            holder.texto.setText(mio ? "Eliminaste este mensaje" : "Se elimino este mensaje");
            holder.texto.setTypeface(null, Typeface.ITALIC);
            holder.texto.setTextColor(holder.itemView.getContext().getColor(R.color.gris));
            holder.texto.setVisibility(View.VISIBLE);
        } else {
            holder.texto.setText(mensaje.contenido);
            holder.texto.setTypeface(null, Typeface.NORMAL);
            holder.texto.setTextColor(holder.itemView.getContext().getColor(R.color.negro));
            holder.texto.setVisibility(mensaje.contenido.isEmpty() ? View.GONE : View.VISIBLE);
        }

        if (mensaje.tieneImagen()) {
            holder.imagen.setVisibility(View.VISIBLE);
            Imagenes.cargar(holder.imagen, mensaje.imagen, R.color.gris_claro);
            holder.imagen.setOnClickListener(v -> acciones.verImagen(mensaje.imagen));
        } else {
            holder.imagen.setVisibility(View.GONE);
            holder.imagen.setOnClickListener(null);
        }

        holder.hora.setText(Fechas.hora(mensaje.fecha));

        if (mio && !mensaje.eliminado) {
            holder.palomitas.setVisibility(View.VISIBLE);
            Estados.pintar(holder.palomitas, mensaje.estado);
        } else {
            holder.palomitas.setVisibility(View.GONE);
        }

        holder.fila.setBackgroundColor(mensaje.id.equals(resaltado)
                ? holder.itemView.getContext().getColor(R.color.resaltado)
                : 0);

        View.OnLongClickListener largo = v -> {
            if (mio && !mensaje.eliminado) {
                acciones.eliminar(mensaje);
                return true;
            }
            return false;
        };

        holder.burbuja.setOnLongClickListener(largo);
        holder.imagen.setOnLongClickListener(largo);
    }

    @Override
    public int getItemCount() {
        return mensajes.size();
    }

    static class Holder extends RecyclerView.ViewHolder {
        final View fila;
        final View burbuja;
        final TextView remitente;
        final ImageView imagen;
        final TextView texto;
        final TextView hora;
        final TextView palomitas;

        Holder(View vista) {
            super(vista);
            fila = vista.findViewById(R.id.fila);
            burbuja = vista.findViewById(R.id.burbuja);
            remitente = vista.findViewById(R.id.remitente);
            imagen = vista.findViewById(R.id.imagen);
            texto = vista.findViewById(R.id.texto);
            hora = vista.findViewById(R.id.hora);
            palomitas = vista.findViewById(R.id.palomitas);
        }
    }
}
