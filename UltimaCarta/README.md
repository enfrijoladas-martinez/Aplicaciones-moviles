# Última Carta

Proyecto final de Aplicaciones Móviles: juego de mesa de cartas en **Android Studio
(Java + XML)**, minSdk 27 (Android 8.1).

**Alumno:** Elias Martinez Garcia
**Matrícula:** 202260437

Es un juego de descarte por colores para 2 a 4 jugadores: tú contra 1, 2 o 3 rivales
controlados por la computadora. Gana quien se queda sin cartas primero.

## Reglas

- 108 cartas en 4 colores (Coral, Ámbar, Menta e Índigo). Por color hay un 0, dos de cada
  número del 1 al 9 y dos de cada carta especial (Salta, Reversa y +2). Además hay 4
  Comodines y 4 Comodines +4.
- Se reparten 7 cartas. La primera carta del centro siempre es un número.
- En tu turno tiras una carta que coincida en **color**, **número** o **símbolo** con la del
  centro. Los comodines se pueden tirar siempre.
- Si no puedes tirar, robas una carta. Si la robada sirve la puedes tirar; si no, pasas.

| Carta | Efecto |
|---|---|
| Salta | El siguiente pierde su turno |
| Reversa | Cambia el sentido; con 2 jugadores funciona como Salta |
| +2 | El siguiente roba 2 y pierde su turno |
| Comodín | Eliges el color que sigue |
| Comodín +4 | Eliges color; el siguiente roba 4 y pierde su turno |

Cuando te quedan 2 cartas hay que tocar **¡Última!** antes de tirar; si se te olvida,
robas 2 de castigo. Los rivales también pueden olvidarlo.

**Puntuación:** el ganador suma las cartas que les quedaron a los demás (números = su
valor, especiales = 20, comodines = 50). La app guarda partidas jugadas, ganadas y el
mejor puntaje.

## Estructura

| Clase | Que hace |
|---|---|
| `Carta`, `ColorCarta`, `TipoCarta` | Modelo de una carta y su puntaje |
| `Mazo` | Crea las 108 cartas, baraja y reparte |
| `Jugador` | Nombre, mano y si ya gritó ¡Última! |
| `Partida` | Todas las reglas: turnos, sentido, efectos, robar, castigo y ganador. No depende de Android, por eso se puede probar con JUnit |
| `Jugada` | Resultado de cada acción con el mensaje que se muestra |
| `Bot` | Rivales. **Fácil** tira cualquier carta válida. **Normal** guarda los comodines, ataca con +2/+4 cuando el siguiente está por ganar y elige el color que más tiene |
| `CartaView` | Vista personalizada que dibuja cada carta con `Canvas` (no usa imágenes) |
| `MenuActivity` | Nombre, número de rivales, dificultad, reglas y estadísticas (`SharedPreferences`) |
| `JuegoActivity` | La mesa: rivales, mazo, descarte, mano, botones ¡Última! y Pasar, animaciones y turnos de la computadora con `Handler` |

## Pruebas

`app/src/test/.../PartidaTest.java` tiene 11 pruebas JUnit: que el mazo tenga las 108
cartas correctas, el reparto, cada regla de combinación, los efectos de Comodín, +4 y
Reversa, el castigo por no gritar ¡Última!, y una simulación de **3000 partidas completas**
entre bots (2, 3 y 4 jugadores) que comprueba que todas terminan con un ganador y que
nunca se pierde ni se duplica una carta.

En Android Studio: clic derecho sobre `PartidaTest` > **Run**. Desde terminal:

```bash
./gradlew testDebugUnitTest
```

## Como correrlo

Abrir la carpeta `UltimaCarta` con **File > Open**, esperar el Gradle sync y ejecutar en un
emulador o en un celular Android.
