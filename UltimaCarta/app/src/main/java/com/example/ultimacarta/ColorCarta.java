package com.example.ultimacarta;

public enum ColorCarta {
    CORAL("Coral", 0xFFF0544F),
    AMBAR("Ámbar", 0xFFF5A623),
    MENTA("Menta", 0xFF1FB58F),
    INDIGO("Índigo", 0xFF4C5FD5),
    NEGRO("Comodín", 0xFF1F2333);

    public static final ColorCarta[] JUGABLES = {CORAL, AMBAR, MENTA, INDIGO};

    public final String nombre;
    public final int argb;

    ColorCarta(String nombre, int argb) {
        this.nombre = nombre;
        this.argb = argb;
    }
}
