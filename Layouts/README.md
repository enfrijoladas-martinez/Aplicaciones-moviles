# Layouts

Actividad de la sesion del 20 de octubre. Android Studio, Java, minSdk 27.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## Investigacion

### LinearLayout

Acomoda sus hijos en una sola direccion, definida por `android:orientation`:
`vertical` los apila uno debajo de otro, `horizontal` uno al lado del otro.

Su propiedad caracteristica es **`layout_weight`**, que reparte el espacio sobrante de
forma proporcional. Una vista con `layout_width="0dp"` y `layout_weight="1"` no pide
ancho propio, asi que todo su tamano sale del reparto. Con tres vistas de peso 1 cada una
ocupa un tercio exacto; si una tiene peso 2 y las otras peso 1, la primera se lleva la
mitad porque el total de pesos es 4.

Se usa `0dp` y no `wrap_content` porque con `wrap_content` Android primero da a cada
vista el ancho de su contenido y solo reparte lo que sobra, con lo que las proporciones
salen desiguales.

### RelativeLayout

Cada vista declara donde esta respecto a algo mas. Hay dos referencias posibles:

- **Respecto a otra vista**, que debe tener `android:id`:
  `layout_above`, `layout_below`, `layout_toLeftOf`, `layout_toRightOf`
- **Respecto al contenedor padre**:
  `layout_alignParentTop`, `layout_alignParentBottom`, `layout_centerInParent`,
  `layout_centerHorizontal`, `layout_centerVertical`

En el ejemplo, las vistas verde y naranja se colocan con `layout_above` y `layout_below`
apuntando al azul, de modo que dependen de el. La negra usa `alignParentBottom` y
`alignParentRight`, por lo que depende de la pantalla.

El `android:id` es obligatorio en cualquier vista que sirva de referencia: sin el no se
le puede apuntar desde otra.

### FrameLayout

Apila las vistas una encima de otra, todas ancladas por defecto en la esquina superior
izquierda. **El orden del XML determina las capas**: la primera queda al fondo y la
ultima hasta arriba.

`layout_gravity` mueve cada capa dentro del marco: `center`, `top|left`, `bottom|right`.

Su uso real es superponer elementos: una insignia de notificaciones sobre un icono, un
texto sobre una imagen, o un boton flotante sobre una lista.

### TableLayout

Organiza el contenido en cuadricula. Cada `<TableRow>` es una fila y cada hijo de esa
fila es una columna. No se declaran columnas: se cuentan solas segun el numero de hijos.

Dos propiedades importantes:

- **`stretchColumns`** va en el `TableLayout` e indica que columnas se estiran para
  llenar el ancho. Con `stretchColumns="1"` se estira la segunda columna y la primera
  conserva el tamano de su texto, lo que alinea un formulario sin declarar ningun ancho.
  Con `stretchColumns="*"` se estiran todas por igual.
- **`layout_span`** hace que una celda ocupe varias columnas.

Las columnas se numeran desde cero.

## Implementacion

`MainActivity` tiene cuatro botones, uno por cada tipo de layout, y cada uno abre su
actividad mediante un `Intent` explicito.

| Boton | Activity | Layout | Ejemplo que muestra |
|---|---|---|---|
| LinearLayout | `LinearActivity` | `activity_linear.xml` | Apilado vertical, fila horizontal en tercios y reparto con pesos 2-1-1 |
| RelativeLayout | `RelativeActivity` | `activity_relative.xml` | Vistas colocadas respecto al centro y respecto al padre |
| FrameLayout | `FrameActivity` | `activity_frame.xml` | Tres capas encimadas mas una insignia sobre una imagen |
| TableLayout | `TableActivity` | `activity_table.xml` | Formulario de cuatro filas y tabla con celda combinada |

## Cuando usar cada uno

| Necesidad | Layout |
|---|---|
| Lista simple hacia abajo o a los lados | LinearLayout |
| Elementos posicionados unos respecto a otros | RelativeLayout |
| Capas superpuestas | FrameLayout |
| Formulario con etiquetas alineadas | TableLayout |

`ConstraintLayout`, que Android Studio usa por defecto, combina las capacidades de
`RelativeLayout` con el reparto de espacio y evita anidar contenedores, que es lo que
mas penaliza el rendimiento. Estos cuatro son los clasicos y la base para entenderlo.

## Nota tecnica

Los layouts raiz llevan `android:fitsSystemWindows="true"` y un contenedor interno con el
padding visual. Esto es necesario porque con `targetSdk 37` Android dibuja la aplicacion
detras de las barras del sistema, y sin ese ajuste el contenido queda tapado por la barra
de estado.

## Como abrirlo

Abrir la carpeta `Layouts` en Android Studio con **File > Open**, esperar el Gradle sync
y ejecutar en un emulador o dispositivo fisico.
