package com.example.sensores;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

public class PodometroActivity extends BaseDrawerActivity implements SensorEventListener {

    private SensorManager gestor;
    private Sensor contador;
    private Sensor detector;

    private TextView pasos;
    private TextView desdeArranque;
    private TextView estado;
    private TextView aviso;

    private long pasosIniciales = -1;
    private int pasosDetectados = 0;
    private boolean escuchando = false;

    private ActivityResultLauncher<String> pedirPermiso;

    @Override
    protected int getLayoutContenido() {
        return R.layout.contenido_podometro;
    }

    @Override
    protected String getTituloPantalla() {
        return "Podometro";
    }

    @Override
    protected int getItemMenu() {
        return R.id.menu_podometro;
    }

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);

        pasos = findViewById(R.id.pasos);
        desdeArranque = findViewById(R.id.desdeArranque);
        this.estado = findViewById(R.id.estado);
        aviso = findViewById(R.id.aviso);

        Button reiniciar = findViewById(R.id.reiniciar);
        reiniciar.setOnClickListener(v -> {
            pasosIniciales = -1;
            pasosDetectados = 0;
            pasos.setText("0");
        });

        gestor = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        contador = gestor.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        detector = gestor.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR);

        pedirPermiso = registerForActivityResult(
                new ActivityResultContracts.RequestPermission(),
                concedido -> {
                    if (concedido) {
                        escuchar();
                    } else {
                        aviso.setText("Sin el permiso de actividad fisica no se pueden contar pasos");
                        aviso.setVisibility(View.VISIBLE);
                    }
                });

        if (contador == null && detector == null) {
            aviso.setText("Este equipo no tiene sensor de pasos. Es normal en los emuladores: "
                    + "el podometro es hardware dedicado de bajo consumo y casi no se simula.");
            aviso.setVisibility(View.VISIBLE);
            this.estado.setText("sensor ausente");
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (contador == null && detector == null) {
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && !tienePermiso()) {
            pedirPermiso.launch(Manifest.permission.ACTIVITY_RECOGNITION);
            return;
        }

        escuchar();
    }

    private boolean tienePermiso() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.ACTIVITY_RECOGNITION)
                == PackageManager.PERMISSION_GRANTED;
    }

    private void escuchar() {
        if (escuchando) {
            return;
        }

        if (contador != null) {
            gestor.registerListener(this, contador, SensorManager.SENSOR_DELAY_NORMAL);
        }

        if (detector != null) {
            gestor.registerListener(this, detector, SensorManager.SENSOR_DELAY_NORMAL);
        }

        escuchando = true;
        estado.setText("escuchando");
        aviso.setVisibility(View.GONE);
    }

    @Override
    protected void onPause() {
        super.onPause();
        gestor.unregisterListener(this);
        escuchando = false;
    }

    @Override
    public void onSensorChanged(SensorEvent evento) {
        if (evento.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            long total = (long) evento.values[0];
            desdeArranque.setText(String.valueOf(total));

            if (pasosIniciales < 0) {
                pasosIniciales = total;
            }

            pasos.setText(String.valueOf(total - pasosIniciales));
            return;
        }

        if (evento.sensor.getType() == Sensor.TYPE_STEP_DETECTOR && contador == null) {
            pasosDetectados++;
            pasos.setText(String.valueOf(pasosDetectados));
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int precision) {
    }
}
