package com.example.listas;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class MateriaAdapter extends RecyclerView.Adapter<MateriaAdapter.MateriaHolder> {

    public interface AlTocar {
        void materiaTocada(Materia materia, int posicion);
    }

    private final List<Materia> materias;
    private final AlTocar escucha;
    private int vistasCreadas = 0;
    private boolean horizontal = false;

    public MateriaAdapter(List<Materia> materias, AlTocar escucha) {
        this.materias = materias;
        this.escucha = escucha;
    }

    public void setHorizontal(boolean horizontal) {
        this.horizontal = horizontal;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MateriaHolder onCreateViewHolder(@NonNull ViewGroup padre, int tipoDeVista) {
        View vista = LayoutInflater.from(padre.getContext())
                .inflate(R.layout.item_materia, padre, false);

        vistasCreadas++;

        return new MateriaHolder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull MateriaHolder holder, int posicion) {
        ViewGroup.LayoutParams medidas = holder.itemView.getLayoutParams();

        if (horizontal) {
            float densidad = holder.itemView.getResources().getDisplayMetrics().density;
            medidas.width = (int) (260 * densidad);
        } else {
            medidas.width = ViewGroup.LayoutParams.MATCH_PARENT;
        }

        holder.itemView.setLayoutParams(medidas);
        holder.pintar(materias.get(posicion), posicion, escucha);
    }

    @Override
    public int getItemCount() {
        return materias.size();
    }

    public int getVistasCreadas() {
        return vistasCreadas;
    }

    public static class MateriaHolder extends RecyclerView.ViewHolder {

        private final TextView inicial;
        private final TextView nombre;
        private final TextView profesor;
        private final TextView posicion;

        public MateriaHolder(@NonNull View vista) {
            super(vista);
            inicial = vista.findViewById(R.id.inicial);
            nombre = vista.findViewById(R.id.nombre);
            profesor = vista.findViewById(R.id.profesor);
            posicion = vista.findViewById(R.id.posicion);
        }

        void pintar(Materia materia, int indice, AlTocar escucha) {
            inicial.setText(materia.getInicial());
            inicial.setBackgroundColor(materia.getColor());
            nombre.setText(materia.getNombre());
            profesor.setText(materia.getProfesor());
            posicion.setText("posicion " + indice);

            itemView.setOnClickListener(v -> {
                if (escucha != null) {
                    escucha.materiaTocada(materia, indice);
                }
            });
        }
    }
}
