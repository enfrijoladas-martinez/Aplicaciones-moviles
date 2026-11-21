package com.example.ultimacarta;

import java.util.List;
import java.util.Random;

public class Bot {

    public static final int FACIL = 0;
    public static final int NORMAL = 1;

    private final int nivel;
    private final Random azar;

    public Bot(int nivel, Random azar) {
        this.nivel = nivel;
        this.azar = azar;
    }

    public Carta elegirCarta(Partida partida, Jugador yo) {
        List<Carta> opciones = partida.jugables(yo);

        if (opciones.isEmpty()) {
            return null;
        }

        if (nivel == FACIL) {
            return opciones.get(azar.nextInt(opciones.size()));
        }

        Jugador siguiente = partida.siguiente();
        boolean rivalPorGanar = siguiente.mano.size() <= 2;
        Carta mejor = null;
        int mejorValor = Integer.MIN_VALUE;

        for (Carta carta : opciones) {
            int valor = valorar(carta, partida, yo, rivalPorGanar);

            if (valor > mejorValor) {
                mejorValor = valor;
                mejor = carta;
            }
        }

        return mejor;
    }

    private int valorar(Carta carta, Partida partida, Jugador yo, boolean rivalPorGanar) {
        int valor = 0;

        if (carta.esComodin()) {
            valor -= 30;

            if (carta.tipo == TipoCarta.MAS_CUATRO && rivalPorGanar) {
                valor += 80;
            }

            if (yo.mano.size() <= 2) {
                valor += 40;
            }
            return valor;
        }

        if (carta.esAccion()) {
            valor += rivalPorGanar ? 50 : 5;
        }

        if (carta.color == partida.getColorActual()) {
            valor += 10;
        }

        valor += carta.puntos();
        valor += contarColor(yo, carta.color) * 3;

        return valor;
    }

    public ColorCarta elegirColor(Jugador yo) {
        if (nivel == FACIL) {
            return ColorCarta.JUGABLES[azar.nextInt(ColorCarta.JUGABLES.length)];
        }

        ColorCarta mejor = ColorCarta.JUGABLES[azar.nextInt(ColorCarta.JUGABLES.length)];
        int maximo = 0;

        for (ColorCarta color : ColorCarta.JUGABLES) {
            int cuantas = contarColor(yo, color);

            if (cuantas > maximo) {
                maximo = cuantas;
                mejor = color;
            }
        }

        return mejor;
    }

    public boolean recuerdaGritar() {
        return azar.nextInt(100) < (nivel == FACIL ? 65 : 92);
    }

    private int contarColor(Jugador yo, ColorCarta color) {
        int cuantas = 0;

        for (Carta carta : yo.mano) {
            if (carta.color == color) {
                cuantas++;
            }
        }

        return cuantas;
    }
}
