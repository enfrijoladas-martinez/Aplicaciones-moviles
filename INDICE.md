# Indice de proyectos - Aplicaciones Moviles

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437
**Materia:** Aplicaciones Moviles
**Repositorio:** https://github.com/enfrijoladas-martinez/Aplicaciones-moviles
**Rama de entrega:** `parcial`

Todos los proyectos estan hechos con **React Native + Expo** en JavaScript.
Cada carpeta es un proyecto independiente con su propio `package.json`.

---

## Tabla general

| # | Proyecto | Tema | Librerias principales |
|---|---|---|---|
| 1 | [Ejercicio_01](./Ejercicio_01) | Componentes y props | — |
| 2 | [Ejemplo_02](./Ejemplo_02) | `props.children` e input de texto | — |
| 3 | [Ejercicio_03](./Ejercicio_03) | Imagenes, `FlatList` y `SectionList` | — |
| 4 | [Ejercicio_04](./Ejercicio_04) | Modal personalizado | — |
| 5 | [Ejercicio_05](./Ejercicio_05) | Navegacion **Stack** | `@react-navigation/native-stack` |
| 6 | [Ejercicio_06](./Ejercicio_06) | Navegacion **Tabs** | `@react-navigation/bottom-tabs` |
| 7 | [Ejercicio_07](./Ejercicio_07) | Navegacion **Drawer** | `@react-navigation/drawer`, `reanimated` |
| 8 | [Ejercicio_08](./Ejercicio_08) | Lista dinamica con modal de detalle | — |
| 9 | [Ejercicio_09](./Ejercicio_09) | Animaciones | `Animated` |
| 10 | [Ejercicio_10](./Ejercicio_10) | App integradora | `@expo/vector-icons` |
| 11 | [Ejercicio_11](./Ejercicio_11) | Sensores del dispositivo | `expo-sensors` |
| 12 | [Ejercicio_12](./Ejercicio_12) | Mapas | `react-native-maps`, `expo-location` |
| 13 | [Ejercicio_13](./Ejercicio_13) | Consumo de API con MongoDB | `express`, `mongodb`, `bcryptjs` |
| — | [FitCalc](./FitCalc) | Calculadora de IMC con modal | — |
| — | [Proyecto Parcial](./Proyecto%20Parcial) | **Proyecto final:** optimizador de rutas de entrega | `@react-navigation/drawer`, `expo-location` |

---

## Detalle por proyecto

### 1. [Ejercicio_01](./Ejercicio_01) — Componentes y props

Diferencia entre un componente fijo y uno parametrizado.

- `componentes/MiComponente.jsx` — componente sin props
- `componentes/Mensaje.jsx` — recibe `autor`, `contenido` y `color`, reutilizado con datos distintos
- Imagen cargada desde una URL remota

### 2. [Ejemplo_02](./Ejemplo_02) — props.children

- `components/DemoChildren.jsx` — muestra como lo que va **entre** las etiquetas llega en `props.children`
- `components/DemoInputText.jsx` — layout de tres franjas: encabezado, lista de mensajes con scroll y caja de escritura
- `components/FlagComponent.jsx`

### 3. [Ejercicio_03](./Ejercicio_03) — Imagenes y listas

- `componentes/ImagenFondo.jsx` — `ImageBackground` a pantalla completa, franja semitransparente e imagen remota encima
- `componentes/DemoFlatList.jsx` — lista simple con `FlatList`
- `componentes/DemoSectionList.jsx` — lista agrupada por secciones con encabezados

### 4. [Ejercicio_04](./Ejercicio_04) — Modal

Caja de texto y boton que abre un modal saludando con lo que se escribio.

- `componentes/CustomModal.jsx` — modal reutilizable que recibe su contenido por props

### 5. [Ejercicio_05](./Ejercicio_05) — Navegacion Stack

Menu principal que navega a tres calculadoras mediante `createNativeStackNavigator`.

- `Componentes/HomeScreen.jsx`, `ImcScreen.jsx`, `Currency.jsx`, `TipScreen.jsx`

### 6. [Ejercicio_06](./Ejercicio_06) — Navegacion Tabs

Tres pestanas inferiores con `createBottomTabNavigator`: Inicio, Buscar y Perfil.

### 7. [Ejercicio_07](./Ejercicio_07) — Navegacion Drawer

Menu lateral con `createDrawerNavigator` y cuatro pantallas: Inicio, Buscar, Perfil y Ajustes.
Se abre deslizando desde el borde o con `navigation.openDrawer()`.

> Toda la app va envuelta en `GestureHandlerRootView`; sin eso el gesto no funciona.

### 8. [Ejercicio_08](./Ejercicio_08) — Lista con detalle

`FlatList` de materias; al tocar una se abre un modal con profesor, creditos y horario.
Un solo estado (`seleccionado`) controla que se muestra y si el modal esta abierto.

### 9. [Ejercicio_09](./Ejercicio_09) — Animaciones

Uso de la API `Animated` de React Native.

### 10. [Ejercicio_10](./Ejercicio_10) — App integradora

Varias pantallas en un solo proyecto: dados, IMC, propinas y gato (tic-tac-toe).

### 11. [Ejercicio_11](./Ejercicio_11) — Sensores

Lectura en vivo de acelerometro, giroscopio, magnetometro y podometro con `expo-sensors`.

### 12. [Ejercicio_12](./Ejercicio_12) — Mapas

Mapa con `react-native-maps`.

### 13. [Ejercicio_13](./Ejercicio_13) — Consumo de API con MongoDB

El unico proyecto con backend propio.

- `API/server.js` — servidor Express con `/register`, `/login` y `/movies`, conectado a MongoDB Atlas
- `components/LoginScreen.js` — registro e inicio de sesion
- `components/MovieModal.js` — detalle de la pelicula
- `App.js` — catalogo en `FlatList`

Las contrasenas se guardan hasheadas con bcrypt. La cadena de conexion se lee de
`API/.env`, que **no** se sube al repositorio (ver `API/.env.example`).

Instrucciones completas en su [README](./Ejercicio_13/ConsumeAPI_MongoDB/README.md).

### [FitCalc](./FitCalc) — Calculadora de IMC

Captura peso y altura, valida la entrada y muestra el resultado en un modal que
clasifica por color: bajo peso, normal, sobrepeso u obesidad.

### [Proyecto Parcial](./Proyecto%20Parcial) — Rutas de Entrega

Proyecto final de la materia. Calcula el orden en que una empresa de reparto debe visitar
a sus clientes para recorrer la menor distancia posible, y traduce ese ahorro a pesos.

Es el **problema del agente viajero**, resuelto con dos heuristicas:

1. **Vecino mas cercano** arma una primera ruta yendo siempre al punto mas proximo
2. **2-opt** revisa pares de tramos y los invierte cuando eso acorta el recorrido,
   deshaciendo los cruces que dejo el primer metodo

Las distancias son reales: se calculan con la **formula de Haversine** sobre coordenadas
de latitud y longitud, tomando en cuenta la curvatura de la Tierra.

- `utilidades/geo.js` — Haversine, proyeccion de coordenadas a pantalla y deteccion de cruces
- `utilidades/ruta.js` — vecino mas cercano, 2-opt, reparto por capacidad y metricas
- `componentes/Lienzo.js` — el plano, dibujado con Views rotadas sin libreria de graficos
- `pantallas/RutaScreen.js` — optimizacion, reproduccion paso a paso y simulacion del recorrido
- `pantallas/ComparativaScreen.js` — los tres metodos comparados y proyeccion de ahorro
- `pantallas/AjustesScreen.js` — datos del vehiculo y GPS para ubicar el almacen

Funciona sin internet. El unico acceso a hardware es el GPS con `expo-location`, que no
hace peticiones a ningun servidor.

---

## Como ejecutar cualquier proyecto

```bash
cd <carpeta del proyecto>
npm install
npx expo start
```

Escanear el codigo QR con **Expo Go**. Si el telefono no esta en la misma red
que la computadora, usar `npx expo start --tunnel`.

El `Ejercicio_13` necesita ademas levantar su servidor antes de abrir la app.
