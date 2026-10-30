package com.example.sensores;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class CamaraActivity extends BaseDrawerActivity {

    private ImageView foto;
    private TextView medidas;
    private TextView momento;
    private TextView estado;
    private TextView aviso;
    private Button tomar;

    private ActivityResultLauncher<Intent> camara;
    private int tomadas = 0;

    @Override
    protected int getLayoutContenido() {
        return R.layout.contenido_camara;
    }

    @Override
    protected String getTituloPantalla() {
        return "Camara";
    }

    @Override
    protected int getItemMenu() {
        return R.id.menu_camara;
    }

    @Override
    protected void onCreate(@Nullable Bundle guardado) {
        super.onCreate(guardado);

        foto = findViewById(R.id.foto);
        medidas = findViewById(R.id.medidas);
        momento = findViewById(R.id.momento);
        estado = findViewById(R.id.estado);
        aviso = findViewById(R.id.aviso);
        tomar = findViewById(R.id.tomar);

        camara = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                resultado -> {
                    if (resultado.getResultCode() != RESULT_OK || resultado.getData() == null) {
                        estado.setText("cancelado");
                        return;
                    }

                    Bundle extras = resultado.getData().getExtras();

                    if (extras == null) {
                        estado.setText("la camara no devolvio imagen");
                        return;
                    }

                    Bitmap imagen = (Bitmap) extras.get("data");

                    if (imagen == null) {
                        estado.setText("la camara no devolvio imagen");
                        return;
                    }

                    mostrar(imagen);
                });

        tomar.setOnClickListener(v -> tomarFoto());

        boolean hayCamara = getPackageManager()
                .hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY);

        if (!hayCamara) {
            aviso.setText("Este equipo no reporta ninguna camara");
            aviso.setVisibility(View.VISIBLE);
            tomar.setEnabled(false);
        }
    }

    private void tomarFoto() {
        Intent viaje = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

        if (viaje.resolveActivity(getPackageManager()) == null) {
            aviso.setText("No hay ninguna aplicacion de camara que atienda el Intent");
            aviso.setVisibility(View.VISIBLE);
            return;
        }

        aviso.setVisibility(View.GONE);
        estado.setText("abriendo la camara...");
        camara.launch(viaje);
    }

    private void mostrar(Bitmap imagen) {
        tomadas++;

        foto.setImageBitmap(imagen);
        foto.setAlpha(0f);
        foto.animate().alpha(1f).setDuration(400).start();

        medidas.setText(imagen.getWidth() + " x " + imagen.getHeight() + " px");

        SimpleDateFormat formato = new SimpleDateFormat("HH:mm:ss", Locale.US);
        momento.setText(formato.format(new Date()));

        estado.setText("fotos tomadas: " + tomadas);
    }
}
