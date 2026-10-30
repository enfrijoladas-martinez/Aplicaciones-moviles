package com.example.sensores;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.Nullable;

import java.util.Locale;

public class GiroscopioActivity extends BaseDrawerActivity implements SensorEventListener {

    private static final float NANOS = 1000000000.0f;

    private SensorManager gestor;
    private Sensor giroscopio;

    private TextView valorX;
    private TextView valorY;
    private TextView valorZ;
    private TextView giroX;
    private TextView giroY;
    private TextView giroZ;
    private TextView aviso;
    private View caja;

    private float acumuladoX = 0f;
    private float acumuladoY = 0f;
    private float acumuladoZ = 0f;
    private long marcaAnterior = 0L;

    @Override
    protected int getLayoutContenido() {
        return R.layout.contenido_giroscopio;
    }

    @Override
    protected String getTituloPantalla() {
        return "Giroscopio";
    }

    @Override
    protected int getItemMenu() {
        return R.id.menu_giroscopio;
    }

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);

        valorX = findViewById(R.id.valorX);
        valorY = findViewById(R.id.valorY);
        valorZ = findViewById(R.id.valorZ);
        giroX = findViewById(R.id.giroX);
        giroY = findViewById(R.id.giroY);
        giroZ = findViewById(R.id.giroZ);
        aviso = findViewById(R.id.aviso);
        caja = findViewById(R.id.caja);

        Button reiniciar = findViewById(R.id.reiniciar);
        reiniciar.setOnClickListener(v -> reiniciar());

        gestor = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        giroscopio = gestor.getDefaultSensor(Sensor.TYPE_GYROSCOPE);

        if (giroscopio == null) {
            aviso.setText("Este equipo no tiene giroscopio");
            aviso.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        marcaAnterior = 0L;

        if (giroscopio != null) {
            gestor.registerListener(this, giroscopio, SensorManager.SENSOR_DELAY_GAME);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        gestor.unregisterListener(this);
    }

    private void reiniciar() {
        acumuladoX = 0f;
        acumuladoY = 0f;
        acumuladoZ = 0f;
        marcaAnterior = 0L;
        pintarAcumulado();
        caja.setRotation(0f);
    }

    @Override
    public void onSensorChanged(SensorEvent evento) {
        float x = evento.values[0];
        float y = evento.values[1];
        float z = evento.values[2];

        valorX.setText(String.format(Locale.US, "%.3f", x));
        valorY.setText(String.format(Locale.US, "%.3f", y));
        valorZ.setText(String.format(Locale.US, "%.3f", z));

        if (marcaAnterior != 0L) {
            float transcurrido = (evento.timestamp - marcaAnterior) / NANOS;

            acumuladoX += Math.toDegrees(x * transcurrido);
            acumuladoY += Math.toDegrees(y * transcurrido);
            acumuladoZ += Math.toDegrees(z * transcurrido);

            pintarAcumulado();
            caja.setRotation(-acumuladoZ);
        }

        marcaAnterior = evento.timestamp;
    }

    private void pintarAcumulado() {
        giroX.setText(String.format(Locale.US, "%.1f", acumuladoX));
        giroY.setText(String.format(Locale.US, "%.1f", acumuladoY));
        giroZ.setText(String.format(Locale.US, "%.1f", acumuladoZ));
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int precision) {
    }
}
