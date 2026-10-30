package com.example.sensores;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.animation.AnimationUtils;
import android.view.animation.OvershootInterpolator;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    private static final long DURACION = 2200L;

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_splash);

        View anillo = findViewById(R.id.anillo);
        View punto = findViewById(R.id.punto);
        TextView titulo = findViewById(R.id.titulo);
        TextView subtitulo = findViewById(R.id.subtitulo);

        anillo.startAnimation(AnimationUtils.loadAnimation(this, R.anim.girar));

        punto.setScaleX(0f);
        punto.setScaleY(0f);
        punto.animate()
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(700)
                .setInterpolator(new OvershootInterpolator())
                .start();

        titulo.setAlpha(0f);
        titulo.setTranslationY(40f);
        titulo.animate()
                .alpha(1f)
                .translationY(0f)
                .setStartDelay(500)
                .setDuration(600)
                .start();

        subtitulo.setAlpha(0f);
        subtitulo.animate()
                .alpha(1f)
                .setStartDelay(900)
                .setDuration(600)
                .start();

        findViewById(R.id.raiz).postDelayed(this::entrar, DURACION);
    }

    private void entrar() {
        if (isFinishing()) {
            return;
        }

        startActivity(new Intent(this, InicioActivity.class));
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        finish();
    }
}
