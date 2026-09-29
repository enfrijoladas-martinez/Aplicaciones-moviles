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
| 5 | [DynamicFlatlist](./DynamicFlatlist) | Lista dinamica con modal de detalle | — |
| 6 | [FitCalc](./FitCalc) | Calculadora de IMC con modal | — |
| 7 | [Ejercicio_05](./Ejercicio_05) | Navegacion **Stack** | `@react-navigation/native-stack` |
| 8 | [Ejercicio_06](./Ejercicio_06) | Navegacion **Tabs** | `@react-navigation/bottom-tabs` |
| 9 | [DrawerNavigation](./DrawerNavigation) | Navegacion **Drawer** | `@react-navigation/drawer`, `reanimated` |
| 10 | [Ejercicio_09](./Ejercicio_09) | Animaciones | `Animated` |
| 11 | [Ejercicio_10](./Ejercicio_10) | App integradora | `@expo/vector-icons` |
| 12 | [Ejercicio_11](./Ejercicio_11) | Sensores del dispositivo | `expo-sensors` |
| 13 | [Ejercicio_12](./Ejercicio_12) | Mapas | `react-native-maps`, `expo-location` |
| 14 | [Ejercicio_13](./Ejercicio_13) | Consumo de API con MongoDB | `express`, `mongodb`, `bcryptjs` |

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

- `componentes/CustomModal.jsx` — modal reutilizable que recibe su contenido por props

### 5. [DynamicFlatlist](./DynamicFlatlist) — Lista con detalle

`FlatList` de materias; al tocar una se abre un modal con profesor, creditos y horario.
Un solo estado (`seleccionado`) controla que se muestra y si el modal esta abierto.

### 6. [FitCalc](./FitCalc) — Calculadora de IMC

Captura peso y altura, valida la entrada y muestra el resultado en un modal que
clasifica por color: bajo peso, normal, sobrepeso u obesidad.

### 7. [Ejercicio_05](./Ejercicio_05) — Navegacion Stack

Menu principal que navega a tres calculadoras mediante `createNativeStackNavigator`.

- `Componentes/HomeScreen.jsx`, `ImcScreen.jsx`, `Currency.jsx`, `TipScreen.jsx`

### 8. [Ejercicio_06](./Ejercicio_06) — Navegacion Tabs

Tres pestanas inferiores con `createBottomTabNavigator`: Inicio, Buscar y Perfil.

### 9. [DrawerNavigation](./DrawerNavigation) — Navegacion Drawer

Menu lateral con `createDrawerNavigator` y cuatro pantallas: Inicio, Buscar, Perfil y Ajustes.
Se abre deslizando desde el borde o con `navigation.openDrawer()`.

> Toda la app va envuelta en `GestureHandlerRootView`; sin eso el gesto no funciona.

### 10. [Ejercicio_09](./Ejercicio_09) — Animaciones

Uso de la API `Animated` de React Native.

### 11. [Ejercicio_10](./Ejercicio_10) — App integradora

Varias pantallas en un solo proyecto: dados, IMC, propinas y gato (tic-tac-toe).

### 12. [Ejercicio_11](./Ejercicio_11) — Sensores

Lectura en vivo de acelerometro, giroscopio, magnetometro y podometro con `expo-sensors`.

### 13. [Ejercicio_12](./Ejercicio_12) — Mapas

Mapa con `react-native-maps`.

### 14. [Ejercicio_13](./Ejercicio_13) — Consumo de API con MongoDB

El unico proyecto con backend propio.

- `API/server.js` — servidor Express con `/register`, `/login` y `/movies`, conectado a MongoDB Atlas
- `components/LoginScreen.js` — registro e inicio de sesion
- `components/MovieModal.js` — detalle de la pelicula
- `App.js` — catalogo en `FlatList`

Las contrasenas se guardan hasheadas con bcrypt. La cadena de conexion se lee de
`API/.env`, que **no** se sube al repositorio (ver `API/.env.example`).

Instrucciones completas en su [README](./Ejercicio_13/ConsumeAPI_MongoDB/README.md).

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
