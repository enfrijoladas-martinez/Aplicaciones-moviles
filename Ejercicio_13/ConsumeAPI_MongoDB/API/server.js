// Servidor Express que expone la base sample_mflix de MongoDB Atlas.
// La cadena de conexion NO va escrita aqui: se lee de la variable de
// entorno MONGO_URI (ver .env.example).

const dns = require('dns');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// mongodb+srv:// necesita resolver un registro DNS de tipo SRV. En esta maquina
// Node ve 127.0.0.1 como servidor DNS y ahi no responde nadie, asi que la
// resolucion truena con ECONNREFUSED aunque Windows si resuelva bien.
// Si detectamos ese caso, usamos resolvedores publicos solo en este proceso.
const servidoresDns = dns.getServers();
if (servidoresDns.every((s) => s === '127.0.0.1' || s === '::1')) {
  console.warn('DNS local no responde, usando 8.8.8.8 y 1.1.1.1 para este proceso');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Falta la variable MONGO_URI. Copia .env.example a .env y ponle tu cadena de Atlas.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

const client = new MongoClient(MONGO_URI);
let movies;
let users;

async function conectar() {
  await client.connect();
  movies = client.db('sample_mflix').collection('movies');
  users = client.db('login_service').collection('users');
  console.log('Conectado a MongoDB Atlas');
}

// Registro: guarda el usuario con la contrasena hasheada, nunca en texto plano.
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan email o password' });
  }

  const existente = await users.findOne({ email });
  if (existente) {
    return res.status(409).json({ error: 'Ese correo ya esta registrado' });
  }

  const hash = await bcrypt.hash(password, 10);
  await users.insertOne({ email, password: hash, creado: new Date() });

  res.status(201).json({ mensaje: 'Usuario creado' });
});

// Login: compara contra el hash guardado.
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan email o password' });
  }

  const usuario = await users.findOne({ email });
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const coincide = await bcrypt.compare(password, usuario.password);
  if (!coincide) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  res.json({ user: { email: usuario.email } });
});

// Peliculas: solo los 3 campos que necesita la app, maximo 60.
app.get('/movies', async (req, res) => {
  const lista = await movies
    .find(
      { poster: { $exists: true }, fullplot: { $exists: true } },
      { projection: { title: 1, poster: 1, fullplot: 1 } }
    )
    .limit(60)
    .toArray();

  res.json(lista);
});

conectar()
  .then(() => {
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('No se pudo conectar a MongoDB:', e.message);
    process.exit(1);
  });
