package com.example.custompassemailrecovery;

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
        setContentView(R.layout.activity_login);

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

        if (!Supabase.hayCredenciales()) {
            mostrarError("Falta poner la URL y la llave en Supabase.java");
            entrar.setEnabled(false);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        Sesion guardada = Sesion.recuperar(this);

        if (guardada.hayToken()) {
            abrirInicio();
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
                abrirInicio();
            }

            @Override
            public void fallo(String mensaje) {
                ocupado(false);
                mostrarError(mensaje);
            }
        });
    }

    private void abrirInicio() {
        startActivity(new Intent(this, InicioActivity.class));
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
}
