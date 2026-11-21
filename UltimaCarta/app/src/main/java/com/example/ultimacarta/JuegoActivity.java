package com.example.ultimacarta;

import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.HapticFeedbackConstants;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class JuegoActivity extends AppCompatActivity {

    public static final String NOMBRE = "nombre";
    public static final String RIVALES = "rivales";
    public static final String NIVEL = "nivel";

    private static final String[] NOMBRES_BOTS = {"Luna", "Toño", "Mar"};
    private static final long PAUSA_BOT = 1100;
    private static final long PAUSA_ROBADA = 750;

    private final Handler reloj = new Handler(Looper.getMainLooper());
    private final Random azar = new Random();
    private final List<View> tarjetasRivales = new ArrayList<>();

    private Partida partida;
    private Bot bot;
    private Jugador yo;

    private TextView estado;
    private TextView sentido;
    private TextView mensaje;
    private TextView colorActual;
    private TextView cuantasMazo;
    private TextView miNombre;
    private CartaView mazo;
    private CartaView descarte;
    private LinearLayout mano;
    private HorizontalScrollView desplazamiento;
    private Button botonUltima;
    private Button botonPasar;

    private boolean finMostrado = false;
    private int ultimaCartaArriba = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_juego);

        estado = findViewById(R.id.estado);
        sentido = findViewById(R.id.sentido);
        mensaje = findViewById(R.id.mensaje);
        colorActual = findViewById(R.id.colorActual);
        cuantasMazo = findViewById(R.id.cuantasMazo);
        miNombre = findViewById(R.id.miNombre);
        mazo = findViewById(R.id.mazo);
        descarte = findViewById(R.id.descarte);
        mano = findViewById(R.id.mano);
        desplazamiento = findViewById(R.id.desplazamiento);
        botonUltima = findViewById(R.id.ultima);
        botonPasar = findViewById(R.id.pasar);

        mazo.mostrarReverso();
        mazo.setOnClickListener(v -> robar());
        botonPasar.setOnClickListener(v -> pasar());
        botonUltima.setOnClickListener(v -> gritarUltima());
        findViewById(R.id.salir).setOnClickListener(v -> confirmarSalida());

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                confirmarSalida();
            }
        });

        empezar();
    }

    private void empezar() {
        reloj.removeCallbacksAndMessages(null);
        finMostrado = false;
        ultimaCartaArriba = -1;

        String nombre = getIntent().getStringExtra(NOMBRE);
        int rivales = getIntent().getIntExtra(RIVALES, 2);
        int nivel = getIntent().getIntExtra(NIVEL, Bot.NORMAL);

        List<Jugador> jugadores = new ArrayList<>();
        yo = new Jugador(nombre == null || nombre.isEmpty() ? "Jugador" : nombre, true);
        jugadores.add(yo);

        for (int i = 0; i < rivales; i++) {
            jugadores.add(new Jugador(NOMBRES_BOTS[i], false));
        }

        partida = new Partida(jugadores, azar);
        bot = new Bot(nivel, azar);
        miNombre.setText(yo.nombre);

        armarRivales();
        mostrarMensaje(partida.jugadorEnTurno() == yo
                ? "Empiezas tú. Tira una carta que combine."
                : "Empieza " + partida.jugadorEnTurno().nombre + ".");
        actualizar();
        programarBot();
    }

    private void armarRivales() {
        LinearLayout contenedor = findViewById(R.id.rivales);
        contenedor.removeAllViews();
        tarjetasRivales.clear();

        LayoutInflater inflador = LayoutInflater.from(this);

        for (Jugador jugador : partida.getJugadores()) {
            if (jugador == yo) {
                continue;
            }

            View tarjeta = inflador.inflate(R.layout.item_rival, contenedor, false);
            ((CartaView) tarjeta.findViewById(R.id.reverso)).mostrarReverso();
            ((TextView) tarjeta.findViewById(R.id.nombre)).setText(jugador.nombre);
            tarjeta.setTag(jugador);
            contenedor.addView(tarjeta);
            tarjetasRivales.add(tarjeta);
        }
    }

    private void actualizar() {
        Jugador enTurno = partida.jugadorEnTurno();
        boolean miTurno = enTurno == yo && !partida.terminada();

        Carta arriba = partida.cartaArriba();
        descarte.mostrar(arriba, partida.getColorActual());

        if (arriba.id != ultimaCartaArriba) {
            if (ultimaCartaArriba != -1) {
                animarDescarte();
            }
            ultimaCartaArriba = arriba.id;
        }

        ColorCarta color = partida.getColorActual();
        colorActual.setText("Color: " + color.nombre);
        colorActual.setBackgroundTintList(ColorStateList.valueOf(color.argb));

        cuantasMazo.setText(partida.cartasEnMazo() + " en el mazo");
        sentido.setText(partida.getSentido() > 0 ? "Sentido ↻" : "Sentido ↺");

        if (partida.terminada()) {
            estado.setText("Fin de la partida");
        } else {
            estado.setText(miTurno ? "Tu turno" : "Turno de " + enTurno.nombre);
        }

        for (View tarjeta : tarjetasRivales) {
            Jugador jugador = (Jugador) tarjeta.getTag();
            ((TextView) tarjeta.findViewById(R.id.cuantas)).setText(String.valueOf(jugador.mano.size()));
            tarjeta.findViewById(R.id.aviso).setVisibility(
                    jugador.mano.size() == 1 ? View.VISIBLE : View.INVISIBLE);
            tarjeta.setBackgroundResource(jugador == enTurno && !partida.terminada()
                    ? R.drawable.panel_turno : R.drawable.panel);
        }

        mazo.setAlpha(miTurno && !partida.yaRobo() ? 1f : 0.6f);
        botonPasar.setVisibility(miTurno && partida.yaRobo() ? View.VISIBLE : View.GONE);

        boolean puedeGritar = yo.mano.size() == 2 && !yo.avisoUltima && !partida.terminada();
        botonUltima.setEnabled(puedeGritar);
        botonUltima.setText(yo.avisoUltima ? "¡Gritado!" : "¡Última!");

        pintarMano(miTurno);
    }

    private void pintarMano(boolean miTurno) {
        mano.removeAllViews();

        List<Carta> ordenadas = new ArrayList<>(yo.mano);
        Collections.sort(ordenadas, (a, b) -> {
            if (a.color != b.color) {
                return a.color.ordinal() - b.color.ordinal();
            }
            if (a.tipo != b.tipo) {
                return a.tipo.ordinal() - b.tipo.ordinal();
            }
            return a.numero - b.numero;
        });

        float densidad = getResources().getDisplayMetrics().density;
        int ancho = Math.round(68 * densidad);
        int alto = Math.round(102 * densidad);
        int encimado = ordenadas.size() > 7 ? Math.round(-22 * densidad) : Math.round(-8 * densidad);

        for (int i = 0; i < ordenadas.size(); i++) {
            Carta carta = ordenadas.get(i);
            CartaView vista = new CartaView(this);
            vista.mostrar(carta, null);

            LinearLayout.LayoutParams medidas = new LinearLayout.LayoutParams(ancho, alto);
            if (i > 0) {
                medidas.setMarginStart(encimado);
            }
            vista.setLayoutParams(medidas);

            boolean jugable = miTurno && partida.esJugable(yo, carta);

            if (miTurno) {
                vista.setApagada(!jugable);
                vista.setTranslationY(jugable ? -14 * densidad : 0);
            }

            vista.setContentDescription(carta.descripcion());
            vista.setOnClickListener(v -> tocarCarta(carta, vista));
            mano.addView(vista);
        }
    }

    private void tocarCarta(Carta carta, CartaView vista) {
        if (partida.terminada()) {
            return;
        }

        if (partida.jugadorEnTurno() != yo) {
            sacudir(vista);
            mostrarMensaje("Espera tu turno.");
            return;
        }

        if (!partida.esJugable(yo, carta)) {
            sacudir(vista);
            mostrarMensaje(partida.yaRobo()
                    ? "Solo puedes tirar la carta que robaste, o pasar."
                    : "Esa carta no combina con " + partida.cartaArriba().descripcion()
                    + ". El color en juego es " + partida.getColorActual().nombre + ".");
            return;
        }

        vista.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP);

        if (carta.esComodin()) {
            elegirColor(carta);
            return;
        }

        tirar(carta, null);
    }

    private void elegirColor(Carta carta) {
        View contenido = LayoutInflater.from(this).inflate(R.layout.dialogo_color, null);

        AlertDialog dialogo = new AlertDialog.Builder(this)
                .setTitle("Elige el color")
                .setView(contenido)
                .setNegativeButton("Cancelar", null)
                .create();

        int[] botones = {R.id.coral, R.id.ambar, R.id.menta, R.id.indigo};

        for (int i = 0; i < botones.length; i++) {
            ColorCarta color = ColorCarta.JUGABLES[i];
            contenido.findViewById(botones[i]).setOnClickListener(v -> {
                dialogo.dismiss();
                tirar(carta, color);
            });
        }

        dialogo.show();
    }

    private void tirar(Carta carta, ColorCarta color) {
        Jugada jugada = partida.jugar(yo, carta, color);
        mostrarMensaje(jugada.mensaje);
        despuesDeJugada();
    }

    private void robar() {
        if (partida.terminada() || partida.jugadorEnTurno() != yo) {
            return;
        }

        if (partida.yaRobo()) {
            mostrarMensaje("Ya robaste. Tira la carta que robaste o pasa.");
            return;
        }

        Jugada jugada = partida.robar(yo);
        mostrarMensaje(jugada.puedeJugarRobada
                ? "Robaste " + jugada.carta.descripcion() + ". Puedes tirarla o pasar."
                : jugada.mensaje);

        actualizar();
        desplazamiento.post(() -> desplazamiento.fullScroll(View.FOCUS_RIGHT));

        if (!jugada.puedeJugarRobada) {
            programarBot();
        }
    }

    private void pasar() {
        Jugada jugada = partida.pasar(yo);
        mostrarMensaje(jugada.mensaje);
        despuesDeJugada();
    }

    private void gritarUltima() {
        partida.avisarUltima(yo);
        botonUltima.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
        mostrarMensaje("¡" + yo.nombre + " gritó Última!");
        actualizar();
    }

    private void despuesDeJugada() {
        actualizar();

        if (partida.terminada()) {
            reloj.postDelayed(this::mostrarFin, 700);
            return;
        }

        programarBot();
    }

    private void programarBot() {
        if (partida.terminada() || partida.jugadorEnTurno().esHumano) {
            return;
        }

        reloj.postDelayed(this::turnoBot, PAUSA_BOT);
    }

    private void turnoBot() {
        if (partida.terminada()) {
            return;
        }

        Jugador actual = partida.jugadorEnTurno();

        if (actual.esHumano) {
            return;
        }

        Carta carta = bot.elegirCarta(partida, actual);

        if (carta != null) {
            tirarBot(actual, carta);
            return;
        }

        Jugada robo = partida.robar(actual);
        mostrarMensaje(robo.mensaje);
        actualizar();

        if (robo.puedeJugarRobada) {
            reloj.postDelayed(() -> tirarBot(actual, robo.carta), PAUSA_ROBADA);
        } else {
            programarBot();
        }
    }

    private void tirarBot(Jugador actual, Carta carta) {
        if (partida.terminada() || partida.jugadorEnTurno() != actual) {
            return;
        }

        String aviso = "";

        if (actual.mano.size() == 2 && bot.recuerdaGritar()) {
            partida.avisarUltima(actual);
            aviso = actual.nombre + ": ¡Última!\n";
        }

        ColorCarta color = carta.esComodin() ? bot.elegirColor(actual) : null;
        Jugada jugada = partida.jugar(actual, carta, color);
        mostrarMensaje(aviso + jugada.mensaje);
        despuesDeJugada();
    }

    private void mostrarFin() {
        if (finMostrado) {
            return;
        }

        finMostrado = true;

        Jugador ganador = partida.getGanador();
        int puntos = partida.puntosDelGanador();
        boolean gane = ganador == yo;

        SharedPreferences preferencias = getSharedPreferences(MenuActivity.PREFERENCIAS, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferencias.edit()
                .putInt("jugadas", preferencias.getInt("jugadas", 0) + 1);

        if (gane) {
            editor.putInt("ganadas", preferencias.getInt("ganadas", 0) + 1);
            editor.putInt("mejor", Math.max(preferencias.getInt("mejor", 0), puntos));
        }

        editor.apply();

        new AlertDialog.Builder(this)
                .setTitle(gane ? "¡Ganaste!" : "Ganó " + ganador.nombre)
                .setMessage(gane
                        ? "Te quedaste sin cartas primero y sumas " + puntos + " puntos."
                        : ganador.nombre + " se quedó sin cartas y suma " + puntos
                        + " puntos. A ti te quedaron " + yo.mano.size() + " cartas.")
                .setCancelable(false)
                .setPositiveButton("Otra partida", (d, w) -> empezar())
                .setNegativeButton("Menú", (d, w) -> finish())
                .show();
    }

    private void confirmarSalida() {
        if (partida.terminada()) {
            finish();
            return;
        }

        new AlertDialog.Builder(this)
                .setTitle("¿Salir de la partida?")
                .setMessage("La partida en curso se perderá.")
                .setNegativeButton("Seguir jugando", null)
                .setPositiveButton("Salir", (d, w) -> finish())
                .show();
    }

    private void mostrarMensaje(String texto) {
        mensaje.setText(texto);
        mensaje.setAlpha(0f);
        mensaje.animate().alpha(1f).setDuration(220).start();
    }

    private void animarDescarte() {
        descarte.setScaleX(0.7f);
        descarte.setScaleY(0.7f);
        descarte.setRotation(azar.nextInt(17) - 8);
        descarte.animate().scaleX(1f).scaleY(1f).setDuration(240).start();
    }

    private void sacudir(View vista) {
        ObjectAnimator.ofFloat(vista, "translationX", 0, 14, -14, 10, -10, 0)
                .setDuration(320)
                .start();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        reloj.removeCallbacksAndMessages(null);
    }
}
