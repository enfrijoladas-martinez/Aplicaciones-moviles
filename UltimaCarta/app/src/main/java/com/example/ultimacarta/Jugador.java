package com.example.ultimacarta;

import java.util.ArrayList;
import java.util.List;

public class Jugador {

    public final String nombre;
    public final boolean esHumano;
    public final List<Carta> mano = new ArrayList<>();
    public boolean avisoUltima = false;

    public Jugador(String nombre, boolean esHumano) {
        this.nombre = nombre;
        this.esHumano = esHumano;
    }

    public int puntosEnMano() {
        int total = 0;
        for (Carta carta : mano) {
            total += carta.puntos();
        }
        return total;
    }
}
