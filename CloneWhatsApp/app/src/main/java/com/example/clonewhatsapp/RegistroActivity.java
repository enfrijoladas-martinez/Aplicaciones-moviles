package com.example.clonewhatsapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class RegistroActivity extends AppCompatActivity {

    private EditText nombre;
    private EditText correo;
    private EditText contrasena;
    private EditText repetir;
    private Button crear;
    private TextView aviso;

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_registro);
        Bordes.ajustar(this, false);

        nombre = findViewById(R.id.nombre);
        correo = findViewById(R.id.correo);
        contrasena = findViewById(R.id.contrasena);
        repetir = findViewById(R.id.repetir);
        crear = findViewById(R.id.crear);
        aviso = findViewById(R.id.aviso);

        crear.setOnClickListener(v -> crear());
        findViewById(R.id.volver).setOnClickListener(v -> finish());
    }

    private void crear() {
        String minombre = nombre.getText().toString().trim();
        String micorreo = correo.getText().toString().trim();
        String clave = contrasena.getText().toString();
        String copia = repetir.getText().toString();

        if (minombre.length() < 2) {
            mostrar("Escribe tu nombre", true);
            return;
        }

        if (micorreo.isEmpty() || !micorreo.contains("@")) {
            mostrar("Escribe un correo valido", true);
            return;
        }

        if (clave.length() < 6) {
            mostrar("La contrasena necesita al menos 6 caracteres", true);
            return;
        }

        if (!clave.equals(copia)) {
            mostrar("Las contrasenas no coinciden", true);
            return;
        }

        crear.setEnabled(false);
        crear.setText("Creando...");
        aviso.setVisibility(View.GONE);

        Supabase.registrar(minombre, micorreo, clave, new Supabase.Respuesta<Sesion>() {
            @Override
            public void listo(Sesion sesion) {
                if (sesion.hayToken()) {
                    sesion.guardar(RegistroActivity.this);

                    Intent viaje = new Intent(RegistroActivity.this, PerfilActivity.class);
                    viaje.putExtra("nuevo", true);
                    viaje.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(viaje);
                    finish();
                    return;
                }

                crear.setText("Cuenta creada");
                mostrar("Te enviamos un correo para confirmar tu cuenta. "
                        + "Confirmala y despues inicia sesion.", false);
            }

            @Override
            public void fallo(String mensaje) {
                crear.setEnabled(true);
                crear.setText("Crear cuenta");
                mostrar(mensaje, true);
            }
        });
    }

    private void mostrar(String mensaje, boolean esError) {
        aviso.setTextColor(getColor(esError ? R.color.rojo : R.color.verde));
        aviso.setText(mensaje);
        aviso.setVisibility(View.VISIBLE);
    }
}
