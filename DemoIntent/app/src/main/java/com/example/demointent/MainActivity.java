package com.example.demointent;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    public static final String EXTRA_NOMBRE = "com.example.demointent.NOMBRE";
    public static final String EXTRA_EDAD = "com.example.demointent.EDAD";
    public static final String EXTRA_MATERIAS = "com.example.demointent.MATERIAS";
    public static final String EXTRA_SEMESTRE = "com.example.demointent.SEMESTRE";
    public static final String EXTRA_IMC = "com.example.demointent.IMC";
    public static final String EXTRA_CATEGORIA = "com.example.demointent.CATEGORIA";

    private EditText campoNombre;
    private EditText campoEdad;
    private TextView textoResultado;

    private ActivityResultLauncher<Intent> lanzadorCalculadora;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        campoNombre = findViewById(R.id.campoNombre);
        campoEdad = findViewById(R.id.campoEdad);
        textoResultado = findViewById(R.id.textoResultado);

        Button botonSaludo = findViewById(R.id.botonSaludo);
        Button botonCalculadora = findViewById(R.id.botonCalculadora);
        Button botonLista = findViewById(R.id.botonLista);

        lanzadorCalculadora = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                resultado -> {
                    if (resultado.getResultCode() == Activity.RESULT_OK && resultado.getData() != null) {
                        Intent datos = resultado.getData();
                        double imc = datos.getDoubleExtra(EXTRA_IMC, 0);
                        String categoria = datos.getStringExtra(EXTRA_CATEGORIA);

                        textoResultado.setText(
                                "La calculadora devolvio un IMC de " + String.format("%.2f", imc)
                                        + " (" + categoria + ")");
                    }
                });

        botonSaludo.setOnClickListener(v -> abrirSaludo());
        botonCalculadora.setOnClickListener(v -> abrirCalculadora());
        botonLista.setOnClickListener(v -> abrirLista());
    }

    private String leerNombre() {
        String nombre = campoNombre.getText().toString().trim();
        return nombre.isEmpty() ? "Invitado" : nombre;
    }

    private int leerEdad() {
        String texto = campoEdad.getText().toString().trim();
        if (texto.isEmpty()) {
            return 0;
        }
        return Integer.parseInt(texto);
    }

    private void abrirSaludo() {
        Intent intent = new Intent(MainActivity.this, SaludoActivity.class);
        intent.putExtra(EXTRA_NOMBRE, leerNombre());
        intent.putExtra(EXTRA_EDAD, leerEdad());
        startActivity(intent);
    }

    private void abrirCalculadora() {
        String nombre = leerNombre();

        if (campoNombre.getText().toString().trim().isEmpty()) {
            Toast.makeText(this, "Escribe tu nombre para personalizar el calculo",
                    Toast.LENGTH_SHORT).show();
        }

        Intent intent = new Intent(MainActivity.this, CalculadoraActivity.class);
        intent.putExtra(EXTRA_NOMBRE, nombre);
        lanzadorCalculadora.launch(intent);
    }

    private void abrirLista() {
        ArrayList<String> materias = new ArrayList<>();
        materias.add("Aplicaciones Moviles");
        materias.add("Base de Datos");
        materias.add("Redes de Computadoras");
        materias.add("Ingenieria de Software");
        materias.add("Sistemas Operativos");
        materias.add("Inteligencia Artificial");

        Intent intent = new Intent(MainActivity.this, ListaActivity.class);
        intent.putExtra(EXTRA_NOMBRE, leerNombre());
        intent.putStringArrayListExtra(EXTRA_MATERIAS, materias);
        intent.putExtra(EXTRA_SEMESTRE, 8);
        startActivity(intent);
    }
}
