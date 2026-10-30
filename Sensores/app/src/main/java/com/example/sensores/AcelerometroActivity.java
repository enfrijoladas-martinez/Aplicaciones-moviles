package com.example.sensores;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.Nullable;

import java.util.Locale;

public class AcelerometroActivity extends BaseDrawerActivity implements SensorEventListener {

    private SensorManager gestor;
    private Sensor acelerometro;

    private TextView valorX;
    private TextView valorY;
    private TextView valorZ;
    private TextView magnitud;
    private TextView sacudidas;
    private TextView aviso;

    private View barraX;
    private View barraY;
    private View barraZ;

    private int conteoSacudidas = 0;
    private long ultimaSacudida = 0L;

    @Override
    protected int getLayoutContenido() {
        return R.layout.contenido_acelerometro;
    }

    @Override
    protected String getTituloPantalla() {
        return "Acelerometro";
    }

    @Override
    protected int getItemMenu() {
        return R.id.menu_acelerometro;
    }

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);

        valorX = findViewById(R.id.valorX);
        valorY = findViewById(R.id.valorY);
        valorZ = findViewById(R.id.valorZ);
        magnitud = findViewById(R.id.magnitud);
        sacudidas = findViewById(R.id.sacudidas);
        aviso = findViewById(R.id.aviso);

        barraX = findViewById(R.id.barraX);
        barraY = findViewById(R.id.barraY);
        barraZ = findViewById(R.id.barraZ);

        gestor = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        acelerometro = gestor.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        if (acelerometro == null) {
            aviso.setText("Este equipo no tiene acelerometro");
            aviso.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (acelerometro != null) {
            gestor.registerListener(this, acelerometro, SensorManager.SENSOR_DELAY_UI);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        gestor.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent evento) {
        float x = evento.values[0];
        float y = evento.values[1];
        float z = evento.values[2];

        valorX.setText(String.format(Locale.US, "%.2f", x));
        valorY.setText(String.format(Locale.US, "%.2f", y));
        valorZ.setText(String.format(Locale.US, "%.2f", z));

        ajustar(barraX, x);
        ajustar(barraY, y);
        ajustar(barraZ, z);

        double total = Math.sqrt(x * x + y * y + z * z);
        magnitud.setText(String.format(Locale.US, "%.2f m/s2", total));

        detectarSacudida(total);
    }

    private void ajustar(View barra, float valor) {
        float tope = 20f;
        float proporcion = Math.min(Math.abs(valor) / tope, 1f);

        android.view.ViewGroup.LayoutParams medidas = barra.getLayoutParams();
        medidas.width = (int) (proporcion * barra.getResources().getDisplayMetrics().density * 200);
        barra.setLayoutParams(medidas);
    }

    private void detectarSacudida(double total) {
        long ahora = System.currentTimeMillis();

        if (total > 18 && ahora - ultimaSacudida > 600) {
            ultimaSacudida = ahora;
            conteoSacudidas++;
            sacudidas.setText(String.valueOf(conteoSacudidas));
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int precision) {
    }
}
