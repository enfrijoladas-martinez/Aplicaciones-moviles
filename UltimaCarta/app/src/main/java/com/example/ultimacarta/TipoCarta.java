package com.example.ultimacarta;

public enum TipoCarta {
    NUMERO(0),
    SALTO(20),
    REVERSA(20),
    MAS_DOS(20),
    COMODIN(50),
    MAS_CUATRO(50);

    public final int puntos;

    TipoCarta(int puntos) {
        this.puntos = puntos;
    }
}
