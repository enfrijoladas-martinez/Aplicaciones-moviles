package com.example.custompassemailrecovery;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class InicioActivity extends AppCompatActivity {

    private Button salir;

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_inicio);

        Sesion sesion = Sesion.recuperar(this);

        if (!sesion.hayToken()) {
            volverAlLogin();
            return;
        }

        TextView correo = findViewById(R.id.correo);
        TextView token = findViewById(R.id.token);
        TextView payload = findViewById(R.id.payload);

        correo.setText(sesion.getCorreo());
        token.setText(sesion.getTokenRecortado());

        String contenido = sesion.getPayload();
        payload.setText(contenido.isEmpty() ? "No se pudo leer el token" : contenido);

        salir = findViewById(R.id.salir);
        salir.setOnClickListener(v -> cerrarSesion(sesion));
    }

    private void cerrarSesion(Sesion sesion) {
        salir.setEnabled(false);
        salir.setText("Cerrando...");

        Supabase.salir(sesion.getAccessToken(), new Supabase.Respuesta<String>() {
            @Override
            public void listo(String dato) {
                terminar();
            }

            @Override
            public void fallo(String mensaje) {
                Toast.makeText(InicioActivity.this,
                        "El servidor no respondio, pero la sesion local se borro",
                        Toast.LENGTH_SHORT).show();
                terminar();
            }
        });
    }

    private void terminar() {
        Sesion.borrar(this);
        volverAlLogin();
    }

    private void volverAlLogin() {
        Intent viaje = new Intent(this, LoginActivity.class);
        viaje.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(viaje);
        finishAffinity();
    }
}
