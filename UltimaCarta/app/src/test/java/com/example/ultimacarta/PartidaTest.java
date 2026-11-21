package com.example.ultimacarta;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class PartidaTest {

    private Partida nueva(int cuantos, long semilla) {
        List<Jugador> jugadores = new ArrayList<>();
        for (int i = 0; i < cuantos; i++) {
            jugadores.add(new Jugador("J" + i, i == 0));
        }
        return new Partida(jugadores, new Random(semilla));
    }

    @Test
    public void elMazoTiene108CartasConLaDistribucionCorrecta() {
        Mazo mazo = new Mazo(new Random(1));
        int numeros = 0, ceros = 0, acciones = 0, comodines = 0;

        while (!mazo.vacio()) {
            Carta carta = mazo.tomar();
            if (carta.esComodin()) {
                comodines++;
            } else if (carta.esAccion()) {
                acciones++;
            } else {
                numeros++;
                if (carta.numero == 0) {
                    ceros++;
                }
            }
        }

        assertEquals(76, numeros);
        assertEquals(4, ceros);
        assertEquals(24, acciones);
        assertEquals(8, comodines);
    }

    @Test
    public void repartoInicial() {
        Partida partida = nueva(4, 7);

        for (Jugador jugador : partida.getJugadores()) {
            assertEquals(Partida.CARTAS_INICIALES, jugador.mano.size());
        }

        assertFalse(partida.cartaArriba().esAccion());
        assertEquals(Mazo.TOTAL, partida.totalCartas());
    }

    @Test
    public void reglasDeCombinacion() {
        Partida partida = nueva(2, 3);
        Carta arriba = partida.cartaArriba();
        ColorCarta otro = arriba.color == ColorCarta.CORAL ? ColorCarta.MENTA : ColorCarta.CORAL;

        assertTrue(partida.sePuedeJugar(new Carta(arriba.color, TipoCarta.NUMERO, (arriba.numero + 1) % 10)));
        assertTrue(partida.sePuedeJugar(new Carta(otro, TipoCarta.NUMERO, arriba.numero)));
        assertFalse(partida.sePuedeJugar(new Carta(otro, TipoCarta.NUMERO, (arriba.numero + 1) % 10)));
        assertFalse(partida.sePuedeJugar(new Carta(otro, TipoCarta.SALTO, -1)));
        assertTrue(partida.sePuedeJugar(new Carta(ColorCarta.NEGRO, TipoCarta.COMODIN, -1)));
        assertTrue(partida.sePuedeJugar(new Carta(ColorCarta.NEGRO, TipoCarta.MAS_CUATRO, -1)));
    }

    @Test
    public void comodinCambiaElColorYExigeEleccion() {
        Partida partida = nueva(2, 5);
        Jugador actual = partida.jugadorEnTurno();
        Carta comodin = new Carta(ColorCarta.NEGRO, TipoCarta.COMODIN, -1);
        actual.mano.add(comodin);

        assertFalse(partida.jugar(actual, comodin, null).valida);
        assertTrue(partida.jugar(actual, comodin, ColorCarta.INDIGO).valida);
        assertEquals(ColorCarta.INDIGO, partida.getColorActual());
    }

    @Test
    public void masCuatroHaceRobarYSaltaAlSiguiente() {
        Partida partida = nueva(3, 11);
        Jugador actual = partida.jugadorEnTurno();
        Jugador siguiente = partida.siguiente();
        int antes = siguiente.mano.size();

        Carta masCuatro = new Carta(ColorCarta.NEGRO, TipoCarta.MAS_CUATRO, -1);
        actual.mano.add(masCuatro);
        partida.jugar(actual, masCuatro, ColorCarta.AMBAR);

        assertEquals(antes + 4, siguiente.mano.size());
        assertTrue(partida.jugadorEnTurno() != siguiente);
        assertTrue(partida.jugadorEnTurno() != actual);
    }

    @Test
    public void reversaConDosJugadoresFuncionaComoSalto() {
        Partida partida = nueva(2, 21);
        Jugador actual = partida.jugadorEnTurno();
        Carta reversa = new Carta(partida.getColorActual(), TipoCarta.REVERSA, -1);
        actual.mano.add(reversa);

        partida.jugar(actual, reversa, null);

        assertEquals(actual, partida.jugadorEnTurno());
    }

    @Test
    public void reversaConTresJugadoresCambiaElSentido() {
        Partida partida = nueva(3, 22);
        Jugador actual = partida.jugadorEnTurno();
        int sentido = partida.getSentido();
        Carta reversa = new Carta(partida.getColorActual(), TipoCarta.REVERSA, -1);
        actual.mano.add(reversa);

        partida.jugar(actual, reversa, null);

        assertEquals(-sentido, partida.getSentido());
    }

    @Test
    public void noGritarUltimaCuestaDosCartas() {
        Partida partida = nueva(2, 9);
        Jugador actual = partida.jugadorEnTurno();
        actual.mano.clear();
        Carta a = new Carta(partida.getColorActual(), TipoCarta.NUMERO, 3);
        Carta b = new Carta(partida.getColorActual(), TipoCarta.NUMERO, 4);
        actual.mano.add(a);
        actual.mano.add(b);

        partida.jugar(actual, a, null);

        assertEquals(1 + Partida.CASTIGO_ULTIMA, actual.mano.size());
    }

    @Test
    public void gritarUltimaEvitaElCastigo() {
        Partida partida = nueva(2, 9);
        Jugador actual = partida.jugadorEnTurno();
        actual.mano.clear();
        Carta a = new Carta(partida.getColorActual(), TipoCarta.NUMERO, 3);
        Carta b = new Carta(partida.getColorActual(), TipoCarta.NUMERO, 4);
        actual.mano.add(a);
        actual.mano.add(b);

        partida.avisarUltima(actual);
        partida.jugar(actual, a, null);

        assertEquals(1, actual.mano.size());
    }

    @Test
    public void despuesDeRobarSoloSePuedeTirarLaRobada() {
        for (long semilla = 0; semilla < 200; semilla++) {
            Partida partida = nueva(2, semilla);
            Jugador actual = partida.jugadorEnTurno();
            Jugada robo = partida.robar(actual);

            if (robo.puedeJugarRobada) {
                for (Carta carta : actual.mano) {
                    if (carta != robo.carta) {
                        assertFalse(partida.esJugable(actual, carta));
                    }
                }
                assertTrue(partida.esJugable(actual, robo.carta));
                return;
            }
        }
    }

    @Test
    public void milesDePartidasEntreBotsTerminanSinPerderCartas() {
        Random azar = new Random(2026);

        for (int juego = 0; juego < 3000; juego++) {
            int cuantos = 2 + juego % 3;
            Partida partida = nueva(cuantos, juego);
            Bot bot = new Bot(juego % 2, azar);
            int jugadas = 0;

            while (!partida.terminada()) {
                assertTrue("partida " + juego + " no termina", jugadas++ < 5000);
                Jugador actual = partida.jugadorEnTurno();
                Carta carta = bot.elegirCarta(partida, actual);

                if (carta == null) {
                    Jugada robo = partida.robar(actual);
                    assertTrue(robo.valida);

                    if (robo.puedeJugarRobada) {
                        carta = robo.carta;
                    }
                }

                if (carta != null) {
                    if (actual.mano.size() == 2 && bot.recuerdaGritar()) {
                        partida.avisarUltima(actual);
                    }

                    ColorCarta color = carta.esComodin() ? bot.elegirColor(actual) : null;
                    assertTrue(partida.jugar(actual, carta, color).valida);
                }

                assertEquals(Mazo.TOTAL, partida.totalCartas());
            }

            assertNotNull(partida.getGanador());
            assertTrue(partida.getGanador().mano.isEmpty());
        }
    }
}
