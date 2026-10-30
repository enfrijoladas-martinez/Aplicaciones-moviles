package com.example.sensores;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class GpsActivity extends BaseDrawerActivity implements LocationListener {

    private LocationManager gestor;

    private TextView latitud;
    private TextView longitud;
    private TextView precision;
    private TextView altitud;
    private TextView velocidad;
    private TextView proveedor;
    private TextView momento;
    private TextView estado;
    private TextView aviso;

    private ActivityResultLauncher<String[]> pedirPermisos;
    private boolean escuchando = false;

    @Override
    protected int getLayoutContenido() {
        return R.layout.contenido_gps;
    }

    @Override
    protected String getTituloPantalla() {
        return "GPS";
    }

    @Override
    protected int getItemMenu() {
        return R.id.menu_gps;
    }

    @Override
    protected void onCreate(@Nullable Bundle guardado) {
        super.onCreate(guardado);

        latitud = findViewById(R.id.latitud);
        longitud = findViewById(R.id.longitud);
        precision = findViewById(R.id.precision);
        altitud = findViewById(R.id.altitud);
        velocidad = findViewById(R.id.velocidad);
        proveedor = findViewById(R.id.proveedor);
        momento = findViewById(R.id.momento);
        estado = findViewById(R.id.estado);
        aviso = findViewById(R.id.aviso);

        Button mapa = findViewById(R.id.verEnMapa);
        mapa.setOnClickListener(v -> abrirMapa());

        gestor = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        pedirPermisos = registerForActivityResult(
                new ActivityResultContracts.RequestMultiplePermissions(),
                respuesta -> {
                    boolean fina = Boolean.TRUE.equals(
                            respuesta.get(Manifest.permission.ACCESS_FINE_LOCATION));
                    boolean gruesa = Boolean.TRUE.equals(
                            respuesta.get(Manifest.permission.ACCESS_COARSE_LOCATION));

                    if (fina || gruesa) {
                        escuchar();
                        return;
                    }

                    aviso.setText("Sin permiso de ubicacion no se puede leer el GPS");
                    aviso.setVisibility(View.VISIBLE);
                    estado.setText("permiso denegado");
                });
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (!tienePermiso()) {
            pedirPermisos.launch(new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION});
            return;
        }

        escuchar();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (escuchando) {
            gestor.removeUpdates(this);
            escuchando = false;
        }
    }

    private boolean tienePermiso() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED
                || ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                == PackageManager.PERMISSION_GRANTED;
    }

    private void escuchar() {
        if (escuchando || !tienePermiso()) {
            return;
        }

        aviso.setVisibility(View.GONE);

        boolean prendido = gestor.isProviderEnabled(LocationManager.GPS_PROVIDER)
                || gestor.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

        if (!prendido) {
            aviso.setText("La ubicacion esta apagada en el sistema");
            aviso.setVisibility(View.VISIBLE);
            estado.setText("ubicacion apagada");
            return;
        }

        try {
            if (gestor.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                gestor.requestLocationUpdates(
                        LocationManager.GPS_PROVIDER, 1000, 0f, this);
            }

            if (gestor.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                gestor.requestLocationUpdates(
                        LocationManager.NETWORK_PROVIDER, 1000, 0f, this);
            }

            escuchando = true;
            estado.setText("buscando senal...");

            Location ultima = gestor.getLastKnownLocation(LocationManager.GPS_PROVIDER);

            if (ultima == null) {
                ultima = gestor.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
            }

            if (ultima != null) {
                onLocationChanged(ultima);
            }
        } catch (SecurityException error) {
            aviso.setText("Permiso rechazado por el sistema");
            aviso.setVisibility(View.VISIBLE);
        }
    }

    private void abrirMapa() {
        String texto = latitud.getText().toString();

        if (texto.equals("--")) {
            return;
        }

        String destino = "geo:" + texto + "," + longitud.getText().toString()
                + "?q=" + texto + "," + longitud.getText().toString();

        android.content.Intent viaje = new android.content.Intent(
                android.content.Intent.ACTION_VIEW, android.net.Uri.parse(destino));

        if (viaje.resolveActivity(getPackageManager()) != null) {
            startActivity(viaje);
            return;
        }

        aviso.setText("No hay ninguna aplicacion de mapas instalada");
        aviso.setVisibility(View.VISIBLE);
    }

    @Override
    public void onLocationChanged(@NonNull Location ubicacion) {
        latitud.setText(String.format(Locale.US, "%.6f", ubicacion.getLatitude()));
        longitud.setText(String.format(Locale.US, "%.6f", ubicacion.getLongitude()));
        precision.setText(String.format(Locale.US, "%.0f m", ubicacion.getAccuracy()));
        altitud.setText(String.format(Locale.US, "%.1f m", ubicacion.getAltitude()));
        velocidad.setText(String.format(Locale.US, "%.1f m/s", ubicacion.getSpeed()));
        proveedor.setText(ubicacion.getProvider());

        SimpleDateFormat formato = new SimpleDateFormat("HH:mm:ss", Locale.US);
        momento.setText(formato.format(new Date(ubicacion.getTime())));

        estado.setText("recibiendo");
    }

    @Override
    public void onProviderEnabled(@NonNull String nombre) {
        estado.setText(nombre + " encendido");
    }

    @Override
    public void onProviderDisabled(@NonNull String nombre) {
        estado.setText(nombre + " apagado");
    }
}
