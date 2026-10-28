# Persistencia

Actividad de la sesion del 27 de octubre. React Native con Expo y Supabase.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## Que hace

La aplicacion guarda productos en una base de datos real alojada en Supabase. Lo que se
escribe en el telefono no vive en memoria: viaja a Postgres y sigue ahi aunque se cierre
la aplicacion o se abra desde otro dispositivo. Eso es la persistencia.

El CRUD esta separado en cuatro componentes, uno por operacion, y se navega entre ellos
con las pestanas de arriba.

## Archivos

```
App.js                           pestanas y estado compartido
supabase.js                      URL, anon key y cliente
estilos.js                       estilos compartidos
tabla.sql                        tabla productos y politicas
componentes/
  EstadoConexion.js              punto 3: comprueba la conexion
  AgregarProducto.js             punto 5a: insert
  ConsultarProductos.js          punto 5b: select
  ActualizarProducto.js          punto 5c: update
  EliminarProducto.js            punto 5d: delete
```

## Los puntos de la actividad

### 1. Proyecto en Supabase, URL y anon key

Las credenciales quedan guardadas en `supabase.js`:

- **Project URL**: la direccion del proyecto, algo como `https://xxxx.supabase.co`
- **anon key**: la llave publica que el cliente usa para identificarse

Supabase llama *anon* o *publishable* a esta llave. Es la que puede ir dentro de una
aplicacion, porque quien manda de verdad son las politicas de seguridad de la tabla. La
otra llave, la *service role*, nunca se pone en una app.

### 2. La app

Proyecto de Expo con plantilla en blanco llamado `Persistencia`. Dependencias:

- `@supabase/supabase-js`: el cliente oficial
- `react-native-url-polyfill`: React Native no trae la API `URL` completa del navegador y
  el cliente la necesita para armar las peticiones

### 3. Comprobar la conexion

`componentes/EstadoConexion.js` es la barra de arriba. Al abrir la app hace la consulta
mas barata posible:

```js
supabase.from('productos').select('id', { count: 'exact', head: true })
```

`head: true` pide solo el encabezado, sin traer filas, y `count: 'exact'` pide el numero
total de registros. Segun el resultado, el punto se pinta de:

- **Verde**: llego la respuesta, la tabla existe
- **Rojo**: hubo error, y debajo se muestra el mensaje exacto de Supabase
- **Amarillo**: todavia esta esperando

Tocando la barra se vuelve a probar.

### 4. Tabla productos

El SQL esta en `tabla.sql`. Campos:

| Campo | Tipo | Para que |
|---|---|---|
| `id` | bigint identity | Llave primaria, se genera sola |
| `producto` | text | Nombre, obligatorio |
| `descripcion` | text | Texto libre, opcional |
| `precio` | numeric(10,2) | Dos decimales exactos |
| `creado_en` | timestamptz | Fecha de alta automatica |

`numeric` y no `float` porque con dinero los decimales binarios redondean mal.

### 5. El CRUD en cuatro componentes

#### a) AgregarProducto

Formulario con los tres campos. Antes de mandar valida que el nombre no venga vacio y
que el precio sea un numero mayor o igual a cero. La consulta:

```js
supabase.from('productos').insert(fila).select()
```

El `.select()` al final hace que Supabase devuelva la fila recien creada, por eso se
puede avisar el `id` que le toco sin volver a preguntar.

#### b) ConsultarProductos

Solo lee. Trae todo ordenado del mas nuevo al mas viejo:

```js
supabase.from('productos').select('*').order('id', { ascending: false })
```

Tiene boton de recargar y tambien se actualiza jalando la lista hacia abajo
(`RefreshControl`). Muestra el `id` y la fecha de alta, que son los campos que llena
Postgres solo.

#### c) ActualizarProducto

Dos partes: la lista para elegir cual editar y el formulario que aparece ya lleno con lo
que tenia ese registro. El `where` es lo importante:

```js
supabase.from('productos').update(fila).eq('id', elegido)
```

Sin el `.eq('id', ...)` el update tocaria **todas** las filas de la tabla.

#### d) EliminarProducto

Lista con un boton rojo por fila. Antes de borrar sale un `Alert` de confirmacion,
porque el delete no se puede deshacer:

```js
supabase.from('productos').delete().eq('id', item.id)
```

Igual que el update: sin el `.eq` se vacia la tabla entera.

## Como se comunican los componentes

Cada componente hace sus propias consultas, no comparte una lista global. El problema es
que si agregas un producto en una pestana, las otras tres se quedarian con datos viejos.

La solucion es un contador en `App.js`:

```js
const [version, setVersion] = useState(0);

function alCambiar() {
  setVersion((anterior) => anterior + 1);
}
```

Quien escribe (agregar, actualizar, eliminar) llama `alCambiar()` al terminar. Los
componentes que leen reciben `version` como prop y la vigilan:

```js
useEffect(() => { cargar(); }, [version]);
```

Cuando el numero cambia, el efecto se vuelve a ejecutar y la consulta se repite. Asi
cada componente sigue siendo independiente pero ninguno muestra datos viejos.

## Row Level Security

Al crear una tabla, Supabase enciende **RLS** y por defecto nadie puede leer ni escribir,
ni siquiera con la anon key. Por eso `tabla.sql` crea cuatro politicas que le dan permiso
al rol `anon` de hacer select, insert, update y delete, una por cada letra del CRUD.

Sin esas politicas la app conecta bien pero la lista sale siempre vacia y los insert
fallan en silencio. Es el error mas comun de esta practica.

En un proyecto real las politicas se amarran al usuario con `auth.uid()`; aqui se dejan
abiertas porque la actividad no pide login.

## Manejo de errores

Todas las consultas regresan `{ data, error }`. En el codigo siempre se revisa `error`
antes de tocar `data`: el cliente de Supabase no lanza excepciones, devuelve el error
como un valor. Si se ignora, `data` llega en `null` y la app truena mas adelante con un
mensaje que no dice nada del problema real.

## Como correrlo

1. Crear el proyecto en Supabase y correr `tabla.sql` en el SQL Editor
2. Pegar la URL y la anon key en `supabase.js`
3. `npm install`
4. `npx expo start`
5. Escanear el QR con Expo Go

El telefono necesita internet, porque la base de datos esta en la nube. Si la red tiene
aislamiento de clientes y el QR no conecta, usar `npx expo start --tunnel`.
