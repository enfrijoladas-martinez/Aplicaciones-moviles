package com.example.clonewhatsapp;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class ContactosActivity extends AppCompatActivity {

    private ContactoAdapter adaptador;
    private TextView vacio;
    private View cargando;
    private boolean abriendo = false;

    private final Handler espera = new Handler(Looper.getMainLooper());
    private Runnable busquedaPendiente;

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_contactos);
        Bordes.ajustar(this);

        vacio = findViewById(R.id.vacio);
        cargando = findViewById(R.id.cargando);

        RecyclerView lista = findViewById(R.id.lista);
        lista.setLayoutManager(new LinearLayoutManager(this));
        adaptador = new ContactoAdapter(false, this::iniciarChat);
        lista.setAdapter(adaptador);

        findViewById(R.id.atras).setOnClickListener(v -> finish());

        findViewById(R.id.nuevoGrupo).setOnClickListener(v -> {
            startActivity(new Intent(this, GrupoActivity.class));
            finish();
        });

        EditText buscar = findViewById(R.id.buscar);
        buscar.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int inicio, int antes, int cuenta) {
            }

            @Override
            public void onTextChanged(CharSequence s, int inicio, int antes, int cuenta) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (busquedaPendiente != null) {
                    espera.removeCallbacks(busquedaPendiente);
                }

                busquedaPendiente = () -> buscarUsuarios(s.toString().trim());
                espera.postDelayed(busquedaPendiente, 350);
            }
        });

        buscarUsuarios("");
    }

    static List<Perfil> consultarUsuarios(String texto) throws Exception {
        StringBuilder ruta = new StringBuilder("/profiles?select=id,name,email,avatar_url,last_seen")
                .append("&id=neq.").append(Supabase.miId())
                .append("&order=name.asc&limit=100");

        if (!texto.isEmpty()) {
            String patron = Supabase.codificar("*" + texto.replace(",", " ") + "*");
            ruta.append("&or=(name.ilike.").append(patron)
                    .append(",email.ilike.").append(patron).append(")");
        }

        JSONArray filas = Supabase.consultar(ruta.toString());
        List<Perfil> perfiles = new ArrayList<>();

        for (int i = 0; i < filas.length(); i++) {
            perfiles.add(Perfil.desdeJson(filas.getJSONObject(i)));
        }

        return perfiles;
    }

    private void buscarUsuarios(String texto) {
        cargando.setVisibility(View.VISIBLE);

        Supabase.ejecutar(() -> consultarUsuarios(texto), new Supabase.Respuesta<List<Perfil>>() {
            @Override
            public void listo(List<Perfil> perfiles) {
                cargando.setVisibility(View.GONE);
                adaptador.poner(perfiles);
                vacio.setVisibility(perfiles.isEmpty() ? View.VISIBLE : View.GONE);
            }

            @Override
            public void fallo(String mensaje) {
                cargando.setVisibility(View.GONE);
                Toast.makeText(ContactosActivity.this, mensaje, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void iniciarChat(Perfil perfil) {
        if (abriendo) {
            return;
        }

        abriendo = true;

        Supabase.ejecutar(() -> {
            JSONObject argumentos = new JSONObject();
            argumentos.put("otro", perfil.id);
            return Supabase.rpc("crear_conversacion_individual", argumentos)
                    .replace("\"", "").trim();
        }, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String idConversacion) {
                Intent viaje = new Intent(ContactosActivity.this, ChatActivity.class);
                viaje.putExtra(ChatActivity.ID, idConversacion);
                viaje.putExtra(ChatActivity.TITULO,
                        perfil.nombre.isEmpty() ? perfil.correo : perfil.nombre);
                viaje.putExtra(ChatActivity.AVATAR, perfil.avatar);
                viaje.putExtra(ChatActivity.OTRO, perfil.id);
                viaje.putExtra(ChatActivity.GRUPO, false);
                startActivity(viaje);
                finish();
            }

            @Override
            public void fallo(String mensaje) {
                abriendo = false;
                Toast.makeText(ContactosActivity.this, mensaje, Toast.LENGTH_LONG).show();
            }
        });
    }
}
