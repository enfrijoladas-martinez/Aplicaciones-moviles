# MySumApp

Actividad de Aplicaciones Moviles. Android Studio, Java, minSdk 27 (Android 8.1 Oreo).

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## 1. Leer numeros de la interfaz

Un `EditText` siempre regresa **texto**, aunque solo acepte numeros. Para operar con el
valor hay que convertirlo:

```java
double a = Double.parseDouble(numero1.getText().toString());
```

Si el campo esta vacio o tiene algo como `"-"`, `parseDouble` lanza
`NumberFormatException` y la app se cerraria. Por eso la lectura se hace dentro de un
`try/catch` y, si falla, se muestra un aviso en lugar de sumar.

El teclado numerico se pide desde el XML con
`android:inputType="numberDecimal|numberSigned"`, que permite decimales y negativos.

## 2. Implementacion

| Elemento | Funcion |
|---|---|
| `numero1`, `numero2` | Los dos sumandos |
| **Sumar** | Valida los dos campos, suma y muestra el resultado |
| **Limpiar** | Borra los campos y regresa el resultado a 0 |
| `resultado` | El total en grande |
| `operacion` | La operacion completa, por ejemplo `2.5 + 4 = 6.5` |

El resultado se formatea con `DecimalFormat("#,##0.##")` para que `6.0` se vea como `6`
y los miles lleven coma.

## 3. Como correrla

Abrir la carpeta con **File > Open**, esperar el Gradle sync y ejecutar en un emulador o
en un dispositivo fisico.
