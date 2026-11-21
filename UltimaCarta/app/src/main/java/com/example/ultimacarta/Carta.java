package com.example.ultimacarta;

public final class Carta {

    private static int siguienteId = 0;

    public final int id;
    public final ColorCarta color;
    public final TipoCarta tipo;
    public final int numero;

    public Carta(ColorCarta color, TipoCarta tipo, int numero) {
        this.id = siguienteId++;
        this.color = color;
        this.tipo = tipo;
        this.numero = numero;
    }

    public boolean esComodin() {
        return tipo == TipoCarta.COMODIN || tipo == TipoCarta.MAS_CUATRO;
    }

    public boolean esAccion() {
        return tipo != TipoCarta.NUMERO;
    }

    public int puntos() {
        return tipo == TipoCarta.NUMERO ? numero : tipo.puntos;
    }

    public String simbolo() {
        switch (tipo) {
            case SALTO:
                return "Salta";
            case REVERSA:
                return "Reversa";
            case MAS_DOS:
                return "+2";
            case COMODIN:
                return "Comodín";
            case MAS_CUATRO:
                return "+4";
            default:
                return String.valueOf(numero);
        }
    }

    public String descripcion() {
        if (esComodin()) {
            return tipo == TipoCarta.MAS_CUATRO ? "Comodín +4" : "Comodín";
        }
        return simbolo() + " " + color.nombre;
    }
}
