# CustomPassEmailRecovery

Actividad de la sesion del 10 de noviembre. Android Studio, Java, minSdk 27.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

Autenticacion contra Supabase con correo y contrasena, y recuperacion de contrasena por
correo usando Gmail como servidor SMTP y una plantilla personalizada.

## Las tres pantallas que pide la actividad

| Pantalla | Archivo | Que hace |
|---|---|---|
| GUI login | `LoginActivity` | Entra con correo y contrasena, guarda el JWT |
| Registro | `RegistroActivity` | Crea la cuenta y avisa si hay que confirmar el correo |
| Recuperacion | `RecuperarActivity` | Los tres pasos: correo, codigo, contrasena nueva |

Mas `InicioActivity`, que es a donde se llega despues de entrar: muestra el token, lo que
lleva dentro, y el boton de cerrar sesion.

## Configuracion de Gmail en Supabase

Sin SMTP propio, Supabase solo manda **2 correos por hora** y nada mas a la direccion del
dueno de la cuenta. Por eso hay que configurar un servidor de correo.

En **Authentication > SMTP Settings**:

```
Host:     smtp.gmail.com
Port:     465
Username: el correo de Gmail completo
Password: una App Password de Google (16 caracteres)
Sender:   el mismo correo de Gmail
```

El detalle que detiene a todo el mundo: **no es la contrasena normal de Gmail**. Google
dejo de aceptarla por SMTP. Hay que activar la verificacion en dos pasos y generar una
"Contrasena de aplicacion" en la cuenta de Google. Son 16 caracteres que solo se muestran
una vez.

Supabase avisa que Gmail es un proveedor de correo *personal* y no *transaccional*. Es
solo un aviso: en produccion se usaria SendGrid, Resend o Amazon SES, que tienen mejor
reputacion de entrega. Para esta practica Gmail funciona.

Con SMTP propio el limite sube a 30 correos por hora.

## La plantilla personalizada

Esta en `supabase/plantilla_recuperacion.html`, y va en
**Authentication > Email Templates > Reset password**.

La plantilla que trae Supabase de fabrica manda un **enlace**:

```html
<a href="{{ .ConfirmationURL }}">Reset password</a>
```

Eso sirve en una pagina web, pero **no en una aplicacion de Android**: el enlace abre el
navegador, y el usuario se queda fuera de la app sin poder cambiar nada. Para que el
enlace regresara a la aplicacion habria que montar deep links, con `intent-filter`,
esquema propio y dominio verificado.

La plantilla tambien expone `{{ .Token }}`, que es un **codigo de seis digitos**. Cambiar
el enlace por el codigo es lo que hace que el flujo completo quepa dentro de la
aplicacion:

```html
<div style="font-size: 38px; letter-spacing: 8px;">{{ .Token }}</div>
```

Por eso la actividad se llama *Custom*PassEmailRecovery: personalizar la plantilla no es
decoracion, es lo que permite el flujo movil.

Las variables disponibles en esa plantilla son `{{ .Token }}`, `{{ .TokenHash }}`,
`{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .SiteURL }}` y `{{ .RedirectTo }}`.

## El flujo de recuperacion

```
1. La app pide el correo
   POST /auth/v1/recover          { email }

2. Supabase manda el correo por Gmail con el codigo de 6 digitos

3. El usuario escribe el codigo
   POST /auth/v1/verify           { email, token, type: "recovery" }
   -> devuelve un access_token temporal

4. Con ese token se cambia la contrasena
   PUT /auth/v1/user              { password }
   Authorization: Bearer <access_token del paso 3>
```

El paso 3 es la parte que no se ve a simple vista: verificar el codigo **no cambia la
contrasena**, lo que hace es dar una sesion valida. El cambio ocurre en el paso 4, usando
esa sesion. Sin ese token, `PUT /auth/v1/user` responde 401.

`RecuperarActivity` maneja los tres pasos en una sola Activity, cambiando que bloque se ve
con `setVisibility`, y marca arriba en cual va el usuario.

## Los endpoints de Auth

| Accion | Peticion |
|---|---|
| Registro | `POST /auth/v1/signup` |
| Inicio de sesion | `POST /auth/v1/token?grant_type=password` |
| Pedir codigo | `POST /auth/v1/recover` |
| Verificar codigo | `POST /auth/v1/verify` |
| Cambiar contrasena | `PUT /auth/v1/user` |
| Cerrar sesion | `POST /auth/v1/logout` |

Todas llevan la llave publica en el encabezado `apikey`. Las que necesitan una sesion
llevan ademas `Authorization: Bearer <access_token>`; las demas repiten ahi la llave
publica.

No se uso ninguna libreria: `HttpURLConnection` y `org.json`, los dos incluidos en
Android, igual que en la actividad `PersistenciaAndroid`.

## El manejo de sesion JWT

`Sesion.java` guarda el token en `SharedPreferences`, asi que la sesion sobrevive a cerrar
la aplicacion. `LoginActivity.onResume()` revisa si ya hay token guardado y, si lo hay,
salta directo a la pantalla de inicio.

Un JWT son tres partes separadas por puntos: encabezado, contenido y firma. El contenido
va en Base64, **no cifrado**: cualquiera puede leerlo sin la llave. Lo que impide
falsificarlo es la firma, no el secreto del contenido.

`Sesion.getPayload()` lo decodifica y `InicioActivity` lo muestra en pantalla. Ahi se ven
el `sub` (el id del usuario), el `email`, el `role` y el `exp` (cuando vence).

De ahi la regla: en un JWT nunca se guarda informacion sensible, porque viaja a la vista.

## La llave publica en el codigo

`Supabase.java` lleva la URL del proyecto y la llave **publishable**. Esa llave esta hecha
para ir dentro de aplicaciones: respeta las politicas de seguridad de la base de datos.

La otra llave, la **secret**, salta todas esas politicas y nunca debe salir de un
servidor. Si acabara en un repositorio publico, cualquiera podria leer o borrar los datos
del proyecto.

## Errores traducidos

Supabase responde en ingles y sin formato: `Invalid login credentials`. El metodo
`explicar()` de `Supabase.java` los convierte en mensajes utiles:

| Respuesta de Supabase | Lo que ve el usuario |
|---|---|
| `Invalid login credentials` | Correo o contrasena incorrectos |
| `User already registered` | Ese correo ya tiene una cuenta |
| `Token has expired or is invalid` | El codigo es incorrecto o ya vencio |
| `Password should be at least 6 characters` | La contrasena debe tener al menos 6 caracteres |
| `Email rate limit exceeded` | Demasiados intentos. Espera unos minutos |

## Confirmacion de correo

Si en **Authentication > Sign In / Providers > Email** esta activo *Confirm email*, al
registrarse Supabase no devuelve sesion: manda un correo de confirmacion y hay que abrirlo
antes de poder entrar.

La aplicacion maneja los dos casos. Si llega sesion, entra directo; si no, muestra
"Cuenta creada. Revisa tu correo y confirma la cuenta antes de iniciar sesion."

## Como correrlo

Abrir la carpeta con **File > Open** en Android Studio, esperar el Gradle sync y ejecutar
en un emulador o en un dispositivo fisico con internet.

Si el correo de recuperacion no llega, revisar la carpeta de spam antes de buscar el
problema en el codigo: es lo mas comun usando Gmail como SMTP.
