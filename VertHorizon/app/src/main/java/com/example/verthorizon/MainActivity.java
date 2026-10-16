package com.example.verthorizon;

import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "VertHorizon";
    private static final String ESTADO_VALOR = "valorMostrado";
    private static final String ESTADO_GUARDAR = "conservarAlGirar";
    private static final String ESTADO_BITACORA = "bitacora";

    private EditText campoValor;
    private TextView textoValor;
    private TextView textoBitacora;
    private Switch interruptorGuardar;

    private ArrayList<String> bitacora = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        campoValor = findViewById(R.id.campoValor);
        textoValor = findViewById(R.id.textoValor);
        textoBitacora = findViewById(R.id.textoBitacora);
        interruptorGuardar = findViewById(R.id.interruptorGuardar);

        Button botonMostrar = findViewById(R.id.botonMostrar);

        if (savedInstanceState != null) {
            ArrayList<String> previa = savedInstanceState.getStringArrayList(ESTADO_BITACORA);
            if (previa != null) {
                bitacora = previa;
            }

            boolean conservar = savedInstanceState.getBoolean(ESTADO_GUARDAR, false);
            interruptorGuardar.setChecked(conservar);

            if (conservar) {
                String valor = savedInstanceState.getString(ESTADO_VALOR, "Sin valor");
                textoValor.setText(valor);
                registrar("Dato restaurado desde el Bundle: " + valor);
            } else {
                registrar("Habia un Bundle pero el interruptor estaba apagado");
            }
        }

        botonMostrar.setOnClickListener(v -> {
            String valor = campoValor.getText().toString().trim();

            if (valor.isEmpty()) {
                Toast.makeText(this, "Escribe algo primero", Toast.LENGTH_SHORT).show();
                return;
            }

            textoValor.setText(valor);
            registrar("Valor mostrado en el TextView: " + valor);
        });

        reportar("onCreate()");
        registrar("Orientacion: " + orientacionActual());
    }

    @Override
    protected void onStart() {
        super.onStart();
        Log.d(TAG, "onStart()");
        registrar("onStart()");
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume()");
        registrar("onResume()");
    }

    @Override
    protected void onPause() {
        super.onPause();
        reportar("onPause()");
    }

    @Override
    protected void onStop() {
        super.onStop();
        Log.d(TAG, "onStop()");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        reportar("onDestroy()");
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle estado) {
        super.onSaveInstanceState(estado);

        estado.putBoolean(ESTADO_GUARDAR, interruptorGuardar.isChecked());
        estado.putStringArrayList(ESTADO_BITACORA, bitacora);

        if (interruptorGuardar.isChecked()) {
            estado.putString(ESTADO_VALOR, textoValor.getText().toString());
            Log.d(TAG, "onSaveInstanceState() guardando el dato");
        } else {
            Log.d(TAG, "onSaveInstanceState() sin guardar el dato");
        }
    }

    private void reportar(String metodo) {
        Log.d(TAG, metodo);
        Toast.makeText(this, metodo, Toast.LENGTH_SHORT).show();
        registrar(metodo);
    }

    private void registrar(String mensaje) {
        String hora = new SimpleDateFormat("HH:mm:ss", new Locale("es", "MX")).format(new Date());
        bitacora.add(hora + "  " + mensaje);

        if (bitacora.size() > 14) {
            bitacora.remove(0);
        }

        if (textoBitacora != null) {
            StringBuilder texto = new StringBuilder();
            for (String linea : bitacora) {
                texto.append(linea).append("\n");
            }
            textoBitacora.setText(texto.toString().trim());
        }
    }

    private String orientacionActual() {
        if (getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
            return "horizontal";
        }
        return "vertical";
    }
}
