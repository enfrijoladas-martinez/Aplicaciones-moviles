# Fragmentado

Actividad 1 de la sesion del 15 de octubre. Android Studio, Java, minSdk 27.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## 1. Que es un fragmento

Un **Fragment** es una porcion reutilizable de interfaz con su propio ciclo de vida, que
vive **dentro** de una Activity. No es una pantalla independiente: siempre esta alojado en
una actividad anfitriona y su ciclo de vida depende del de ella. Si la actividad se
destruye, sus fragmentos se destruyen tambien.

La diferencia con una Activity:

| | Activity | Fragment |
|---|---|---|
| Se declara en el Manifest | Si | No |
| Se lanza con | `Intent` | `FragmentTransaction` |
| Vive por su cuenta | Si | No, necesita una Activity |
| Varios a la vez en pantalla | No | Si |

Sirven para reutilizar una misma interfaz en varias pantallas, y para adaptar el diseno a
distintos tamanos: en un telefono se muestra un fragmento a la vez, mientras que en una
tablet pueden ir dos lado a lado.

## 2. Que se requiere para implementar un fragmento

1. **Una clase que extienda `Fragment`** y sobrescriba `onCreateView()` para inflar su
   layout con un `LayoutInflater`.
2. **Un layout XML propio** para ese fragmento.
3. **Un contenedor en la actividad anfitriona**, normalmente un `FrameLayout` o un
   `FragmentContainerView`, donde se va a colocar.
4. **Un `FragmentManager`** para manejarlos. Desde una `AppCompatActivity` se obtiene con
   `getSupportFragmentManager()`.
5. **Una `FragmentTransaction`** para insertarlo, reemplazarlo o quitarlo. Se abre con
   `beginTransaction()`, se encadenan las operaciones (`add`, `replace`, `remove`) y se
   confirma con `commit()`.

Para pasarle datos **no se usa un constructor con parametros**, porque Android necesita
poder recrear el fragmento por si solo tras un giro de pantalla. En su lugar se usa el
patron de un metodo estatico de fabrica que mete los datos en un `Bundle` con
`setArguments()`, y dentro del fragmento se leen con `getArguments()`.

## 3. Implementacion

Una sola `MainActivity` con tres botones y un `FrameLayout` como contenedor. Cada boton
reemplaza el fragmento visible por otro.

| Fragmento | Funcionalidad | Argumentos que recibe |
|---|---|---|
| `PerfilFragment` | Muestra nombre, matricula y semestre | `String`, `String`, `int` |
| `ContadorFragment` | Contador con botones de sumar y restar segun un paso configurable | `int` inicial, `int` paso |
| `ColoresFragment` | Cambia el color de fondo del propio fragmento | `String` color inicial |

Cada fragmento muestra en pantalla los argumentos que recibio, para que se vea que el
`Bundle` llego completo.

Las transacciones usan `addToBackStack()`, asi que el boton de atras del telefono regresa
al fragmento anterior en lugar de cerrar la aplicacion.

`ContadorFragment` implementa ademas `onSaveInstanceState()`, por lo que su valor
sobrevive al giro de pantalla.

## Como abrirlo

Abrir la carpeta `Fragmentado` en Android Studio con **File > Open**, esperar el Gradle
sync y ejecutar en un emulador o dispositivo fisico.
