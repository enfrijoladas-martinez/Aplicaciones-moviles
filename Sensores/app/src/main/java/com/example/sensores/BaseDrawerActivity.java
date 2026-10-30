package com.example.sensores;

import android.content.Intent;
import android.os.Bundle;
import android.widget.FrameLayout;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.LayoutRes;
import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.google.android.material.navigation.NavigationView;

public abstract class BaseDrawerActivity extends AppCompatActivity {

    private DrawerLayout cajon;

    @LayoutRes
    protected abstract int getLayoutContenido();

    protected abstract String getTituloPantalla();

    protected abstract int getItemMenu();

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_base);

        FrameLayout contenedor = findViewById(R.id.contenedor);
        getLayoutInflater().inflate(getLayoutContenido(), contenedor, true);

        Toolbar barra = findViewById(R.id.barra);
        setSupportActionBar(barra);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(getTituloPantalla());
        }

        cajon = findViewById(R.id.cajon);
        cajon.setStatusBarBackgroundColor(getColor(R.color.negro));

        ActionBarDrawerToggle palanca = new ActionBarDrawerToggle(
                this, cajon, barra, R.string.abrir_cajon, R.string.cerrar_cajon);

        cajon.addDrawerListener(palanca);
        palanca.syncState();

        NavigationView navegacion = findViewById(R.id.navegacion);
        navegacion.setCheckedItem(getItemMenu());

        navegacion.setNavigationItemSelectedListener(opcion -> {
            cajon.closeDrawer(GravityCompat.START);

            if (opcion.getItemId() != getItemMenu()) {
                viajarA(opcion.getItemId());
            }

            return true;
        });

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (cajon.isDrawerOpen(GravityCompat.START)) {
                    cajon.closeDrawer(GravityCompat.START);
                    return;
                }

                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
            }
        });
    }

    private void viajarA(int opcion) {
        Class<?> destino;

        if (opcion == R.id.menu_inicio) {
            destino = InicioActivity.class;
        } else if (opcion == R.id.menu_acelerometro) {
            destino = AcelerometroActivity.class;
        } else if (opcion == R.id.menu_podometro) {
            destino = PodometroActivity.class;
        } else if (opcion == R.id.menu_giroscopio) {
            destino = GiroscopioActivity.class;
        } else if (opcion == R.id.menu_camara) {
            destino = CamaraActivity.class;
        } else if (opcion == R.id.menu_gps) {
            destino = GpsActivity.class;
        } else if (opcion == R.id.menu_magnetometro) {
            destino = MagnetometroActivity.class;
        } else {
            return;
        }

        Intent viaje = new Intent(this, destino);
        viaje.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(viaje);
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
    }

    protected void abrirCajon() {
        cajon.openDrawer(GravityCompat.START);
    }
}
