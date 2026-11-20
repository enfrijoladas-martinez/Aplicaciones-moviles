package com.example.clonewhatsapp;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class RecuperarActivity extends AppCompatActivity {

    private static final int PEDIR_CORREO = 1;
    private static final int ESCRIBIR_CODIGO = 2;
    private static final int NUEVA_CONTRASENA = 3;

    private int paso = PEDIR_CORREO;
    private String tokenRecuperacion = "";

    private TextView subtitulo;
    private TextView aviso;
    private Button accion;

    private View bloqueCorreo;
    private View bloqueCodigo;
    private View bloqueNueva;

    private TextView marcaPaso1;
    private TextView marcaPaso2;
    private TextView marcaPaso3;

    private EditText correo;
    private EditText codigo;
    private EditText nueva;
    private EditText repetir;

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_recuperar);
        Bordes.ajustar(this, false);

        subtitulo = findViewById(R.id.subtitulo);
        aviso = findViewById(R.id.aviso);
        accion = findViewById(R.id.accion);

        bloqueCorreo = findViewById(R.id.bloqueCorreo);
        bloqueCodigo = findViewById(R.id.bloqueCodigo);
        bloqueNueva = findViewById(R.id.bloqueNueva);

        marcaPaso1 = findViewById(R.id.paso1);
        marcaPaso2 = findViewById(R.id.paso2);
        marcaPaso3 = findViewById(R.id.paso3);

        correo = findViewById(R.id.correo);
        codigo = findViewById(R.id.codigo);
        nueva = findViewById(R.id.nueva);
        repetir = findViewById(R.id.repetir);

        String traido = getIntent().getStringExtra("correo");

        if (traido != null && !traido.isEmpty()) {
            correo.setText(traido);
        }

        accion.setOnClickListener(v -> avanzar());
        findViewById(R.id.volver).setOnClickListener(v -> finish());
        findViewById(R.id.reenviar).setOnClickListener(v -> enviarCodigo(true));

        pintarPaso();
    }

    private void avanzar() {
        if (paso == PEDIR_CORREO) {
            enviarCodigo(false);
            return;
        }

        if (paso == ESCRIBIR_CODIGO) {
            verificarCodigo();
            return;
        }

        guardarContrasena();
    }

    private void enviarCodigo(boolean esReenvio) {
        String micorreo = correo.getText().toString().trim();

        if (micorreo.isEmpty() || !micorreo.contains("@")) {
            mostrar("Escribe un correo valido", true);
            return;
        }

        ocupado(true, "Enviando...");

        Supabase.pedirCodigo(micorreo, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String dato) {
                ocupado(false, null);

                if (esReenvio) {
                    mostrar("Te enviamos otro codigo", false);
                    return;
                }

                paso = ESCRIBIR_CODIGO;
                pintarPaso();
                mostrar("Revisa tu correo. Si no aparece, mira en spam.", false);
            }

            @Override
            public void fallo(String mensaje) {
                ocupado(false, null);
                mostrar(mensaje, true);
            }
        });
    }

    private void verificarCodigo() {
        String micorreo = correo.getText().toString().trim();
        String digitos = codigo.getText().toString().trim();

        if (digitos.length() != 6) {
            mostrar("El codigo son 6 digitos", true);
            return;
        }

        ocupado(true, "Verificando...");

        Supabase.verificarCodigo(micorreo, digitos, new Supabase.Respuesta<Sesion>() {
            @Override
            public void listo(Sesion sesion) {
                ocupado(false, null);

                if (!sesion.hayToken()) {
                    mostrar("Supabase no devolvio el token de recuperacion", true);
                    return;
                }

                tokenRecuperacion = sesion.getAccessToken();
                paso = NUEVA_CONTRASENA;
                pintarPaso();
                mostrar("Codigo correcto. Escribe tu nueva contrasena.", false);
            }

            @Override
            public void fallo(String mensaje) {
                ocupado(false, null);
                mostrar(mensaje, true);
            }
        });
    }

    private void guardarContrasena() {
        String clave = nueva.getText().toString();
        String copia = repetir.getText().toString();

        if (clave.length() < 6) {
            mostrar("La contrasena necesita al menos 6 caracteres", true);
            return;
        }

        if (!clave.equals(copia)) {
            mostrar("Las contrasenas no coinciden", true);
            return;
        }

        ocupado(true, "Guardando...");

        Supabase.cambiarContrasena(tokenRecuperacion, clave, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String correoCambiado) {
                ocupado(false, null);

                Sesion.borrar(RecuperarActivity.this);

                mostrar("Listo. Ya puedes entrar con tu nueva contrasena.", false);

                accion.setEnabled(false);
                accion.setText("Contrasena cambiada");

                accion.postDelayed(() -> finish(), 1800);
            }

            @Override
            public void fallo(String mensaje) {
                ocupado(false, null);
                mostrar(mensaje, true);
            }
        });
    }

    private void pintarPaso() {
        bloqueCorreo.setVisibility(paso == PEDIR_CORREO ? View.VISIBLE : View.GONE);
        bloqueCodigo.setVisibility(paso == ESCRIBIR_CODIGO ? View.VISIBLE : View.GONE);
        bloqueNueva.setVisibility(paso == NUEVA_CONTRASENA ? View.VISIBLE : View.GONE);

        marcar(marcaPaso1, paso >= PEDIR_CORREO);
        marcar(marcaPaso2, paso >= ESCRIBIR_CODIGO);
        marcar(marcaPaso3, paso >= NUEVA_CONTRASENA);

        if (paso == PEDIR_CORREO) {
            subtitulo.setText("Escribe el correo de tu cuenta");
            accion.setText("Enviar codigo");
            return;
        }

        if (paso == ESCRIBIR_CODIGO) {
            subtitulo.setText("Escribe el codigo que llego a "
                    + correo.getText().toString().trim());
            accion.setText("Verificar codigo");
            return;
        }

        subtitulo.setText("Elige tu nueva contrasena");
        accion.setText("Guardar contrasena");
    }

    private void marcar(TextView marca, boolean activo) {
        marca.setBackgroundColor(getColor(activo ? R.color.verde : R.color.gris_claro));
        marca.setTextColor(getColor(activo ? R.color.blanco : R.color.gris));
    }

    private void ocupado(boolean si, String texto) {
        accion.setEnabled(!si);

        if (si) {
            accion.setText(texto);
            aviso.setVisibility(View.GONE);
            return;
        }

        pintarPaso();
    }

    private void mostrar(String mensaje, boolean esError) {
        aviso.setTextColor(getColor(esError ? R.color.rojo : R.color.verde));
        aviso.setText(mensaje);
        aviso.setVisibility(View.VISIBLE);
    }
}
