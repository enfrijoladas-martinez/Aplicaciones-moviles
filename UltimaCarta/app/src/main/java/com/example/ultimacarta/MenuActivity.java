package com.example.ultimacarta;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButtonToggleGroup;

public class MenuActivity extends AppCompatActivity {

    public static final String PREFERENCIAS = "ultima_carta";

    private EditText nombre;
    private MaterialButtonToggleGroup rivales;
    private MaterialButtonToggleGroup dificultad;
    private TextView estadisticas;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        nombre = findViewById(R.id.nombre);
        rivales = findViewById(R.id.rivales);
        dificultad = findViewById(R.id.dificultad);
        estadisticas = findViewById(R.id.estadisticas);

        ((CartaView) findViewById(R.id.portada1)).mostrar(
                new Carta(ColorCarta.MENTA, TipoCarta.NUMERO, 7), null);
        ((CartaView) findViewById(R.id.portada2)).mostrar(
                new Carta(ColorCarta.NEGRO, TipoCarta.MAS_CUATRO, -1), null);
        ((CartaView) findViewById(R.id.portada3)).mostrar(
                new Carta(ColorCarta.CORAL, TipoCarta.REVERSA, -1), null);

        SharedPreferences preferencias = getSharedPreferences(PREFERENCIAS, Context.MODE_PRIVATE);
        nombre.setText(preferencias.getString("nombre", ""));

        int rivalesGuardados = preferencias.getInt("rivales", 2);
        rivales.check(rivalesGuardados == 1 ? R.id.rivales1
                : rivalesGuardados == 3 ? R.id.rivales3 : R.id.rivales2);
        dificultad.check(preferencias.getInt("nivel", Bot.NORMAL) == Bot.FACIL ? R.id.facil : R.id.normal);

        findViewById(R.id.jugar).setOnClickListener(v -> jugar());
        findViewById(R.id.reglas).setOnClickListener(v -> mostrarReglas(this));
    }

    @Override
    protected void onResume() {
        super.onResume();

        SharedPreferences preferencias = getSharedPreferences(PREFERENCIAS, Context.MODE_PRIVATE);
        int jugadas = preferencias.getInt("jugadas", 0);
        int ganadas = preferencias.getInt("ganadas", 0);
        int mejor = preferencias.getInt("mejor", 0);

        estadisticas.setText(jugadas == 0
                ? "Aún no has jugado ninguna partida"
                : "Partidas: " + jugadas + "   Ganadas: " + ganadas + "   Mejor puntaje: " + mejor);
    }

    private void jugar() {
        String miNombre = nombre.getText().toString().trim();

        if (miNombre.isEmpty()) {
            miNombre = "Jugador";
        }

        int checado = rivales.getCheckedButtonId();
        int cuantos = checado == R.id.rivales1 ? 1 : checado == R.id.rivales3 ? 3 : 2;
        int nivel = dificultad.getCheckedButtonId() == R.id.facil ? Bot.FACIL : Bot.NORMAL;

        getSharedPreferences(PREFERENCIAS, Context.MODE_PRIVATE).edit()
                .putString("nombre", miNombre)
                .putInt("rivales", cuantos)
                .putInt("nivel", nivel)
                .apply();

        Intent viaje = new Intent(this, JuegoActivity.class);
        viaje.putExtra(JuegoActivity.NOMBRE, miNombre);
        viaje.putExtra(JuegoActivity.RIVALES, cuantos);
        viaje.putExtra(JuegoActivity.NIVEL, nivel);
        startActivity(viaje);
    }

    public static void mostrarReglas(Context contexto) {
        new AlertDialog.Builder(contexto)
                .setTitle("Cómo se juega")
                .setMessage("Objetivo: ser el primero en quedarse sin cartas.\n\n"
                        + "• Cada jugador recibe 7 cartas.\n"
                        + "• En tu turno tira una carta del mismo color o del mismo número o "
                        + "símbolo que la carta del centro.\n"
                        + "• Si no puedes, toca el mazo para robar. Si la carta que robaste "
                        + "sirve, puedes tirarla; si no, pasas.\n\n"
                        + "Cartas especiales:\n"
                        + "• Salta: el siguiente jugador pierde su turno.\n"
                        + "• Reversa: cambia el sentido (con 2 jugadores funciona como Salta).\n"
                        + "• +2: el siguiente roba 2 y pierde su turno.\n"
                        + "• Comodín: eliges el color que sigue.\n"
                        + "• Comodín +4: eliges color y el siguiente roba 4 y pierde su turno.\n\n"
                        + "Cuando te queden 2 cartas, toca ¡Última! antes de tirar. "
                        + "Si se te olvida, robas 2 cartas de castigo.\n\n"
                        + "Puntos: el ganador suma lo que quedó en las manos de los demás "
                        + "(números = su valor, especiales = 20, comodines = 50).")
                .setPositiveButton("Entendido", null)
                .show();
    }
}
