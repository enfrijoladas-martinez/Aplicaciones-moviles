package com.example.clonewhatsapp;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class Fechas {

    private static final DateTimeFormatter HORA = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DIA = DateTimeFormatter.ofPattern("dd/MM/yy");
    private static final DateTimeFormatter DIA_CORTO = DateTimeFormatter.ofPattern("dd/MM");

    public static ZonedDateTime leer(String texto) {
        if (texto == null || texto.isEmpty() || "null".equals(texto)) {
            return null;
        }

        String limpio = texto.replace(' ', 'T');

        try {
            return OffsetDateTime.parse(limpio).atZoneSameInstant(ZoneId.systemDefault());
        } catch (Exception primero) {
            try {
                return LocalDateTime.parse(limpio)
                        .atOffset(ZoneOffset.UTC)
                        .atZoneSameInstant(ZoneId.systemDefault());
            } catch (Exception segundo) {
                return null;
            }
        }
    }

    public static String hora(String texto) {
        ZonedDateTime fecha = leer(texto);
        return fecha == null ? "" : fecha.format(HORA);
    }

    public static String corta(String texto) {
        ZonedDateTime fecha = leer(texto);

        if (fecha == null) {
            return "";
        }

        LocalDate dia = fecha.toLocalDate();
        LocalDate hoy = LocalDate.now();

        if (dia.equals(hoy)) {
            return fecha.format(HORA);
        }

        if (dia.equals(hoy.minusDays(1))) {
            return "Ayer";
        }

        return fecha.format(DIA);
    }

    public static boolean enLinea(String texto) {
        ZonedDateTime fecha = leer(texto);

        if (fecha == null) {
            return false;
        }

        return Duration.between(fecha, ZonedDateTime.now()).getSeconds() < 70;
    }

    public static String ultimaConexion(String texto) {
        ZonedDateTime fecha = leer(texto);

        if (fecha == null) {
            return "";
        }

        if (enLinea(texto)) {
            return "en linea";
        }

        LocalDate dia = fecha.toLocalDate();
        LocalDate hoy = LocalDate.now();

        if (dia.equals(hoy)) {
            return "ult. vez hoy a las " + fecha.format(HORA);
        }

        if (dia.equals(hoy.minusDays(1))) {
            return "ult. vez ayer a las " + fecha.format(HORA);
        }

        return "ult. vez el " + fecha.format(DIA_CORTO) + " a las " + fecha.format(HORA);
    }
}
