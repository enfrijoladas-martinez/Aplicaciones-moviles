package com.example.clonewhatsapp;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private ConversacionAdapter adaptador;
    private TextView vacio;
    private View cargando;
    private View barra;
    private View barraBusqueda;
    private EditText textoBusqueda;
    private Realtime realtime;
    private String miId;

    private final ActivityResultLauncher<String> pedirPermiso =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), concedido -> {
            });

    private final OnBackPressedCallback cerrarBusqueda = new OnBackPressedCallback(false) {
        @Override
        public void handleOnBackPressed() {
            abrirBusqueda(false);
        }
    };

    @Override
    protected void onCreate(@Nullable Bundle estado) {
        super.onCreate(estado);

        if (!Sesion.recuperar(this).hayToken()) {
            LoginActivity.volver(this, null);
            return;
        }

        setContentView(R.layout.activity_main);
        Bordes.ajustar(this);

        miId = Supabase.miId();

        vacio = findViewById(R.id.vacio);
        cargando = findViewById(R.id.cargando);
        barra = findViewById(R.id.barra);
        barraBusqueda = findViewById(R.id.barraBusqueda);
        textoBusqueda = findViewById(R.id.textoBusqueda);

        RecyclerView lista = findViewById(R.id.listaChats);
        lista.setLayoutManager(new LinearLayoutManager(this));
        lista.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));

        adaptador = new ConversacionAdapter(miId, this::abrirChat);
        lista.setAdapter(adaptador);

        findViewById(R.id.nuevoChat).setOnClickListener(v ->
                startActivity(new Intent(this, ContactosActivity.class)));

        findViewById(R.id.botonMenu).setOnClickListener(this::mostrarMenu);
        findViewById(R.id.botonBuscar).setOnClickListener(v -> abrirBusqueda(true));
        findViewById(R.id.cerrarBusqueda).setOnClickListener(v -> abrirBusqueda(false));
        getOnBackPressedDispatcher().addCallback(this, cerrarBusqueda);

        textoBusqueda.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int inicio, int antes, int cuenta) {
            }

            @Override
            public void onTextChanged(CharSequence s, int inicio, int antes, int cuenta) {
                adaptador.filtrar(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        pedirPermisoNotificaciones();
        Notificaciones.registrarToken();

        realtime = new Realtime("chats:" + miId, null, new Realtime.Oyente() {
            @Override
            public void cambio(String tipo, JSONObject registro) {
                if ("INSERT".equals(tipo) && !miId.equals(registro.optString("id_remitente"))) {
                    marcarRecibidos();
                } else {
                    cargar();
                }
            }

            @Override
            public void difusion(String evento, JSONObject datos) {
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();

        if (realtime != null) {
            realtime.conectar();
            marcarRecibidos();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Presencia.entrar();
    }

    @Override
    protected void onPause() {
        super.onPause();
        Presencia.salir();
    }

    @Override
    protected void onStop() {
        super.onStop();

        if (realtime != null) {
            realtime.cerrar();
        }
    }

    private void marcarRecibidos() {
        Supabase.ejecutar(() -> Supabase.rpc("marcar_recibidos", null),
                new Supabase.Respuesta<String>() {
                    @Override
                    public void listo(String dato) {
                        cargar();
                    }

                    @Override
                    public void fallo(String mensaje) {
                        cargar();
                    }
                });
    }

    private void cargar() {
        Supabase.ejecutar(() -> {
            JSONArray filas = new JSONArray(Supabase.rpc("mis_chats", null));
            List<Conversacion> conversaciones = new ArrayList<>();

            for (int i = 0; i < filas.length(); i++) {
                conversaciones.add(new Conversacion(filas.getJSONObject(i)));
            }

            return conversaciones;
        }, new Supabase.Respuesta<List<Conversacion>>() {
            @Override
            public void listo(List<Conversacion> conversaciones) {
                cargando.setVisibility(View.GONE);
                adaptador.poner(conversaciones);
                vacio.setVisibility(conversaciones.isEmpty() ? View.VISIBLE : View.GONE);
            }

            @Override
            public void fallo(String mensaje) {
                cargando.setVisibility(View.GONE);

                if (Supabase.SESION_VENCIDA.equals(mensaje)) {
                    LoginActivity.volver(MainActivity.this, mensaje);
                    return;
                }

                Toast.makeText(MainActivity.this, mensaje, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void abrirChat(Conversacion conversacion) {
        Intent viaje = new Intent(this, ChatActivity.class);
        viaje.putExtra(ChatActivity.ID, conversacion.id);
        viaje.putExtra(ChatActivity.TITULO, conversacion.tituloVisible());
        viaje.putExtra(ChatActivity.AVATAR, conversacion.avatar);
        viaje.putExtra(ChatActivity.OTRO, conversacion.otroId);
        viaje.putExtra(ChatActivity.GRUPO, conversacion.esGrupo);
        startActivity(viaje);
    }

    private void abrirBusqueda(boolean abrir) {
        barra.setVisibility(abrir ? View.GONE : View.VISIBLE);
        barraBusqueda.setVisibility(abrir ? View.VISIBLE : View.GONE);
        cerrarBusqueda.setEnabled(abrir);

        InputMethodManager teclado = getSystemService(InputMethodManager.class);

        if (abrir) {
            textoBusqueda.requestFocus();
            teclado.showSoftInput(textoBusqueda, InputMethodManager.SHOW_IMPLICIT);
        } else {
            textoBusqueda.setText("");
            teclado.hideSoftInputFromWindow(textoBusqueda.getWindowToken(), 0);
        }
    }

    private void mostrarMenu(View ancla) {
        PopupMenu menu = new PopupMenu(this, ancla);
        menu.getMenuInflater().inflate(R.menu.menu_principal, menu.getMenu());

        menu.setOnMenuItemClickListener(opcion -> {
            int id = opcion.getItemId();

            if (id == R.id.menuGrupo) {
                startActivity(new Intent(this, GrupoActivity.class));
            } else if (id == R.id.menuPerfil) {
                startActivity(new Intent(this, PerfilActivity.class));
            } else if (id == R.id.menuSalir) {
                confirmarSalida();
            }
            return true;
        });

        menu.show();
    }

    private void confirmarSalida() {
        new AlertDialog.Builder(this)
                .setTitle("Cerrar sesion")
                .setMessage("Vas a salir de tu cuenta en este telefono.")
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Salir", (dialogo, cual) ->
                        Notificaciones.quitarToken(() ->
                                Supabase.salir(this, new Supabase.Respuesta<String>() {
                                    @Override
                                    public void listo(String dato) {
                                        LoginActivity.volver(MainActivity.this, null);
                                    }

                                    @Override
                                    public void fallo(String mensaje) {
                                        LoginActivity.volver(MainActivity.this, null);
                                    }
                                })))
                .show();
    }

    private void pedirPermisoNotificaciones() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            pedirPermiso.launch(Manifest.permission.POST_NOTIFICATIONS);
        }
    }
}
