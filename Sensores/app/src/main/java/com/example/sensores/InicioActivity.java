package com.example.sensores;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;

public class InicioActivity extends BaseDrawerActivity {

    @Override
    protected int getLayoutContenido() {
        return R.layout.contenido_inicio;
    }

    @Override
    protected String getTituloPantalla() {
        return "Inicio";
    }

    @Override
    protected int getItemMenu() {
        return R.id.menu_inicio;
    }

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);

        LinearLayout lista = findViewById(R.id.listaSensores);
        SensorManager gestor = (SensorManager) getSystemService(Context.SENSOR_SERVICE);

        agregar(lista, gestor, "Acelerometro", Sensor.TYPE_ACCELEROMETER);
        agregar(lista, gestor, "Giroscopio", Sensor.TYPE_GYROSCOPE);
        agregar(lista, gestor, "Podometro", Sensor.TYPE_STEP_COUNTER);
        agregar(lista, gestor, "Magnetometro", Sensor.TYPE_MAGNETIC_FIELD);

        boolean hayCamara = getPackageManager()
                .hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA_ANY);

        boolean hayGps = getPackageManager()
                .hasSystemFeature(android.content.pm.PackageManager.FEATURE_LOCATION_GPS);

        pintarFila(lista, "Camara", hayCamara ? "disponible" : "no disponible", hayCamara);
        pintarFila(lista, "GPS", hayGps ? "disponible" : "no disponible", hayGps);
    }

    private void agregar(LinearLayout lista, SensorManager gestor, String nombre, int tipo) {
        Sensor sensor = gestor.getDefaultSensor(tipo);

        if (sensor == null) {
            pintarFila(lista, nombre, "no disponible en este equipo", false);
            return;
        }

        pintarFila(lista, nombre, sensor.getName(), true);
    }

    private void pintarFila(LinearLayout lista, String nombre, String detalle, boolean hay) {
        LinearLayout fila = new LinearLayout(this);
        fila.setOrientation(LinearLayout.HORIZONTAL);
        fila.setGravity(Gravity.CENTER_VERTICAL);
        fila.setPadding(0, 14, 0, 14);

        TextView marca = new TextView(this);
        marca.setText(hay ? "OK" : "--");
        marca.setTextColor(getColor(hay ? R.color.verde : R.color.rojo));
        marca.setTextSize(13f);
        marca.setWidth(90);

        LinearLayout textos = new LinearLayout(this);
        textos.setOrientation(LinearLayout.VERTICAL);

        TextView titulo = new TextView(this);
        titulo.setText(nombre);
        titulo.setTextColor(getColor(R.color.negro));
        titulo.setTextSize(15f);

        TextView bajo = new TextView(this);
        bajo.setText(detalle);
        bajo.setTextColor(getColor(R.color.gris));
        bajo.setTextSize(11f);

        textos.addView(titulo);
        textos.addView(bajo);

        fila.addView(marca);
        fila.addView(textos);

        lista.addView(fila);
    }
}
