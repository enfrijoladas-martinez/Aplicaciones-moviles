package com.example.demointent;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class SaludoActivity extends AppCompatActivity {

    private TextView textoSaludo;
    private TextView textoMensaje;
    private TextView textoExtras;

    private String nombre;
    private int edad;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_saludo);

        textoSaludo = findViewById(R.id.textoSaludo);
        textoMensaje = findViewById(R.id.textoMensaje);
        textoExtras = findViewById(R.id.textoExtras);

        Button botonSumarAnio = findViewById(R.id.botonSumarAnio);
        Button botonRegresar = findViewById(R.id.botonRegresar);

        nombre = getIntent().getStringExtra(MainActivity.EXTRA_NOMBRE);
        edad = getIntent().getIntExtra(MainActivity.EXTRA_EDAD, 0);

        if (nombre == null) {
            nombre = "Invitado";
        }

        mostrar();

        botonSumarAnio.setOnClickListener(v -> {
            edad = edad + 1;
            mostrar();
        });

        botonRegresar.setOnClickListener(v -> finish());
    }

    private void mostrar() {
        textoSaludo.setText("Hola, " + nombre);

        if (edad <= 0) {
            textoMensaje.setText("No capturaste tu edad en la pantalla anterior.");
        } else if (edad >= 18) {
            textoMensaje.setText("Tienes " + edad + " anos, ya eres mayor de edad.");
        } else {
            textoMensaje.setText("Tienes " + edad + " anos, te faltan "
                    + (18 - edad) + " para ser mayor de edad.");
        }

        textoExtras.setText("EXTRA_NOMBRE  =  " + nombre + "\n"
                + "EXTRA_EDAD  =  " + edad);
    }
}
