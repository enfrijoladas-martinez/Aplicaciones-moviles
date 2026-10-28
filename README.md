# Aplicaciones Moviles

Repositorio de la materia de Aplicaciones Moviles.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## Ramas

- `parcial` — actividades del periodo parcial, hechas con React Native y Expo.
- `ordinario` — actividades del periodo ordinario.

## Actividades de este periodo

| Actividad | Carpeta | Herramienta | Tema |
|---|---|---|---|
| DemoIntent | [`DemoIntent/`](./DemoIntent) | Android Studio | `Intent` y `Extra`. Tres actividades lanzadas desde botones, con datos que viajan en ambas direcciones. |
| Fragmentado | [`Fragmentado/`](./Fragmentado) | Android Studio | `Fragment`. Una sola Activity con tres botones que intercambian tres fragmentos distintos. |
| VertHorizon | [`VertHorizon/`](./VertHorizon) | Android Studio | Ciclo de vida de una Activity. Mensajes con `Log` y `Toast`, y el problema de la perdida del dato al girar la pantalla. |
| Layouts | [`Layouts/`](./Layouts) | Android Studio | Los cuatro layouts clasicos: `LinearLayout`, `RelativeLayout`, `FrameLayout` y `TableLayout`, cada uno con su ejemplo didactico. |
| Listas | [`Listas/`](./Listas) | Android Studio | `RecyclerView` con su Holder, Adapter y LayoutManager intercambiable. Compara contra `ListView` y demuestra el reciclaje de vistas. |
| Persistencia | [`Persistencia/`](./Persistencia) | React Native | CRUD contra una base de datos Postgres en Supabase, con un componente por operacion. |

Cada carpeta tiene su propio README con la investigacion correspondiente.

## Como abrir cada una

**Proyectos de Android Studio** (Java, minSdk 27 / Android 8.1 Oreo): abrir la carpeta
con **File > Open**, esperar el Gradle sync y ejecutar en un emulador o en un dispositivo
fisico con depuracion USB activada.

**Proyectos de React Native**: entrar a la carpeta, correr `npm install` y luego
`npx expo start`, y escanear el QR con Expo Go.
