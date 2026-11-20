# MyFirstAndroidApp

Actividad de Aplicaciones Moviles. Android Studio, Java, minSdk 27 (Android 8.1 Oreo).

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## 1. Como esta hecho un proyecto Android

Android separa la app en dos partes que se conectan por identificadores:

- **Vista (`res/layout/*.xml`)**: describe que hay en pantalla. Cada componente que se
  va a usar desde codigo lleva un `android:id`.
- **Controlador (`java/.../MainActivity.java`)**: la `Activity` carga el XML con
  `setContentView` y obtiene cada componente con `findViewById(R.id.nombre)`.

La clase `R` la genera Android Studio sola a partir de los recursos; por eso
`R.id.boton` existe aunque nadie la haya escrito.

### Componentes usados

| Componente | Para que sirve |
|---|---|
| `TextView` | Mostrar texto que el usuario no edita |
| `EditText` | Caja donde el usuario escribe |
| `Button` | Ejecutar una accion al tocarlo |
| `Toast` | Mensaje corto flotante que desaparece solo |

## 2. Implementacion

1. El usuario escribe su nombre en el `EditText`.
2. Al tocar **Saludar**, el `OnClickListener` lee el texto con `getText().toString()`.
3. Si esta vacio se marca el error en el campo con `setError`.
4. Si no, el `TextView` cambia a "Hola, nombre!", se muestra un `Toast` y un contador
   indica cuantas veces se ha saludado.

## 3. Como correrla

Abrir la carpeta con **File > Open**, esperar el Gradle sync y ejecutar en un emulador o
en un dispositivo fisico.
