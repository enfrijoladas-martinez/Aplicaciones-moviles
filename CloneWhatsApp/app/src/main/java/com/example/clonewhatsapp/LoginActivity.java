package com.example.clonewhatsapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {

    private EditText correo;
    private EditText contrasena;
    private Button entrar;
    private TextView aviso;

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);

        if (Sesion.recuperar(this).hayToken()) {
            abrirChats();
            return;
        }

        setContentView(R.layout.activity_login);
        Bordes.ajustar(this, false);

        correo = findViewById(R.id.correo);
        contrasena = findViewById(R.id.contrasena);
        entrar = findViewById(R.id.entrar);
        aviso = findViewById(R.id.aviso);

        entrar.setOnClickListener(v -> entrar());

        findViewById(R.id.registrarse).setOnClickListener(v ->
                startActivity(new Intent(this, RegistroActivity.class)));

        findViewById(R.id.olvide).setOnClickListener(v -> {
            Intent viaje = new Intent(this, RecuperarActivity.class);
            viaje.putExtra("correo", correo.getText().toString().trim());
            startActivity(viaje);
        });

        String motivo = getIntent().getStringExtra("motivo");

        if (motivo != null) {
            mostrarError(motivo);
        }

        if (!Supabase.hayCredenciales()) {
            mostrarError("Falta configurar SUPABASE_URL y SUPABASE_KEY");
            entrar.setEnabled(false);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (entrar != null && Sesion.recuperar(this).hayToken()) {
            abrirChats();
        }
    }

    private void entrar() {
        String micorreo = correo.getText().toString().trim();
        String clave = contrasena.getText().toString();

        if (micorreo.isEmpty() || !micorreo.contains("@")) {
            mostrarError("Escribe un correo valido");
            return;
        }

        if (clave.isEmpty()) {
            mostrarError("Escribe tu contrasena");
            return;
        }

        ocupado(true);

        Supabase.entrar(micorreo, clave, new Supabase.Respuesta<Sesion>() {
            @Override
            public void listo(Sesion sesion) {
                ocupado(false);

                if (!sesion.hayToken()) {
                    mostrarError("Supabase no devolvio una sesion");
                    return;
                }

                sesion.guardar(LoginActivity.this);
                contrasena.setText("");
                abrirChats();
            }

            @Override
            public void fallo(String mensaje) {
                ocupado(false);
                mostrarError(mensaje);
            }
        });
    }

    private void abrirChats() {
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }

    private void ocupado(boolean si) {
        entrar.setEnabled(!si);
        entrar.setText(si ? "Entrando..." : "Entrar");

        if (si) {
            aviso.setVisibility(View.GONE);
        }
    }

    private void mostrarError(String mensaje) {
        aviso.setTextColor(getColor(R.color.rojo));
        aviso.setText(mensaje);
        aviso.setVisibility(View.VISIBLE);
    }

    public static void volver(AppCompatActivity desde, String motivo) {
        Sesion.borrar(desde);

        Intent viaje = new Intent(desde, LoginActivity.class);
        viaje.putExtra("motivo", motivo);
        viaje.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        desde.startActivity(viaje);
        desde.finish();
    }
}
