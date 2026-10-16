# VertHorizon

Actividad 2 de la sesion del 15 de octubre. Android Studio, Java, minSdk 27.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## 1. Ciclo de vida de una Activity

Android crea y destruye las actividades segun lo que hace el usuario y segun lo que
necesite el sistema. Entre su creacion y su destruccion pasa por estos metodos:

| Metodo | Cuando se ejecuta |
|---|---|
| `onCreate()` | Al crearse la actividad. Aqui va `setContentView()` y la inicializacion |
| `onStart()` | La actividad se vuelve visible |
| `onResume()` | Pasa a primer plano y ya recibe toques |
| `onPause()` | Pierde el primer plano. Algo la tapa parcialmente |
| `onStop()` | Deja de ser visible |
| `onDestroy()` | Se destruye, ya sea porque el usuario salio o porque el sistema la recrea |
| `onRestart()` | Vuelve despues de haber estado detenida |

Lo importante para esta actividad: **al girar el telefono, Android destruye la actividad y
la vuelve a crear**. El recorrido es `onPause()`, `onStop()`, `onDestroy()`, y despues
`onCreate()`, `onStart()`, `onResume()` otra vez, pero ya con la configuracion nueva.

Eso ocurre porque al cambiar la orientacion cambian los recursos que se deben usar
(dimensiones, layouts alternativos), y la forma de aplicarlos es reconstruir la pantalla.

## 2. Mensajes con LOG y Toast

Implementados en `onCreate()`, `onPause()` y `onDestroy()` con `Log.d()` y `Toast`.
Tambien se registran `onStart()`, `onResume()` y `onStop()` en Logcat.

La etiqueta del log es `VertHorizon`. En Android Studio se filtra escribiendo ese texto en
Logcat.

Ademas la aplicacion lleva una **bitacora en pantalla**, para que el recorrido del ciclo de
vida se vea sin tener que mirar Logcat, lo cual es util al presentar en vivo.

## 3. EditText y TextView

La pantalla pide un valor en un `EditText` y lo muestra en un `TextView` al presionar el
boton.

## 4. Que pasa al girar el telefono

**El dato del `TextView` se pierde.** Al girar, Android destruye y vuelve a crear la
actividad, y el `TextView` se reconstruye desde el layout XML con su texto original.

Lo curioso es que **el `EditText` si conserva lo escrito**. La diferencia es que las vistas
con `android:id` guardan automaticamente su propio estado, y el `EditText` lo aprovecha
porque el texto que el usuario escribio es parte de su estado. El `TextView` no lo hace
para texto puesto por codigo, porque Android asume que ese texto se vuelve a generar.

### La solucion

Sobrescribir `onSaveInstanceState(Bundle)`, que Android llama **antes** de destruir la
actividad, y guardar ahi el dato. Al volver a crearse, ese mismo `Bundle` llega como
parametro de `onCreate()` y se puede leer para restaurarlo.

La aplicacion trae un **interruptor** para demostrar las dos conductas:

- **Apagado**: reproduce el problema, el dato se pierde al girar
- **Encendido**: usa `onSaveInstanceState()` y el dato sobrevive

## Como abrirlo

Abrir la carpeta `VertHorizon` en Android Studio con **File > Open**, esperar el Gradle
sync y ejecutar en un emulador o dispositivo fisico. Para probar el giro, activar la
rotacion automatica del telefono.
