package com.example.myfirstandroidapp;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private EditText entrada;
    private TextView saludo;
    private TextView contador;
    private int veces = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        entrada = findViewById(R.id.entrada);
        saludo = findViewById(R.id.saludo);
        contador = findViewById(R.id.contador);
        Button boton = findViewById(R.id.boton);

        boton.setOnClickListener(v -> saludar());
    }

    private void saludar() {
        String nombre = entrada.getText().toString().trim();

        if (nombre.isEmpty()) {
            entrada.setError("Escribe tu nombre primero");
            return;
        }

        veces++;
        saludo.setText("Hola, " + nombre + "!");
        contador.setText(veces == 1 ? "Saludaste 1 vez" : "Saludaste " + veces + " veces");

        Toast.makeText(this, "Bienvenido " + nombre, Toast.LENGTH_SHORT).show();
    }
}
