package com.example.demointent;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;

public class ListaActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lista);

        TextView textoTitulo = findViewById(R.id.textoTitulo);
        TextView textoConteo = findViewById(R.id.textoConteo);
        TextView textoSeleccion = findViewById(R.id.textoSeleccion);
        ListView listaMaterias = findViewById(R.id.listaMaterias);
        Button botonRegresar = findViewById(R.id.botonRegresar);

        String nombre = getIntent().getStringExtra(MainActivity.EXTRA_NOMBRE);
        int semestre = getIntent().getIntExtra(MainActivity.EXTRA_SEMESTRE, 1);
        ArrayList<String> materias =
                getIntent().getStringArrayListExtra(MainActivity.EXTRA_MATERIAS);

        if (nombre == null) {
            nombre = "Invitado";
        }

        if (materias == null) {
            materias = new ArrayList<>();
        }

        textoTitulo.setText("Materias de " + nombre);
        textoConteo.setText(materias.size() + " materias en el semestre " + semestre);

        ArrayAdapter<String> adaptador = new ArrayAdapter<>(
                this,
                android.R.layout.simple_list_item_1,
                materias);

        listaMaterias.setAdapter(adaptador);

        ArrayList<String> finalMaterias = materias;
        listaMaterias.setOnItemClickListener((parent, view, posicion, id) ->
                textoSeleccion.setText("Seleccionaste: " + finalMaterias.get(posicion)));

        botonRegresar.setOnClickListener(v -> finish());
    }
}
