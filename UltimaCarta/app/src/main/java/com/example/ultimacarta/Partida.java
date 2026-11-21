package com.example.ultimacarta;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Partida {

    public static final int CARTAS_INICIALES = 7;
    public static final int CASTIGO_ULTIMA = 2;

    private final List<Jugador> jugadores;
    private final Random azar;
    private final Mazo mazo;
    private final List<Carta> descarte = new ArrayList<>();

    private ColorCarta colorActual;
    private int turno = 0;
    private int sentido = 1;
    private boolean yaRobo = false;
    private Carta robada = null;
    private Jugador ganador = null;

    public Partida(List<Jugador> jugadores, Random azar) {
        if (jugadores.size() < 2 || jugadores.size() > 4) {
            throw new IllegalArgumentException("Se juega de 2 a 4 jugadores");
        }

        this.jugadores = jugadores;
        this.azar = azar;
        this.mazo = new Mazo(azar);

        for (int ronda = 0; ronda < CARTAS_INICIALES; ronda++) {
            for (Jugador jugador : jugadores) {
                jugador.mano.add(mazo.tomar());
            }
        }

        Carta primera = mazo.tomar();
        List<Carta> apartadas = new ArrayList<>();

        while (primera.esAccion()) {
            apartadas.add(primera);
            primera = mazo.tomar();
        }

        if (!apartadas.isEmpty()) {
            mazo.regresar(apartadas);
        }

        descarte.add(primera);
        colorActual = primera.color;
        turno = azar.nextInt(jugadores.size());
    }

    public List<Jugador> getJugadores() {
        return jugadores;
    }

    public Jugador jugadorEnTurno() {
        return jugadores.get(turno);
    }

    public int getTurno() {
        return turno;
    }

    public int getSentido() {
        return sentido;
    }

    public Carta cartaArriba() {
        return descarte.get(descarte.size() - 1);
    }

    public ColorCarta getColorActual() {
        return colorActual;
    }

    public boolean yaRobo() {
        return yaRobo;
    }

    public Carta getRobada() {
        return robada;
    }

    public Jugador getGanador() {
        return ganador;
    }

    public boolean terminada() {
        return ganador != null;
    }

    public int cartasEnMazo() {
        return mazo.cuantas();
    }

    public int totalCartas() {
        int total = mazo.cuantas() + descarte.size();
        for (Jugador jugador : jugadores) {
            total += jugador.mano.size();
        }
        return total;
    }

    public Jugador siguiente() {
        return jugadores.get(indice(1));
    }

    public boolean sePuedeJugar(Carta carta) {
        if (carta.esComodin()) {
            return true;
        }

        if (carta.color == colorActual) {
            return true;
        }

        Carta arriba = cartaArriba();

        if (carta.tipo != arriba.tipo) {
            return false;
        }

        return carta.tipo != TipoCarta.NUMERO || carta.numero == arriba.numero;
    }

    public boolean esJugable(Jugador jugador, Carta carta) {
        if (terminada() || jugador != jugadorEnTurno() || !sePuedeJugar(carta)) {
            return false;
        }

        return !yaRobo || carta == robada;
    }

    public List<Carta> jugables(Jugador jugador) {
        List<Carta> lista = new ArrayList<>();

        for (Carta carta : jugador.mano) {
            if (esJugable(jugador, carta)) {
                lista.add(carta);
            }
        }

        return lista;
    }

    public void avisarUltima(Jugador jugador) {
        if (jugador.mano.size() <= 2) {
            jugador.avisoUltima = true;
        }
    }

    public Jugada jugar(Jugador jugador, Carta carta, ColorCarta colorElegido) {
        if (terminada()) {
            return Jugada.error("La partida ya terminó");
        }

        if (jugador != jugadorEnTurno()) {
            return Jugada.error("No es tu turno");
        }

        if (!jugador.mano.contains(carta)) {
            return Jugada.error("Esa carta no está en tu mano");
        }

        if (yaRobo && carta != robada) {
            return Jugada.error("Después de robar solo puedes tirar la carta que robaste");
        }

        if (!sePuedeJugar(carta)) {
            return Jugada.error("Esa carta no combina con " + cartaArriba().descripcion()
                    + " (" + colorActual.nombre + ")");
        }

        if (carta.esComodin() && (colorElegido == null || colorElegido == ColorCarta.NEGRO)) {
            return Jugada.error("Elige un color para el comodín");
        }

        jugador.mano.remove(carta);
        descarte.add(carta);
        colorActual = carta.esComodin() ? colorElegido : carta.color;

        StringBuilder mensaje = new StringBuilder(jugador.nombre)
                .append(" tiró ").append(carta.descripcion());

        if (carta.esComodin()) {
            mensaje.append(" y eligió ").append(colorElegido.nombre);
        }

        if (jugador.mano.size() == 1 && !jugador.avisoUltima) {
            int robadas = repartir(jugador, CASTIGO_ULTIMA);
            mensaje.append(". No gritó ¡Última! y roba ").append(robadas);
        }

        jugador.avisoUltima = false;

        if (jugador.mano.isEmpty()) {
            ganador = jugador;
            mensaje.append(". ¡").append(jugador.nombre).append(" ganó!");
            return Jugada.ok(mensaje.toString(), carta);
        }

        aplicarEfecto(carta, mensaje);
        return Jugada.ok(mensaje.toString(), carta);
    }

    private void aplicarEfecto(Carta carta, StringBuilder mensaje) {
        Jugador afectado = siguiente();

        switch (carta.tipo) {
            case SALTO:
                mensaje.append(". ").append(afectado.nombre).append(" pierde su turno");
                avanzar(2);
                break;
            case REVERSA:
                if (jugadores.size() == 2) {
                    mensaje.append(". ").append(afectado.nombre).append(" pierde su turno");
                    avanzar(2);
                } else {
                    sentido = -sentido;
                    mensaje.append(". Cambia el sentido");
                    avanzar(1);
                }
                break;
            case MAS_DOS:
                mensaje.append(". ").append(afectado.nombre).append(" roba ")
                        .append(repartir(afectado, 2)).append(" y pierde su turno");
                avanzar(2);
                break;
            case MAS_CUATRO:
                mensaje.append(". ").append(afectado.nombre).append(" roba ")
                        .append(repartir(afectado, 4)).append(" y pierde su turno");
                avanzar(2);
                break;
            default:
                avanzar(1);
                break;
        }
    }

    public Jugada robar(Jugador jugador) {
        if (terminada()) {
            return Jugada.error("La partida ya terminó");
        }

        if (jugador != jugadorEnTurno()) {
            return Jugada.error("No es tu turno");
        }

        if (yaRobo) {
            return Jugada.error("Ya robaste en este turno");
        }

        Carta carta = tomarDelMazo();

        if (carta == null) {
            avanzar(1);
            return Jugada.robo("No quedan cartas para robar, " + jugador.nombre + " pasa", null, false);
        }

        jugador.mano.add(carta);
        jugador.avisoUltima = false;

        if (sePuedeJugar(carta)) {
            yaRobo = true;
            robada = carta;
            return Jugada.robo(jugador.nombre + " robó una carta y la puede tirar", carta, true);
        }

        avanzar(1);
        return Jugada.robo(jugador.nombre + " robó una carta y pasa", carta, false);
    }

    public Jugada pasar(Jugador jugador) {
        if (jugador != jugadorEnTurno()) {
            return Jugada.error("No es tu turno");
        }

        if (!yaRobo) {
            return Jugada.error("Primero roba una carta");
        }

        avanzar(1);
        return Jugada.ok(jugador.nombre + " pasó", null);
    }

    public int puntosDelGanador() {
        int total = 0;

        for (Jugador jugador : jugadores) {
            if (jugador != ganador) {
                total += jugador.puntosEnMano();
            }
        }

        return total;
    }

    private int repartir(Jugador jugador, int cuantas) {
        int dadas = 0;

        for (int i = 0; i < cuantas; i++) {
            Carta carta = tomarDelMazo();

            if (carta == null) {
                break;
            }

            jugador.mano.add(carta);
            dadas++;
        }

        if (dadas > 0) {
            jugador.avisoUltima = false;
        }

        return dadas;
    }

    private Carta tomarDelMazo() {
        if (mazo.vacio() && descarte.size() > 1) {
            Carta arriba = descarte.remove(descarte.size() - 1);
            mazo.regresar(new ArrayList<>(descarte));
            descarte.clear();
            descarte.add(arriba);
        }

        return mazo.tomar();
    }

    private int indice(int pasos) {
        int total = jugadores.size();
        return ((turno + sentido * pasos) % total + total) % total;
    }

    private void avanzar(int pasos) {
        turno = indice(pasos);
        yaRobo = false;
        robada = null;
    }
}
