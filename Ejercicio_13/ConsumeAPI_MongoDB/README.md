# Ejercicio 13 - Consumo de API con MongoDB

App de Expo que consume una API propia de Express conectada a MongoDB Atlas.
Tiene registro, inicio de sesion y un catalogo de peliculas con modal de detalle.

## Estructura

```
API/server.js       servidor Express (registro, login, peliculas)
config.js           URL de la API  <-- lo unico que se cambia seguido
components/         LoginScreen.js y MovieModal.js
App.js              catalogo con FlatList
```

## 1. Preparar la base en Atlas

1. Crea un cluster gratis en https://cloud.mongodb.com
2. Carga el dataset de ejemplo: **Browse Collections > Load Sample Dataset**.
   De ahi sale la base `sample_mflix` con la coleccion `movies`.
3. En **Network Access** agrega tu IP (o `0.0.0.0/0` mientras desarrollas).
4. En **Database > Connect > Drivers** copia la cadena de conexion.

## 2. Levantar el servidor

```bash
cd API
npm install
copy .env.example .env
```

Abre `.env` y pega tu cadena en `MONGO_URI`. Luego:

```bash
npm start
```

Debe decir `Conectado a MongoDB Atlas` y `API escuchando en http://localhost:4000`.

## 3. Apuntar la app al servidor

En `config.js` cambia `API_URL`:

- **Misma WiFi:** `http://TU_IP:4000`. Saca tu IP con `ipconfig` (la IPv4 del WiFi).
- **Redes distintas:** levanta un tunel con `npx ngrok http 4000` y usa la URL que te de.

`localhost` NO funciona: para el celular, localhost es el celular.

## 4. Correr la app

```bash
npm install
npx expo start
```

Registra una cuenta, inicia sesion y aparece el catalogo.

## Endpoints

| Metodo | Ruta | Que hace |
|---|---|---|
| POST | `/register` | Crea usuario. Body: `{ email, password }` |
| POST | `/login` | Valida credenciales. Devuelve `{ user }` |
| GET | `/movies` | 60 peliculas con `title`, `poster` y `fullplot` |

Las contrasenas se guardan hasheadas con bcrypt, nunca en texto plano.
