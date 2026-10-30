package com.example.persistenciaandroid;

import org.json.JSONObject;

public class Producto {

    private final int id;
    private final String producto;
    private final String descripcion;
    private final double precio;
    private final String creadoEn;

    public Producto(int id, String producto, String descripcion, double precio, String creadoEn) {
        this.id = id;
        this.producto = producto;
        this.descripcion = descripcion;
        this.precio = precio;
        this.creadoEn = creadoEn;
    }

    public static Producto desdeJson(JSONObject json) {
        return new Producto(
                json.optInt("id"),
                json.isNull("producto") ? "" : json.optString("producto"),
                json.isNull("descripcion") ? "" : json.optString("descripcion"),
                json.optDouble("precio", 0),
                json.isNull("creado_en") ? "" : json.optString("creado_en"));
    }

    public int getId() {
        return id;
    }

    public String getProducto() {
        return producto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public double getPrecio() {
        return precio;
    }

    public String getCreadoEn() {
        if (creadoEn.length() < 19) {
            return creadoEn;
        }
        return creadoEn.substring(0, 10) + " " + creadoEn.substring(11, 19);
    }
}
