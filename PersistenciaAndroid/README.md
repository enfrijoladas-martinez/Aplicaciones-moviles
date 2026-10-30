# Persistencia (Android Studio)

Actividad de la sesion del 27 de octubre, version nativa. Android Studio, Java, minSdk 27.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

Es la misma actividad que [`Persistencia/`](../Persistencia), pero hecha con Android
Studio en lugar de React Native. **Las dos apps pegan a la misma base de datos**: si se
agrega un producto desde una, aparece en la otra al recargar.

## Que cambia respecto a la version de Expo

En React Native existe `@supabase/supabase-js`, una libreria que arma las peticiones
sola. En Java no hay equivalente, y no se uso ninguna libreria externa. En su lugar se
habla directo con la **API REST** que Supabase levanta sola encima de la tabla, usando
`HttpURLConnection` y `org.json`, que vienen incluidos en Android.

| | React Native | Android Studio |
|---|---|---|
| Cliente | `@supabase/supabase-js` | `HttpURLConnection` |
| JSON | nativo del lenguaje | `org.json` |
| Componentes | funciones de React | `Fragment` |
| Listas | `FlatList` | `RecyclerView` |
| Hilos | el runtime lo resuelve | `ExecutorService` + `Handler` |

## Los cuatro componentes

El profe pidio un componente por operacion. En Android el equivalente de un componente
de React es un **Fragment**, que es lo que se vio en la actividad `Fragmentado`.

| Archivo | Operacion | Peticion |
|---|---|---|
| `AgregarFragment.java` | Crear | `POST /rest/v1/productos` |
| `ConsultarFragment.java` | Leer | `GET /rest/v1/productos?select=*&order=id.desc` |
| `ActualizarFragment.java` | Modificar | `PATCH /rest/v1/productos?id=eq.N` |
| `EliminarFragment.java` | Borrar | `DELETE /rest/v1/productos?id=eq.N` |

`MainActivity` solo tiene los cuatro botones y el `FrameLayout` donde se intercambian:

```java
getSupportFragmentManager()
        .beginTransaction()
        .replace(R.id.contenedor, destino)
        .commit();
```

## Como se autentica

Supabase identifica a la app con dos encabezados, los dos con la misma anon key:

```java
conexion.setRequestProperty("apikey", ANON_KEY);
conexion.setRequestProperty("Authorization", "Bearer " + ANON_KEY);
```

El `apikey` le dice a Supabase de que proyecto se trata; el `Authorization` es lo que
Postgres lee para saber que el que pregunta es el rol `anon`, y con eso aplica las
politicas de seguridad de la tabla.

## El permiso de internet

Sin esta linea en el `AndroidManifest.xml` cualquier peticion truena:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

No es un permiso que se le pida al usuario en pantalla: se concede al instalar. Pero si
falta, la app compila igual y falla hasta que se ejecuta.

## El manejo de hilos

Android **prohibe** hacer peticiones de red en el hilo principal. Si se intenta, lanza
`NetworkOnMainThreadException` y la app se cierra. El motivo es que mientras ese hilo
espera la respuesta, la pantalla queda congelada.

`Supabase.java` lo resuelve con dos piezas:

```java
private static final ExecutorService HILOS = Executors.newFixedThreadPool(4);
private static final Handler PRINCIPAL = new Handler(Looper.getMainLooper());
```

- El `ExecutorService` corre la peticion en un hilo aparte
- El `Handler` regresa el resultado al hilo principal, porque tampoco se puede tocar la
  interfaz desde un hilo de fondo

El codigo que queda en medio es la interfaz `Respuesta`, con `listo()` y `fallo()`, que
cada Fragment implementa. Es el mismo patron que un `then/catch`, escrito a mano.

Cada callback empieza revisando `isAdded()`: si el usuario cambio de pestana mientras la
respuesta venia en camino, el Fragment ya no esta en pantalla y tocar sus vistas
reventaria.

## El detalle del PATCH

`java.net.HttpURLConnection` solo acepta GET, POST, HEAD, OPTIONS, PUT, DELETE y TRACE.
`PATCH` no esta en esa lista y lanza `ProtocolException`.

En Android si funciona, porque desde API 19 la implementacion de `HttpURLConnection` esta
hecha sobre OkHttp, y esa version si incluye `PATCH`. Es la razon por la que este codigo
corre en Android pero no correria igual en un programa de Java de escritorio.

## El where no es opcional

En `PATCH` y `DELETE`, el `?id=eq.N` es lo unico que limita la operacion a una fila:

```java
peticion("DELETE", TABLA + "?id=eq." + id, null);
```

Sin ese filtro, PostgREST aplica el cambio a **toda la tabla**. Es el mismo riesgo que el
`.eq('id', ...)` de la version de React Native.

## El Prefer: return=representation

Por defecto un `POST` o un `PATCH` contestan con el cuerpo vacio. Con este encabezado:

```java
conexion.setRequestProperty("Prefer", "return=representation");
```

Supabase devuelve la fila que quedo guardada, y por eso la app puede avisar el `id` que
le toco al registro sin hacer una segunda consulta.

## La tabla

Es la misma de la otra version, ya creada en Supabase. El SQL esta en
[`../Persistencia/tabla.sql`](../Persistencia/tabla.sql), con las cuatro politicas de
Row Level Security que le dan permiso al rol `anon` de hacer select, insert, update y
delete.

## Como correrlo

Abrir la carpeta con **File > Open** en Android Studio, esperar el Gradle sync y ejecutar
en un emulador o en un dispositivo fisico. Necesita conexion a internet, porque la base
de datos esta en la nube.
