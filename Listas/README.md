# Listas

Actividad de la sesion del 20 de octubre. Android Studio, Java, minSdk 27.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## Investigacion: ListView contra RecyclerView

### ListView

Es el componente original de Android para mostrar listas. Se usa con un `Adapter`
(`ArrayAdapter`, `SimpleAdapter` o uno propio) y es sencillo de poner a funcionar.

Su problema es el rendimiento. En su version basica crea una vista nueva por cada
elemento, y si la lista tiene cientos de filas la aplicacion se pone lenta y consume
mucha memoria. Existe el llamado patron ViewHolder para reutilizar vistas, pero es
**opcional**: hay que implementarlo a mano dentro del `getView()` y es facil olvidarlo o
hacerlo mal.

Ademas solo acomoda los elementos de forma vertical. Para una cuadricula hay que usar
otro componente distinto, el `GridView`.

### RecyclerView

Es el reemplazo moderno, parte de AndroidX. Su nombre viene de lo que hace: **recicla**
las vistas que salen de la pantalla para volver a usarlas con datos nuevos, en lugar de
crear una vista por elemento.

Aqui el patron ViewHolder es **obligatorio**: la clase `RecyclerView.ViewHolder` forma
parte de la API, asi que no se puede programar mal por descuido.

Separa responsabilidades en tres piezas:

- **ViewHolder**: guarda las referencias a las vistas de una fila
- **Adapter**: crea los holders y les pone los datos
- **LayoutManager**: decide como se acomodan los elementos en pantalla

Esa separacion es lo que permite cambiar de lista vertical a cuadricula sin tocar el
adaptador.

### Diferencias

| | ListView | RecyclerView |
|---|---|---|
| Reciclaje de vistas | Opcional, a mano | Obligatorio, de fabrica |
| Acomodo | Solo vertical | LayoutManager intercambiable |
| Animaciones | No trae | ItemAnimator incluido |
| Actualizar datos | `notifyDataSetChanged()` para todo | Metodos por elemento (`notifyItemInserted`, `notifyItemRemoved`) |
| Separadores | Propiedad `divider` | `ItemDecoration` |
| Clic en elemento | `setOnItemClickListener` listo | Se programa en el ViewHolder |
| Rendimiento | Baja con listas largas | Estable |
| Complejidad inicial | Menor | Mayor |

En resumen: `ListView` es mas rapido de escribir pero no escala; `RecyclerView` pide mas
codigo al principio y a cambio da rendimiento y flexibilidad. Hoy `RecyclerView` es el
recomendado y `ListView` queda para listas muy cortas o codigo heredado.

## Implementacion

### El Holder

`MateriaAdapter.MateriaHolder` extiende `RecyclerView.ViewHolder`. En su constructor
hace **una sola vez** el `findViewById` de cada vista de la fila y guarda las
referencias. Ese es justamente el ahorro: al reutilizar la fila ya no hay que volver a
buscar las vistas, solo cambiarles el texto.

### El Adapter

`MateriaAdapter` extiende `RecyclerView.Adapter` e implementa tres metodos obligatorios:

- **`onCreateViewHolder`**: infla el layout de la fila y crea el holder. Se llama pocas
  veces, solo las necesarias para llenar la pantalla mas unas de reserva.
- **`onBindViewHolder`**: recibe un holder que ya existe y le pone los datos de la
  posicion que toca. Se llama muchas veces, cada vez que una fila entra a la pantalla.
- **`getItemCount`**: cuantos elementos hay en total.

### El posicionamiento

Tres botones cambian el `LayoutManager` en caliente:

- `LinearLayoutManager` vertical
- `LinearLayoutManager` horizontal
- `GridLayoutManager` de dos columnas

**El adaptador no cambia en ninguno de los tres casos.** Esa es la ventaja de separar el
acomodo del contenido.

## Como se demuestra el reciclaje

La aplicacion muestra en la parte de arriba un contador de **vistas creadas**, que
aumenta cada vez que se ejecuta `onCreateViewHolder`.

Al recorrer las doce materias de principio a fin, el contador se queda alrededor de
**diez**, no en doce. Las filas que salen de la pantalla se reutilizan para las que
entran, por lo que nunca se crean tantas vistas como elementos hay.

Con la cuadricula sube un poco porque caben mas filas visibles a la vez, y en horizontal
baja porque caben menos.

Los botones de abajo complementan la demostracion:

- **Agregar** usa `notifyItemInserted`, que avisa de un solo elemento nuevo en lugar de
  redibujar toda la lista
- **Restaurar** usa `notifyDataSetChanged`, que vuelve a pintar todo

## Como abrirlo

Abrir la carpeta `Listas` en Android Studio con **File > Open**, esperar el Gradle sync y
ejecutar en un emulador o dispositivo fisico.
