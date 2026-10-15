package com.example.demointent;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class CalculadoraActivity extends AppCompatActivity {

    private EditText campoPeso;
    private EditText campoAltura;
    private TextView textoResultado;

    private String nombre;
    private double imc = 0;
    private String categoria = "sin calcular";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calculadora);

        TextView textoTitulo = findViewById(R.id.textoTitulo);
        campoPeso = findViewById(R.id.campoPeso);
        campoAltura = findViewById(R.id.campoAltura);
        textoResultado = findViewById(R.id.textoResultado);

        Button botonCalcular = findViewById(R.id.botonCalcular);
        Button botonRegresar = findViewById(R.id.botonRegresar);

        nombre = getIntent().getStringExtra(MainActivity.EXTRA_NOMBRE);

        if (nombre == null) {
            nombre = "Invitado";
        }

        textoTitulo.setText("Calculo para " + nombre);
        textoResultado.setText("Captura tu peso y tu altura, despues presiona Calcular.");

        botonCalcular.setOnClickListener(v -> calcular());
        botonRegresar.setOnClickListener(v -> regresar());
    }

    private void calcular() {
        String textoPeso = campoPeso.getText().toString().trim();
        String textoAltura = campoAltura.getText().toString().trim();

        if (textoPeso.isEmpty() || textoAltura.isEmpty()) {
            Toast.makeText(this, "Faltan datos", Toast.LENGTH_SHORT).show();
            return;
        }

        double peso = Double.parseDouble(textoPeso);
        double altura = Double.parseDouble(textoAltura);

        if (peso <= 0 || altura <= 0) {
            Toast.makeText(this, "Los valores deben ser mayores a cero", Toast.LENGTH_SHORT).show();
            return;
        }

        imc = peso / (altura * altura);
        categoria = clasificar(imc);

        textoResultado.setText(nombre + ", tu IMC es " + String.format("%.2f", imc)
                + "\nClasificacion: " + categoria);
    }

    private String clasificar(double valor) {
        if (valor < 18.5) {
            return "Bajo peso";
        } else if (valor < 25) {
            return "Peso normal";
        } else if (valor < 30) {
            return "Sobrepeso";
        } else {
            return "Obesidad";
        }
    }

    private void regresar() {
        Intent datos = new Intent();
        datos.putExtra(MainActivity.EXTRA_IMC, imc);
        datos.putExtra(MainActivity.EXTRA_CATEGORIA, categoria);

        setResult(Activity.RESULT_OK, datos);
        finish();
    }
}
