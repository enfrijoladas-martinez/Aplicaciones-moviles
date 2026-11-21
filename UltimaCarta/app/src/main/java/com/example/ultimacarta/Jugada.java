package com.example.ultimacarta;

public class Jugada {

    public final boolean valida;
    public final String mensaje;
    public final Carta carta;
    public final boolean puedeJugarRobada;

    private Jugada(boolean valida, String mensaje, Carta carta, boolean puedeJugarRobada) {
        this.valida = valida;
        this.mensaje = mensaje;
        this.carta = carta;
        this.puedeJugarRobada = puedeJugarRobada;
    }

    static Jugada ok(String mensaje, Carta carta) {
        return new Jugada(true, mensaje, carta, false);
    }

    static Jugada robo(String mensaje, Carta carta, boolean puedeJugarla) {
        return new Jugada(true, mensaje, carta, puedeJugarla);
    }

    static Jugada error(String mensaje) {
        return new Jugada(false, mensaje, null, false);
    }
}
