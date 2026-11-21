package com.example.ultimacarta;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class Mazo {

    public static final int TOTAL = 108;

    private final List<Carta> cartas = new ArrayList<>();
    private final Random azar;

    public Mazo(Random azar) {
        this.azar = azar;

        for (ColorCarta color : ColorCarta.JUGABLES) {
            cartas.add(new Carta(color, TipoCarta.NUMERO, 0));

            for (int copia = 0; copia < 2; copia++) {
                for (int numero = 1; numero <= 9; numero++) {
                    cartas.add(new Carta(color, TipoCarta.NUMERO, numero));
                }
                cartas.add(new Carta(color, TipoCarta.SALTO, -1));
                cartas.add(new Carta(color, TipoCarta.REVERSA, -1));
                cartas.add(new Carta(color, TipoCarta.MAS_DOS, -1));
            }
        }

        for (int i = 0; i < 4; i++) {
            cartas.add(new Carta(ColorCarta.NEGRO, TipoCarta.COMODIN, -1));
            cartas.add(new Carta(ColorCarta.NEGRO, TipoCarta.MAS_CUATRO, -1));
        }

        barajar();
    }

    public void barajar() {
        Collections.shuffle(cartas, azar);
    }

    public boolean vacio() {
        return cartas.isEmpty();
    }

    public int cuantas() {
        return cartas.size();
    }

    public Carta tomar() {
        return cartas.isEmpty() ? null : cartas.remove(cartas.size() - 1);
    }

    public void regresar(List<Carta> devueltas) {
        cartas.addAll(devueltas);
        barajar();
    }
}
