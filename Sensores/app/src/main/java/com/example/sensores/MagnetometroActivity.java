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

public class MagnetometroActivity extends BaseDrawerActivity implements SensorEventListener {

    private SensorManager gestor;
    private Sensor magnetometro;
    private Sensor acelerometro;

    private final float[] campo = new float[3];
    private final float[] gravedad = new float[3];
    private final float[] rotacion = new float[9];
    private final float[] inclinacion = new float[9];
    private final float[] angulos = new float[3];

    private boolean hayCampo = false;
    private boolean hayGravedad = false;

    private TextView valorX;
    private TextView valorY;
    private TextView valorZ;
    private TextView intensidad;
    private TextView grados;
    private TextView rumbo;
    private TextView aviso;
    private View aguja;

    private float gradosSuavizados = 0f;

    @Override
    protected int getLayoutContenido() {
        return R.layout.contenido_magnetometro;
    }

    @Override
    protected String getTituloPantalla() {
        return "Magnetometro";
    }

    @Override
    protected int getItemMenu() {
        return R.id.menu_magnetometro;
    }

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);

        valorX = findViewById(R.id.valorX);
        valorY = findViewById(R.id.valorY);
        valorZ = findViewById(R.id.valorZ);
        intensidad = findViewById(R.id.intensidad);
        grados = findViewById(R.id.grados);
        rumbo = findViewById(R.id.rumbo);
        aviso = findViewById(R.id.aviso);
        aguja = findViewById(R.id.aguja);

        gestor = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        magnetometro = gestor.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        acelerometro = gestor.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        if (magnetometro == null) {
            aviso.setText("Este equipo no tiene magnetometro");
            aviso.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (magnetometro != null) {
            gestor.registerListener(this, magnetometro, SensorManager.SENSOR_DELAY_UI);
        }

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
        if (evento.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
            System.arraycopy(evento.values, 0, campo, 0, 3);
            hayCampo = true;
            pintarCampo();
        }

        if (evento.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            System.arraycopy(evento.values, 0, gravedad, 0, 3);
            hayGravedad = true;
        }

        if (hayCampo && hayGravedad) {
            calcularBrujula();
        }
    }

    private void pintarCampo() {
        valorX.setText(String.format(Locale.US, "%.1f", campo[0]));
        valorY.setText(String.format(Locale.US, "%.1f", campo[1]));
        valorZ.setText(String.format(Locale.US, "%.1f", campo[2]));

        double total = Math.sqrt(
                campo[0] * campo[0] + campo[1] * campo[1] + campo[2] * campo[2]);

        intensidad.setText(String.format(Locale.US, "%.1f uT", total));
    }

    private void calcularBrujula() {
        boolean listo = SensorManager.getRotationMatrix(
                rotacion, inclinacion, gravedad, campo);

        if (!listo) {
            return;
        }

        SensorManager.getOrientation(rotacion, angulos);

        float azimut = (float) Math.toDegrees(angulos[0]);

        if (azimut < 0) {
            azimut += 360f;
        }

        gradosSuavizados = suavizar(gradosSuavizados, azimut);

        grados.setText(String.format(Locale.US, "%.0f", gradosSuavizados));
        rumbo.setText(nombrarRumbo(gradosSuavizados));
        aguja.setRotation(-gradosSuavizados);
    }

    private float suavizar(float anterior, float nuevo) {
        float diferencia = nuevo - anterior;

        while (diferencia > 180) {
            diferencia -= 360;
        }

        while (diferencia < -180) {
            diferencia += 360;
        }

        float resultado = anterior + diferencia * 0.18f;

        if (resultado < 0) {
            resultado += 360;
        }

        return resultado % 360;
    }

    private String nombrarRumbo(float valor) {
        String[] nombres = {"Norte", "Noreste", "Este", "Sureste",
                "Sur", "Suroeste", "Oeste", "Noroeste"};

        int indice = (int) Math.round(valor / 45.0) % 8;
        return nombres[indice];
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int precision) {
    }
}
