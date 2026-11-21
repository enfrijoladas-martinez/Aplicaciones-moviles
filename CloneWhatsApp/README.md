# CloneWhatsApp

Clon de WhatsApp hecho en **Android Studio (Java + XML)** con **Supabase** como backend:
autenticacion con JWT, base de datos Postgres, Realtime para los mensajes en vivo y Storage
para las fotos.

- **minSdk:** 27 (Android 8.1)
- **Paquete:** `com.example.clonewhatsapp`
- **Librerias:** AppCompat, Material, RecyclerView, Activity y OkHttp (REST + WebSocket)

## Como ponerlo a funcionar

1. La base de datos ya esta montada en el proyecto de Supabase **CustomPassEmailRecovery**.
   Para recrearla en otro proyecto: abrir **SQL Editor**, pegar
   [`supabase/schema.sql`](./supabase/schema.sql) y darle **Run** (se puede correr varias
   veces sin romper nada).
2. (Opcional) Para usar otro proyecto, poner en `local.properties`:
   ```properties
   SUPABASE_URL=https://TU-PROYECTO.supabase.co
   SUPABASE_KEY=sb_publishable_...
   ```
3. Abrir la carpeta con **File > Open**, esperar el Gradle sync y correr en dos
   dispositivos o emuladores con cuentas distintas.

## Estructura

| Archivo | Que hace |
|---|---|
| `Supabase.java` | Peticiones REST a Auth, PostgREST, RPC y Storage. Renueva el JWT con el `refresh_token` cuando vence. |
| `Sesion.java` / `Cifrado.java` | Guarda la sesion cifrada con AES-GCM usando una llave del Android Keystore. |
| `Realtime.java` | Cliente WebSocket del protocolo Phoenix de Supabase Realtime: `postgres_changes` y `broadcast`. |
| `LoginActivity`, `RegistroActivity`, `RecuperarActivity` | Inicio de sesion, registro y recuperacion de contrasena con codigo de 6 digitos. |
| `PerfilActivity` | Nombre y foto de perfil. |
| `MainActivity` + `ConversacionAdapter` | Lista de chats con ultimo mensaje, hora, palomitas y contador de no leidos. |
| `ContactosActivity` + `ContactoAdapter` | Usuarios registrados, busqueda y seleccion de destinatario. |
| `GrupoActivity` | Crear conversacion grupal. |
| `ChatActivity` + `MensajeAdapter` | Chat con burbujas, fotos, estados, escribiendo, ultima conexion, eliminar y buscar mensajes. |
| `Presencia.java` | Actualiza `ultima_conexion` cada 30 s mientras la app esta abierta. |
| `Imagenes.java` | Descarga con cache en memoria y compresion JPEG antes de subir. |

## Base de datos

```
auth.users ──1:1── profiles ──1:N── devices
                      │
                      ├──N:M── conversaciones   (por conversaciones_members)
                      │
                      └──1:N── messages ──N:1── conversaciones
```

| Tabla | Llave primaria | Llaves foraneas |
|---|---|---|
| `profiles` | `id_profile` | `id_profile → auth.users.id` |
| `devices` | `id_device` | `id_profile → profiles` |
| `conversaciones` | `id_conversacion` | `creada_por → profiles` |
| `conversaciones_members` | `id_miembro` (unico por conversacion y perfil) | `id_conversacion → conversaciones`, `id_profile → profiles` |
| `messages` | `id_message` | `id_conversacion → conversaciones`, `id_remitente → profiles`, `id_respuesta_a → messages` |

| Funcion RPC | Para que |
|---|---|
| `abrir_conversacion(otro)` | Regresa el chat individual con esa persona o lo crea |
| `crear_grupo(nombre_grupo, miembros)` | Crea un grupo; quien lo crea queda como `admin` |
| `mis_chats()` | Lista de chats con el otro participante, ultimo mensaje y no leidos |
| `marcar_recibidos()` | Pasa a `recibido` los mensajes que me llegaron |
| `marcar_leidos(conversacion)` | Pasa a `leido` los mensajes del chat y actualiza `ultimo_leido_en` |
| `tocar_conexion()` | Actualiza `ultima_conexion` |
| `es_miembro(conversacion)` | La usan las politicas RLS |

Buckets de Storage: `avatares` y `adjuntos`; cada usuario solo sube dentro de su carpeta
(`<id_usuario>/...`).

## Avance por fase

### Fase 1: Entorno ✅
Proyecto Java + XML, permiso de `INTERNET`, dependencias en `libs.versions.toml`, URL y
llave publica en `BuildConfig` desde `local.properties`.

### Fase 2: Diseno de la base de datos ✅
Tablas `profiles`, `devices`, `conversaciones`, `conversaciones_members` y `messages` con sus
llaves primarias y foraneas. Un trigger crea el perfil cuando alguien se registra.

### Fase 3: Autenticacion ✅
- Registro con correo, contrasena y nombre (`/auth/v1/signup`)
- Inicio de sesion (`/auth/v1/token?grant_type=password`)
- Cierre de sesion (`/auth/v1/logout`)
- Recuperacion de contrasena con codigo (`/recover` → `/verify` → `PUT /user`)
- JWT: el `access_token` va en `Authorization: Bearer`, se renueva solo con el
  `refresh_token` y si ya no sirve regresa al login

### Fase 4: Perfiles y contactos ✅
Nombre, apellido y foto (bucket `avatares`), consulta de usuarios, `RecyclerView` de contactos,
busqueda por nombre o correo y seleccion de destinatario.

### Fase 5: Conversaciones ✅
`abrir_conversacion` reutiliza el chat si ya existe. `mis_chats` regresa el otro
participante, el ultimo mensaje y los no leidos.

### Fase 6: Envio de mensajes ✅
Interfaz de chat, burbujas verdes (enviadas) y blancas (recibidas), insercion en
`messages`, historial y diferencia entre enviados y recibidos.

### Fase 7: Comunicacion en tiempo real ✅
`Realtime.java` se suscribe a `postgres_changes` de `messages` filtrado por conversacion.
Los mensajes nuevos y los cambios de estado se agregan al `RecyclerView` sin recargar.

### Fase 8: Estados de mensajes ✅
| Estado | Cuando cambia | Se ve |
|---|---|---|
| Enviado | Al insertarse | ✓ gris |
| Recibido | El destinatario abre la app (`marcar_recibidos`) | ✓✓ gris |
| Leido | El destinatario abre el chat (`marcar_leidos`) | ✓✓ azul |

Ultima conexion con `profiles.ultima_conexion` ("en linea" o "ult. vez hoy a las 10:30").
Indicador de escritura con `broadcast` de Realtime ("escribiendo...").

### Fase 9: Firebase Cloud Messaging ✅
- Proyecto de Firebase **ChatApp** con la app Android `com.example.clonewhatsapp`
  registrada (`app/google-services.json`).
- `MyFirebaseMessagingService` recibe el token FCM (`onNewToken`) y los mensajes
  (`onMessageReceived`).
- `Notificaciones.java` crea el canal **Mensajes** y guarda el token en la tabla `devices`
  con la RPC `registrar_dispositivo`. Al cerrar sesion se desactiva con `quitar_dispositivo`.
- En Android 13+ se pide el permiso `POST_NOTIFICATIONS`.

### Fase 10: Automatizacion de notificaciones ✅
```
INSERT en messages
   └─ trigger al_insertar_mensaje (pg_net)
        └─ POST firmado con un secreto guardado en Vault
             └─ Edge Function notificar-mensaje
                  ├─ valida el secreto (si no coincide responde 401)
                  ├─ busca a los demas miembros y sus tokens activos en devices
                  ├─ pide un access token de Google con la cuenta de servicio (JWT RS256)
                  └─ envia a FCM HTTP v1 (projects/<id>/messages:send)
```
- La cuenta de servicio de Firebase vive solo como secreto de la Edge Function
  (`FIREBASE_SERVICE_ACCOUNT`), nunca en la app ni en el repositorio.
- Si FCM responde que un token ya no existe, el dispositivo se marca `activo = false`.
- Al tocar la notificacion se abre `ChatActivity` en esa conversacion (con la lista de
  chats detras para poder regresar). Si el chat ya esta abierto no se muestra aviso.
- Codigo: [`supabase/notificaciones.sql`](./supabase/notificaciones.sql) y
  [`supabase/functions/notificar-mensaje/index.ts`](./supabase/functions/notificar-mensaje/index.ts).

### Fase 11: Funcionalidades adicionales ✅
- Fotografia de perfil
- Envio de imagenes (bucket `adjuntos`, se ven en grande al tocarlas)
- Conversaciones grupales con nombre del remitente en cada burbuja
- Eliminacion de mensajes para todos (mantener presionado un mensaje propio)
- Busqueda de mensajes dentro del chat (lupa en la barra)

### Fase 12: Seguridad y liberacion
- ✅ Row Level Security en las cinco tablas
- ✅ Funciones cerradas al rol `anon`: solo se pueden llamar con sesion iniciada
- ✅ Permisos por conversacion: solo los miembros leen, escriben o suben fotos a un chat
- ✅ Tokens cifrados con Android Keystore y excluidos del respaldo
- ⏳ Pruebas con multiples dispositivos
- ⏳ Generar APK firmado (**Build > Generate Signed App Bundle / APK**)

Las politicas se probaron en el proyecto real con tres usuarios (dentro de una transaccion
que se deshizo al final): nadie puede leer chats ajenos, enviar
mensajes a nombre de otro, borrar mensajes que no son suyos ni subir fotos a una
conversacion donde no esta.
