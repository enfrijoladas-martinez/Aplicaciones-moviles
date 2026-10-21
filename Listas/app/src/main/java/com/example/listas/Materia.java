package com.example.listas;

public class Materia {

    private final String nombre;
    private final String profesor;
    private final int color;

    public Materia(String nombre, String profesor, int color) {
        this.nombre = nombre;
        this.profesor = profesor;
        this.color = color;
    }

    public String getNombre() {
        return nombre;
    }

    public String getProfesor() {
        return profesor;
    }

    public int getColor() {
        return color;
    }

    public String getInicial() {
        if (nombre == null || nombre.isEmpty()) {
            return "?";
        }
        return nombre.substring(0, 1).toUpperCase();
    }
}
