# DemoIntent

Actividad de Aplicaciones Moviles. Android Studio, Java, minSdk 27 (Android 8.1 Oreo).

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## 1. Que son Intent y Extra

### Intent

Un **Intent** es un objeto que describe una intencion de hacer algo. En Android las
actividades no se abren llamando a su constructor: se le pide al sistema con un Intent,
y es el sistema quien crea la actividad y la coloca en la pila.

Hay dos tipos:

- **Explicito**: se indica exactamente que clase abrir.
  `new Intent(this, SaludoActivity.class)`
- **Implicito**: solo se describe la accion (abrir un enlace, marcar un numero) y Android
  decide que aplicacion la atiende.

En esta actividad se usan los tres de forma **explicita**.

### Extra

Un **Extra** es un dato que viaja dentro del Intent. El Intent por si solo abre la
pantalla pero no lleva informacion; los Extras son pares de llave y valor que se le
adjuntan y se guardan en un `Bundle` interno.

Se envian con `putExtra(llave, valor)` y se leen en la actividad destino con
`getStringExtra(llave)`, `getIntExtra(llave, valorPorDefecto)` y similares.

Las llaves se nombran con el paquete como prefijo
(`com.example.demointent.NOMBRE`) porque un Intent puede llegar a otra aplicacion, y una
llave generica como `"nombre"` podria chocar con la de alguien mas.

## 2. Implementacion

### MainActivity

Captura nombre y edad, y tiene los tres botones que lanzan las demas actividades.
Muestra ademas el resultado que devuelve la calculadora.

### Las tres actividades

| Actividad | Funcionalidad | Extras que recibe |
|---|---|---|
| `SaludoActivity` | Saludo personalizado, calcula si es mayor de edad y permite sumar anos | `String` nombre, `int` edad |
| `CalculadoraActivity` | Calcula el indice de masa corporal y lo clasifica | `String` nombre |
| `ListaActivity` | Muestra las materias en un `ListView` y permite seleccionarlas | `String` nombre, `ArrayList<String>` materias, `int` semestre |

Las tres tienen boton de regreso con `finish()`.

### Extras de regreso

`CalculadoraActivity` ademas **devuelve** datos a `MainActivity`: el IMC (`double`) y la
clasificacion (`String`), usando `setResult()` con un Intent de respuesta. Del lado de
`MainActivity` se reciben con un `ActivityResultLauncher` registrado con
`registerForActivityResult`, que es el reemplazo del antiguo `startActivityForResult`.

Esto demuestra que los Extras viajan en ambas direcciones.

## Como correrlo

Abrir la carpeta `DemoIntent` en Android Studio, esperar el Gradle sync y ejecutar con
un emulador o un dispositivo fisico con depuracion USB activada.
