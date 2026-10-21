package com.example.listas;

import android.graphics.Color;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private RecyclerView lista;
    private MateriaAdapter adaptador;
    private TextView textoEstado;

    private final List<Materia> materias = new ArrayList<>();
    private int contadorNuevas = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        lista = findViewById(R.id.listaMaterias);
        textoEstado = findViewById(R.id.textoEstado);

        Button botonVertical = findViewById(R.id.botonVertical);
        Button botonHorizontal = findViewById(R.id.botonHorizontal);
        Button botonCuadricula = findViewById(R.id.botonCuadricula);
        Button botonAgregar = findViewById(R.id.botonAgregar);
        Button botonRestaurar = findViewById(R.id.botonRestaurar);

        llenarDatos();

        adaptador = new MateriaAdapter(materias, (materia, posicion) ->
                Toast.makeText(this,
                        materia.getNombre() + " en la posicion " + posicion,
                        Toast.LENGTH_SHORT).show());

        lista.setAdapter(adaptador);
        ponerVertical();

        lista.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recycler, int dx, int dy) {
                super.onScrolled(recycler, dx, dy);
                actualizarEstado(null);
            }
        });

        lista.post(() -> actualizarEstado(null));

        botonVertical.setOnClickListener(v -> ponerVertical());
        botonHorizontal.setOnClickListener(v -> ponerHorizontal());
        botonCuadricula.setOnClickListener(v -> ponerCuadricula());

        botonAgregar.setOnClickListener(v -> agregar());
        botonRestaurar.setOnClickListener(v -> restaurar());
    }

    private void llenarDatos() {
        materias.clear();
        materias.add(new Materia("Aplicaciones Moviles", "Ing. Ramirez", Color.parseColor("#1D4ED8")));
        materias.add(new Materia("Base de Datos", "Mtra. Lopez", Color.parseColor("#16A34A")));
        materias.add(new Materia("Redes de Computadoras", "Ing. Soto", Color.parseColor("#EA580C")));
        materias.add(new Materia("Ingenieria de Software", "Dr. Mendoza", Color.parseColor("#7C3AED")));
        materias.add(new Materia("Sistemas Operativos", "Mtro. Castillo", Color.parseColor("#BE123C")));
        materias.add(new Materia("Inteligencia Artificial", "Dra. Fuentes", Color.parseColor("#0D9488")));
        materias.add(new Materia("Estructura de Datos", "Ing. Navarro", Color.parseColor("#CA8A04")));
        materias.add(new Materia("Calculo Diferencial", "Mtro. Reyes", Color.parseColor("#0369A1")));
        materias.add(new Materia("Etica Profesional", "Lic. Guzman", Color.parseColor("#9333EA")));
        materias.add(new Materia("Seguridad Informatica", "Ing. Padilla", Color.parseColor("#DC2626")));
        materias.add(new Materia("Arquitectura de Computadoras", "Ing. Flores", Color.parseColor("#047857")));
        materias.add(new Materia("Programacion Web", "Mtra. Salas", Color.parseColor("#B45309")));
    }

    private void ponerVertical() {
        lista.setLayoutManager(new LinearLayoutManager(this));
        adaptador.setHorizontal(false);
        actualizarEstado("LinearLayoutManager vertical");
    }

    private void ponerHorizontal() {
        lista.setLayoutManager(
                new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        adaptador.setHorizontal(true);
        actualizarEstado("LinearLayoutManager horizontal");
    }

    private void ponerCuadricula() {
        lista.setLayoutManager(new GridLayoutManager(this, 2));
        adaptador.setHorizontal(false);
        actualizarEstado("GridLayoutManager de 2 columnas");
    }

    private void agregar() {
        materias.add(new Materia(
                "Materia nueva " + contadorNuevas,
                "Por asignar",
                Color.parseColor("#64748B")));

        contadorNuevas++;

        adaptador.notifyItemInserted(materias.size() - 1);
        lista.scrollToPosition(materias.size() - 1);
        actualizarEstado(null);
    }

    private void restaurar() {
        llenarDatos();
        contadorNuevas = 1;
        adaptador.notifyDataSetChanged();
        lista.scrollToPosition(0);
        actualizarEstado(null);
    }

    private void actualizarEstado(String manager) {
        if (manager != null) {
            textoEstado.setTag(manager);
        }

        String actual = textoEstado.getTag() == null ? "" : textoEstado.getTag().toString();

        textoEstado.setText(materias.size() + " materias · "
                + adaptador.getVistasCreadas() + " vistas creadas · " + actual);
    }
}
