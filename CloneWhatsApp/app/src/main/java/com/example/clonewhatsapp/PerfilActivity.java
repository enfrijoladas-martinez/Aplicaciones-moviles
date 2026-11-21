package com.example.clonewhatsapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

public class PerfilActivity extends AppCompatActivity {

    private ImageView foto;
    private EditText nombre;
    private EditText apellido;
    private TextView correo;
    private TextView aviso;
    private Button guardar;

    private boolean nuevo;
    private String avatarActual = "";

    private final ActivityResultLauncher<String> elegirFoto =
            registerForActivityResult(new ActivityResultContracts.GetContent(), this::subirFoto);

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_perfil);
        Bordes.ajustar(this);

        nuevo = getIntent().getBooleanExtra("nuevo", false);

        foto = findViewById(R.id.foto);
        nombre = findViewById(R.id.nombre);
        apellido = findViewById(R.id.apellido);
        correo = findViewById(R.id.correo);
        aviso = findViewById(R.id.aviso);
        guardar = findViewById(R.id.guardar);

        TextView titulo = findViewById(R.id.tituloPerfil);
        titulo.setText(nuevo ? "Completa tu perfil" : "Perfil");

        View atras = findViewById(R.id.atras);
        atras.setVisibility(nuevo ? View.GONE : View.VISIBLE);
        atras.setOnClickListener(v -> finish());

        foto.setOnClickListener(v -> elegirFoto.launch("image/*"));
        findViewById(R.id.cambiarFoto).setOnClickListener(v -> elegirFoto.launch("image/*"));
        guardar.setOnClickListener(v -> guardar());

        correo.setText(Sesion.recuperar(this).getCorreo());
        cargar();
    }

    private void cargar() {
        String miId = Supabase.miId();

        Supabase.ejecutar(() -> {
            JSONArray filas = Supabase.consultar("/profiles?select=*&id_profile=eq." + miId);
            return filas.length() > 0 ? new Perfil(filas.getJSONObject(0)) : null;
        }, new Supabase.Respuesta<Perfil>() {
            @Override
            public void listo(Perfil perfil) {
                if (perfil == null) {
                    return;
                }

                nombre.setText("Sin nombre".equals(perfil.nombre) ? "" : perfil.nombre);
                apellido.setText("Sin apellido".equals(perfil.apellido) ? "" : perfil.apellido);
                avatarActual = perfil.avatar;
                Imagenes.cargar(foto, perfil.avatar, R.drawable.avatar_vacio);
            }

            @Override
            public void fallo(String mensaje) {
                mostrar(mensaje);
            }
        });
    }

    private void subirFoto(Uri elegida) {
        if (elegida == null) {
            return;
        }

        foto.setImageURI(elegida);
        guardar.setEnabled(false);
        guardar.setText("Subiendo foto...");

        String ruta = Supabase.miId() + "/" + System.currentTimeMillis() + ".jpg";

        Supabase.ejecutar(() -> {
            byte[] datos = Imagenes.comprimir(this, elegida, 512);
            return Supabase.subirImagen("avatares", ruta, datos);
        }, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String url) {
                avatarActual = url;
                guardar.setEnabled(true);
                guardar.setText("Guardar");
                Toast.makeText(PerfilActivity.this,
                        "Foto lista, toca Guardar", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void fallo(String mensaje) {
                guardar.setEnabled(true);
                guardar.setText("Guardar");
                mostrar(mensaje);
            }
        });
    }

    private void guardar() {
        String minombre = nombre.getText().toString().trim();
        String miapellido = apellido.getText().toString().trim();

        if (minombre.length() < 2) {
            mostrar("Escribe tu nombre");
            return;
        }

        if (miapellido.isEmpty()) {
            mostrar("Escribe tu apellido");
            return;
        }

        guardar.setEnabled(false);
        guardar.setText("Guardando...");
        aviso.setVisibility(View.GONE);

        String miId = Supabase.miId();

        Supabase.ejecutar(() -> {
            JSONObject cambios = new JSONObject();
            cambios.put("nombre", minombre);
            cambios.put("apellido", miapellido);
            cambios.put("foto_perfil", avatarActual.isEmpty() ? JSONObject.NULL : avatarActual);
            return Supabase.actualizar("/profiles?id_profile=eq." + miId, cambios);
        }, new Supabase.Respuesta<JSONArray>() {
            @Override
            public void listo(JSONArray filas) {
                guardar.setEnabled(true);
                guardar.setText("Guardar");

                if (nuevo) {
                    Intent viaje = new Intent(PerfilActivity.this, MainActivity.class);
                    viaje.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(viaje);
                }

                Toast.makeText(PerfilActivity.this, "Perfil guardado", Toast.LENGTH_SHORT).show();
                finish();
            }

            @Override
            public void fallo(String mensaje) {
                guardar.setEnabled(true);
                guardar.setText("Guardar");
                mostrar(mensaje);
            }
        });
    }

    private void mostrar(String mensaje) {
        aviso.setText(mensaje);
        aviso.setVisibility(View.VISIBLE);
    }
}
