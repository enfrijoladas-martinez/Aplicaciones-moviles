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

import java.util.List;

public class GrupoActivity extends AppCompatActivity {

    private ContactoAdapter adaptador;
    private EditText nombreGrupo;
    private TextView contador;
    private View cargando;
    private View crear;

    private final Handler espera = new Handler(Looper.getMainLooper());
    private Runnable busquedaPendiente;

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);
        setContentView(R.layout.activity_grupo);
        Bordes.ajustar(this);

        nombreGrupo = findViewById(R.id.nombreGrupo);
        contador = findViewById(R.id.contador);
        cargando = findViewById(R.id.cargando);
        crear = findViewById(R.id.crear);

        RecyclerView lista = findViewById(R.id.lista);
        lista.setLayoutManager(new LinearLayoutManager(this));
        adaptador = new ContactoAdapter(true, perfil -> actualizarContador());
        lista.setAdapter(adaptador);

        findViewById(R.id.atras).setOnClickListener(v -> finish());
        crear.setOnClickListener(v -> crearGrupo());

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

                busquedaPendiente = () -> cargar(s.toString().trim());
                espera.postDelayed(busquedaPendiente, 350);
            }
        });

        cargar("");
    }

    private void cargar(String texto) {
        cargando.setVisibility(View.VISIBLE);

        Supabase.ejecutar(() -> ContactosActivity.consultarUsuarios(texto),
                new Supabase.Respuesta<List<Perfil>>() {
                    @Override
                    public void listo(List<Perfil> perfiles) {
                        cargando.setVisibility(View.GONE);
                        adaptador.poner(perfiles);
                    }

                    @Override
                    public void fallo(String mensaje) {
                        cargando.setVisibility(View.GONE);
                        Toast.makeText(GrupoActivity.this, mensaje, Toast.LENGTH_LONG).show();
                    }
                });
    }

    private void actualizarContador() {
        int elegidos = adaptador.getElegidos().size();
        contador.setText(elegidos == 0
                ? "Elige a los participantes"
                : elegidos + (elegidos == 1 ? " participante" : " participantes"));
    }

    private void crearGrupo() {
        String nombre = nombreGrupo.getText().toString().trim();
        List<String> miembros = adaptador.getElegidos();

        if (nombre.isEmpty()) {
            nombreGrupo.setError("Ponle nombre al grupo");
            return;
        }

        if (miembros.size() < 2) {
            Toast.makeText(this, "Elige al menos 2 participantes", Toast.LENGTH_SHORT).show();
            return;
        }

        crear.setEnabled(false);

        Supabase.ejecutar(() -> {
            JSONObject argumentos = new JSONObject();
            argumentos.put("nombre_grupo", nombre);
            argumentos.put("miembros", new JSONArray(miembros));
            return Supabase.rpc("crear_grupo", argumentos).replace("\"", "").trim();
        }, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String idConversacion) {
                Intent viaje = new Intent(GrupoActivity.this, ChatActivity.class);
                viaje.putExtra(ChatActivity.ID, idConversacion);
                viaje.putExtra(ChatActivity.TITULO, nombre);
                viaje.putExtra(ChatActivity.GRUPO, true);
                startActivity(viaje);
                finish();
            }

            @Override
            public void fallo(String mensaje) {
                crear.setEnabled(true);
                Toast.makeText(GrupoActivity.this, mensaje, Toast.LENGTH_LONG).show();
            }
        });
    }
}
