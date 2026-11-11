package com.example.custompassemailrecovery;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class RegistroActivity extends AppCompatActivity {

    private EditText correo;
    private EditText contrasena;
    private EditText repetir;
    private Button crear;
    private TextView aviso;

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_registro);

        correo = findViewById(R.id.correo);
        contrasena = findViewById(R.id.contrasena);
        repetir = findViewById(R.id.repetir);
        crear = findViewById(R.id.crear);
        aviso = findViewById(R.id.aviso);

        crear.setOnClickListener(v -> crear());
        findViewById(R.id.volver).setOnClickListener(v -> finish());
    }

    private void crear() {
        String micorreo = correo.getText().toString().trim();
        String clave = contrasena.getText().toString();
        String copia = repetir.getText().toString();

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

        ocupado(true);

        Supabase.registrar(micorreo, clave, new Supabase.Respuesta<Sesion>() {
            @Override
            public void listo(Sesion sesion) {
                ocupado(false);

                if (sesion.hayToken()) {
                    sesion.guardar(RegistroActivity.this);
                    startActivity(new Intent(RegistroActivity.this, InicioActivity.class));
                    finishAffinity();
                    return;
                }

                mostrar("Cuenta creada. Revisa tu correo y confirma la cuenta "
                        + "antes de iniciar sesion.", false);

                crear.setEnabled(false);
                crear.setText("Revisa tu correo");
            }

            @Override
            public void fallo(String mensaje) {
                ocupado(false);
                mostrar(mensaje, true);
            }
        });
    }

    private void ocupado(boolean si) {
        crear.setEnabled(!si);
        crear.setText(si ? "Creando..." : "Crear cuenta");

        if (si) {
            aviso.setVisibility(View.GONE);
        }
    }

    private void mostrar(String mensaje, boolean esError) {
        aviso.setTextColor(getColor(esError ? R.color.rojo : R.color.verde));
        aviso.setText(mensaje);
        aviso.setVisibility(View.VISIBLE);
    }
}
