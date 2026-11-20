package com.example.clonewhatsapp;

import android.app.Dialog;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ChatActivity extends AppCompatActivity {

    public static final String ID = "conversacion_id";
    public static final String TITULO = "titulo";
    public static final String AVATAR = "avatar";
    public static final String OTRO = "otro_id";
    public static final String GRUPO = "es_grupo";

    private static final long ESCRIBIENDO_DURA = 3500;
    private static final long AVISO_ESCRITURA_CADA = 2000;
    private static final long REVISAR_CONEXION_CADA = 30000;

    private String conversacionId;
    private String otroId;
    private boolean esGrupo;
    private String miId;
    private String miNombre = "";

    private RecyclerView lista;
    private MensajeAdapter adaptador;
    private EditText entrada;
    private TextView estado;
    private TextView vacio;
    private View cargando;
    private View barra;
    private View barraBusqueda;
    private EditText textoBusqueda;

    private Realtime realtime;
    private final Map<String, String> nombres = new HashMap<>();
    private final Handler reloj = new Handler(Looper.getMainLooper());

    private String textoEstado = "";
    private long ultimoAvisoEscritura = 0;
    private boolean otroEscribiendo = false;

    private final Runnable quitarEscribiendo = () -> {
        otroEscribiendo = false;
        pintarEstado(textoEstado);
    };

    private final Runnable revisarConexion = new Runnable() {
        @Override
        public void run() {
            consultarConexion();
            reloj.postDelayed(this, REVISAR_CONEXION_CADA);
        }
    };

    private final OnBackPressedCallback cerrarBusqueda = new OnBackPressedCallback(false) {
        @Override
        public void handleOnBackPressed() {
            abrirBusqueda(false);
        }
    };

    private final ActivityResultLauncher<String> elegirImagen =
            registerForActivityResult(new ActivityResultContracts.GetContent(), this::enviarImagen);

    @Override
    protected void onCreate(@Nullable Bundle guardado) {
        super.onCreate(guardado);
        setContentView(R.layout.activity_chat);
        Bordes.ajustar(this);

        conversacionId = getIntent().getStringExtra(ID);
        otroId = getIntent().getStringExtra(OTRO);
        esGrupo = getIntent().getBooleanExtra(GRUPO, false);
        miId = Supabase.miId();

        if (conversacionId == null || conversacionId.isEmpty()) {
            finish();
            return;
        }

        TextView titulo = findViewById(R.id.titulo);
        titulo.setText(getIntent().getStringExtra(TITULO));

        ImageView avatar = findViewById(R.id.avatar);
        Imagenes.cargar(avatar, getIntent().getStringExtra(AVATAR),
                esGrupo ? R.drawable.avatar_grupo : R.drawable.avatar_vacio);

        estado = findViewById(R.id.estado);
        vacio = findViewById(R.id.vacio);
        cargando = findViewById(R.id.cargando);
        entrada = findViewById(R.id.entrada);
        barra = findViewById(R.id.barra);
        barraBusqueda = findViewById(R.id.barraBusqueda);
        textoBusqueda = findViewById(R.id.textoBusqueda);

        lista = findViewById(R.id.mensajes);
        LinearLayoutManager acomodo = new LinearLayoutManager(this);
        acomodo.setStackFromEnd(true);
        lista.setLayoutManager(acomodo);

        adaptador = new MensajeAdapter(miId, esGrupo, nombres, new MensajeAdapter.Acciones() {
            @Override
            public void verImagen(String url) {
                mostrarImagen(url);
            }

            @Override
            public void eliminar(Mensaje mensaje) {
                confirmarEliminar(mensaje);
            }
        });
        lista.setAdapter(adaptador);

        findViewById(R.id.atras).setOnClickListener(v -> finish());
        findViewById(R.id.enviar).setOnClickListener(v -> enviarTexto());
        findViewById(R.id.adjuntar).setOnClickListener(v -> elegirImagen.launch("image/*"));
        findViewById(R.id.botonBuscar).setOnClickListener(v -> abrirBusqueda(true));
        findViewById(R.id.cerrarBusqueda).setOnClickListener(v -> abrirBusqueda(false));
        findViewById(R.id.ejecutarBusqueda).setOnClickListener(v -> buscarMensajes());
        getOnBackPressedDispatcher().addCallback(this, cerrarBusqueda);

        textoBusqueda.setOnEditorActionListener((vista, accion, evento) -> {
            if (accion == EditorInfo.IME_ACTION_SEARCH) {
                buscarMensajes();
                return true;
            }
            return false;
        });

        entrada.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int inicio, int antes, int cuenta) {
            }

            @Override
            public void onTextChanged(CharSequence s, int inicio, int antes, int cuenta) {
                avisarQueEscribo(s.length() > 0);
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        realtime = new Realtime("chat:" + conversacionId,
                "conversation_id=eq." + conversacionId, new Realtime.Oyente() {
            @Override
            public void cambio(String tipo, JSONObject registro) {
                recibirCambio(registro);
            }

            @Override
            public void difusion(String evento, JSONObject datos) {
                if ("typing".equals(evento)) {
                    mostrarEscribiendo(datos);
                }
            }
        });

        cargarParticipantes();
    }

    @Override
    protected void onStart() {
        super.onStart();

        if (realtime != null) {
            realtime.conectar();
            cargarMensajes();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Presencia.entrar();
        reloj.post(revisarConexion);
    }

    @Override
    protected void onPause() {
        super.onPause();
        Presencia.salir();
        reloj.removeCallbacks(revisarConexion);
    }

    @Override
    protected void onStop() {
        super.onStop();

        if (realtime != null) {
            realtime.cerrar();
        }
    }

    private void cargarParticipantes() {
        Supabase.ejecutar(() -> Supabase.consultar(
                        "/conversation_members?select=user_id,profiles(name,last_seen)"
                                + "&conversation_id=eq." + conversacionId),
                new Supabase.Respuesta<JSONArray>() {
                    @Override
                    public void listo(JSONArray filas) {
                        List<String> otros = new ArrayList<>();

                        for (int i = 0; i < filas.length(); i++) {
                            JSONObject fila = filas.optJSONObject(i);
                            JSONObject perfil = fila.optJSONObject("profiles");
                            String id = fila.optString("user_id");
                            String nombre = perfil == null ? "" : Perfil.texto(perfil, "name");

                            nombres.put(id, nombre);

                            if (id.equals(miId)) {
                                miNombre = nombre;
                            } else {
                                otros.add(nombre);

                                if (!esGrupo && (otroId == null || otroId.isEmpty())) {
                                    otroId = id;
                                }
                            }
                        }

                        if (esGrupo) {
                            textoEstado = "Tu, " + String.join(", ", otros);
                            pintarEstado(textoEstado);
                        }

                        adaptador.notifyDataSetChanged();
                        consultarConexion();
                    }

                    @Override
                    public void fallo(String mensaje) {
                        revisarSesion(mensaje);
                    }
                });
    }

    private void consultarConexion() {
        if (esGrupo || otroId == null || otroId.isEmpty()) {
            return;
        }

        Supabase.ejecutar(() -> Supabase.consultar(
                        "/profiles?select=last_seen&id=eq." + otroId),
                new Supabase.Respuesta<JSONArray>() {
                    @Override
                    public void listo(JSONArray filas) {
                        if (filas.length() == 0) {
                            return;
                        }

                        textoEstado = Fechas.ultimaConexion(
                                Perfil.texto(filas.optJSONObject(0), "last_seen"));

                        if (!otroEscribiendo) {
                            pintarEstado(textoEstado);
                        }
                    }

                    @Override
                    public void fallo(String mensaje) {
                    }
                });
    }

    private void pintarEstado(String texto) {
        estado.setText(texto);
        estado.setVisibility(texto == null || texto.isEmpty() ? View.GONE : View.VISIBLE);
    }

    private void cargarMensajes() {
        Supabase.ejecutar(() -> {
            JSONArray filas = Supabase.consultar("/messages?select=*,sender:profiles(name)"
                    + "&conversation_id=eq." + conversacionId
                    + "&order=created_at.desc&limit=300");

            List<Mensaje> mensajes = new ArrayList<>();

            for (int i = filas.length() - 1; i >= 0; i--) {
                mensajes.add(new Mensaje(filas.getJSONObject(i)));
            }

            return mensajes;
        }, new Supabase.Respuesta<List<Mensaje>>() {
            @Override
            public void listo(List<Mensaje> mensajes) {
                cargando.setVisibility(View.GONE);
                adaptador.poner(mensajes);
                vacio.setVisibility(mensajes.isEmpty() ? View.VISIBLE : View.GONE);
                bajar();
                marcarLeidos();
            }

            @Override
            public void fallo(String mensaje) {
                cargando.setVisibility(View.GONE);
                revisarSesion(mensaje);
            }
        });
    }

    private void recibirCambio(JSONObject registro) {
        Mensaje mensaje = new Mensaje(registro);

        if (!conversacionId.equals(mensaje.conversacionId)) {
            return;
        }

        boolean nuevo = adaptador.posicionDe(mensaje.id) < 0;
        int posicion = adaptador.agregarOActualizar(mensaje);
        vacio.setVisibility(View.GONE);

        if (nuevo) {
            lista.smoothScrollToPosition(posicion);
        }

        if (!mensaje.esMio(miId) && !Mensaje.LEIDO.equals(mensaje.estado)) {
            reloj.removeCallbacks(quitarEscribiendo);
            otroEscribiendo = false;
            pintarEstado(textoEstado);
            marcarLeidos();
        }
    }

    private void marcarLeidos() {
        Supabase.ejecutar(() -> {
            JSONObject argumentos = new JSONObject();
            argumentos.put("conv", conversacionId);
            return Supabase.rpc("marcar_leidos", argumentos);
        }, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String dato) {
            }

            @Override
            public void fallo(String mensaje) {
            }
        });
    }

    private void enviarTexto() {
        String texto = entrada.getText().toString().trim();

        if (texto.isEmpty()) {
            return;
        }

        entrada.setText("");
        insertar(texto, null, () -> entrada.setText(texto));
    }

    private void enviarImagen(Uri elegida) {
        if (elegida == null) {
            return;
        }

        Toast.makeText(this, "Enviando foto...", Toast.LENGTH_SHORT).show();

        String ruta = conversacionId + "/" + UUID.randomUUID() + ".jpg";
        String pie = entrada.getText().toString().trim();
        entrada.setText("");

        Supabase.ejecutar(() -> {
            byte[] datos = Imagenes.comprimir(this, elegida, 1280);
            return Supabase.subirImagen("chat-images", ruta, datos);
        }, new Supabase.Respuesta<String>() {
            @Override
            public void listo(String url) {
                insertar(pie, url, () -> entrada.setText(pie));
            }

            @Override
            public void fallo(String mensaje) {
                entrada.setText(pie);
                Toast.makeText(ChatActivity.this, mensaje, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void insertar(String texto, String imagen, Runnable siFalla) {
        Supabase.ejecutar(() -> {
            JSONObject fila = new JSONObject();
            fila.put("conversation_id", conversacionId);
            fila.put("sender_id", miId);
            fila.put("content", texto == null ? "" : texto);

            if (imagen != null) {
                fila.put("image_url", imagen);
            }

            return new Mensaje(Supabase.insertar("messages", fila));
        }, new Supabase.Respuesta<Mensaje>() {
            @Override
            public void listo(Mensaje mensaje) {
                int posicion = adaptador.agregarOActualizar(mensaje);
                vacio.setVisibility(View.GONE);
                lista.smoothScrollToPosition(posicion);
            }

            @Override
            public void fallo(String mensaje) {
                siFalla.run();
                revisarSesion(mensaje);
            }
        });
    }

    private void avisarQueEscribo(boolean escribiendo) {
        long ahora = System.currentTimeMillis();

        if (!escribiendo || ahora - ultimoAvisoEscritura < AVISO_ESCRITURA_CADA) {
            return;
        }

        ultimoAvisoEscritura = ahora;

        try {
            JSONObject datos = new JSONObject();
            datos.put("user_id", miId);
            datos.put("name", miNombre);
            realtime.difundir("typing", datos);
        } catch (Exception ignorado) {
        }
    }

    private void mostrarEscribiendo(JSONObject datos) {
        if (miId.equals(datos.optString("user_id"))) {
            return;
        }

        String nombre = datos.optString("name", "");
        otroEscribiendo = true;

        pintarEstado(esGrupo && !nombre.isEmpty()
                ? nombre + " esta escribiendo..."
                : "escribiendo...");

        reloj.removeCallbacks(quitarEscribiendo);
        reloj.postDelayed(quitarEscribiendo, ESCRIBIENDO_DURA);
    }

    private void confirmarEliminar(Mensaje mensaje) {
        new AlertDialog.Builder(this)
                .setTitle("Eliminar mensaje")
                .setMessage("Se eliminara para todos los participantes del chat.")
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Eliminar", (dialogo, cual) -> eliminar(mensaje))
                .show();
    }

    private void eliminar(Mensaje mensaje) {
        Supabase.ejecutar(() -> {
            JSONObject cambios = new JSONObject();
            cambios.put("deleted", true);
            cambios.put("content", "");
            cambios.put("image_url", JSONObject.NULL);

            JSONArray filas = Supabase.actualizar("/messages?id=eq." + mensaje.id
                    + "&sender_id=eq." + miId, cambios);

            if (filas.length() == 0) {
                throw new Exception("No se pudo eliminar el mensaje");
            }

            return new Mensaje(filas.getJSONObject(0));
        }, new Supabase.Respuesta<Mensaje>() {
            @Override
            public void listo(Mensaje actualizado) {
                adaptador.agregarOActualizar(actualizado);
            }

            @Override
            public void fallo(String error) {
                Toast.makeText(ChatActivity.this, error, Toast.LENGTH_LONG).show();
            }
        });
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
            adaptador.resaltar("");
            teclado.hideSoftInputFromWindow(textoBusqueda.getWindowToken(), 0);
        }
    }

    private void buscarMensajes() {
        String texto = textoBusqueda.getText().toString().trim();

        if (texto.isEmpty()) {
            return;
        }

        Supabase.ejecutar(() -> {
            JSONArray filas = Supabase.consultar("/messages?select=*"
                    + "&conversation_id=eq." + conversacionId
                    + "&deleted=is.false"
                    + "&content=ilike." + Supabase.codificar("*" + texto + "*")
                    + "&order=created_at.desc&limit=50");

            List<Mensaje> encontrados = new ArrayList<>();

            for (int i = 0; i < filas.length(); i++) {
                encontrados.add(new Mensaje(filas.getJSONObject(i)));
            }

            return encontrados;
        }, new Supabase.Respuesta<List<Mensaje>>() {
            @Override
            public void listo(List<Mensaje> encontrados) {
                mostrarResultados(texto, encontrados);
            }

            @Override
            public void fallo(String mensaje) {
                Toast.makeText(ChatActivity.this, mensaje, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void mostrarResultados(String texto, List<Mensaje> encontrados) {
        if (encontrados.isEmpty()) {
            Toast.makeText(this, "No hay mensajes con \"" + texto + "\"", Toast.LENGTH_SHORT).show();
            return;
        }

        String[] renglones = new String[encontrados.size()];

        for (int i = 0; i < encontrados.size(); i++) {
            Mensaje mensaje = encontrados.get(i);
            String autor = mensaje.esMio(miId) ? "Tu" : nombres.getOrDefault(mensaje.remitenteId, "");
            renglones[i] = Fechas.corta(mensaje.fecha) + "  " + autor + ": " + mensaje.contenido;
        }

        new AlertDialog.Builder(this)
                .setTitle(encontrados.size() + " resultado(s)")
                .setItems(renglones, (dialogo, cual) -> irAMensaje(encontrados.get(cual).id))
                .setNegativeButton("Cerrar", null)
                .show();
    }

    private void irAMensaje(String id) {
        int posicion = adaptador.posicionDe(id);

        if (posicion < 0) {
            Toast.makeText(this, "Ese mensaje es muy antiguo para mostrarlo", Toast.LENGTH_SHORT).show();
            return;
        }

        adaptador.resaltar(id);
        lista.scrollToPosition(posicion);
    }

    private void mostrarImagen(String url) {
        Dialog dialogo = new Dialog(this, android.R.style.Theme_Black_NoTitleBar_Fullscreen);
        dialogo.setContentView(R.layout.dialogo_imagen);

        ImageView imagen = dialogo.findViewById(R.id.imagenCompleta);
        Imagenes.cargar(imagen, url, android.R.color.black);

        dialogo.findViewById(R.id.cerrar).setOnClickListener(v -> dialogo.dismiss());
        dialogo.show();
    }

    private void bajar() {
        if (adaptador.getItemCount() > 0) {
            lista.scrollToPosition(adaptador.getItemCount() - 1);
        }
    }

    private void revisarSesion(String mensaje) {
        if (Supabase.SESION_VENCIDA.equals(mensaje)) {
            LoginActivity.volver(this, mensaje);
            return;
        }

        Toast.makeText(this, mensaje, Toast.LENGTH_LONG).show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        reloj.removeCallbacksAndMessages(null);
    }
}
