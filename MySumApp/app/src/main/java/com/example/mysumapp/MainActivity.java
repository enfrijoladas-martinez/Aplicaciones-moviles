package com.example.mysumapp;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.text.DecimalFormat;

public class MainActivity extends AppCompatActivity {

    private final DecimalFormat formato = new DecimalFormat("#,##0.##");

    private EditText numero1;
    private EditText numero2;
    private TextView resultado;
    private TextView operacion;
    private TextView aviso;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        numero1 = findViewById(R.id.numero1);
        numero2 = findViewById(R.id.numero2);
        resultado = findViewById(R.id.resultado);
        operacion = findViewById(R.id.operacion);
        aviso = findViewById(R.id.aviso);

        findViewById(R.id.sumar).setOnClickListener(v -> sumar());
        findViewById(R.id.limpiar).setOnClickListener(v -> limpiar());
    }

    private void sumar() {
        Double a = leer(numero1);
        Double b = leer(numero2);

        if (a == null || b == null) {
            aviso.setText("Escribe un numero valido en los dos campos");
            aviso.setVisibility(View.VISIBLE);
            return;
        }

        aviso.setVisibility(View.GONE);

        double suma = a + b;
        resultado.setText(formato.format(suma));
        operacion.setText(formato.format(a) + " + " + formato.format(b) + " = " + formato.format(suma));
    }

    private Double leer(EditText campo) {
        String texto = campo.getText().toString().trim();

        if (texto.isEmpty()) {
            return null;
        }

        try {
            return Double.parseDouble(texto);
        } catch (NumberFormatException error) {
            return null;
        }
    }

    private void limpiar() {
        numero1.setText("");
        numero2.setText("");
        resultado.setText("0");
        operacion.setText("");
        aviso.setVisibility(View.GONE);
        numero1.requestFocus();
    }
}
