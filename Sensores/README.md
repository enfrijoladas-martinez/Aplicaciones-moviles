# Sensores y NavDrawer

Actividad de la sesion del 29 de octubre. Android Studio, Java, minSdk 27.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

Seis sensores, cada uno en su propia Activity, integrados con un menu lateral
NavDrawer, y una pantalla de bienvenida animada.

## 1. Investigacion: como se usan los sensores en Android

### El patron general

Casi todo en Android pasa por el **SensorManager**, el servicio del sistema que entrega
las lecturas. El patron es siempre el mismo:

```java
SensorManager gestor = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
Sensor sensor = gestor.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

gestor.registerListener(this, sensor, SensorManager.SENSOR_DELAY_UI);
```

La Activity implementa `SensorEventListener`, que obliga a dos metodos:

- **`onSensorChanged(SensorEvent)`**: llega una lectura nueva. El arreglo `values`
  trae los datos, y su significado depende del sensor.
- **`onAccuracyChanged(Sensor, int)`**: cambio la confiabilidad del sensor.

`getDefaultSensor` devuelve **null** si el equipo no trae ese sensor. Hay que revisarlo
siempre: no todos los telefonos traen giroscopio ni podometro.

### Velocidades de muestreo

| Constante | Aproximado | Para que sirve |
|---|---|---|
| `SENSOR_DELAY_NORMAL` | 200 ms | Cambios de orientacion de la pantalla |
| `SENSOR_DELAY_UI` | 60 ms | Mostrar valores al usuario |
| `SENSOR_DELAY_GAME` | 20 ms | Juegos, seguimiento de movimiento |
| `SENSOR_DELAY_FASTEST` | lo mas rapido posible | Gasta mucha bateria |

Son **sugerencias**, no garantias: el sistema puede entregar mas lento.

### Registrar y dar de baja

El detalle que mas se olvida: hay que dar de baja al listener.

```java
@Override
protected void onResume() {
    super.onResume();
    gestor.registerListener(this, sensor, SensorManager.SENSOR_DELAY_UI);
}

@Override
protected void onPause() {
    super.onPause();
    gestor.unregisterListener(this);
}
```

Si no se hace, el sensor sigue entregando lecturas con la pantalla apagada y se come la
bateria. Es el error numero uno con sensores.

### Los seis de esta actividad

| Sensor | Constante o API | Unidades | Permiso |
|---|---|---|---|
| Acelerometro | `TYPE_ACCELEROMETER` | m/s2 | ninguno |
| Giroscopio | `TYPE_GYROSCOPE` | rad/s | ninguno |
| Podometro | `TYPE_STEP_COUNTER` | pasos | `ACTIVITY_RECOGNITION` |
| Magnetometro | `TYPE_MAGNETIC_FIELD` | microteslas | ninguno |
| GPS | `LocationManager` | grados decimales | `ACCESS_FINE_LOCATION` |
| Camara | `ACTION_IMAGE_CAPTURE` | imagen | ninguno con Intent |

**Acelerometro.** Mide aceleracion en los tres ejes e **incluye la gravedad**. En reposo
sobre la mesa el eje Z marca cerca de 9.8, no cero. Si se quiere solo el movimiento del
usuario hay que restarle la gravedad, o usar `TYPE_LINEAR_ACCELERATION`.

**Giroscopio.** Mide **velocidad** angular, no posicion. En reposo marca casi cero aunque
el telefono este inclinado. Para saber cuanto giro hay que integrar: multiplicar la
velocidad por el tiempo entre lecturas e ir sumando. Eso acumula error con el tiempo,
asi que para orientacion absoluta se combina con otros sensores.

**Podometro.** No es software: es hardware dedicado de bajo consumo. Tiene dos variantes:
`TYPE_STEP_COUNTER` da el total desde que arranco el telefono y nunca se reinicia solo,
y `TYPE_STEP_DETECTOR` lanza un evento por cada paso.

**Magnetometro.** Mide el campo magnetico. El de la Tierra anda entre 25 y 65 uT. Por si
solo no sirve como brujula: hay que saber como esta inclinado el telefono, asi que se
combina con el acelerometro mediante `getRotationMatrix` y `getOrientation`.

**GPS.** No pasa por `SensorManager` sino por `LocationManager`, y no es exactamente un
sensor: es un receptor de radio que escucha satelites. No necesita internet, pero tarda
en obtener el primer fijo y no funciona bajo techo.

**Camara.** Tampoco pasa por `SensorManager`. Hay dos caminos: manejar el hardware con
`CameraX` o `Camera2`, o lanzar un Intent y dejar que lo haga la aplicacion de camara
del sistema. Aqui se usa el Intent, que es lo que se vio en `DemoIntent`.

## 2. Un ejemplo por sensor, cada uno en su Activity

| Activity | Que muestra |
|---|---|
| `AcelerometroActivity` | Los tres ejes con barras, la magnitud total y un contador de sacudidas |
| `GiroscopioActivity` | Velocidad angular, grados acumulados y un cuadro que gira con el eje Z |
| `PodometroActivity` | Pasos de la sesion, total desde el arranque y el permiso en tiempo de ejecucion |
| `MagnetometroActivity` | Brujula con aguja, rumbo en texto y el campo en los tres ejes |
| `GpsActivity` | Latitud, longitud, precision, altitud, velocidad y proveedor |
| `CamaraActivity` | Lanza la camara y muestra la foto que regresa |

Todas heredan de **`BaseDrawerActivity`**, que arma el menu una sola vez. Cada Activity
hija solo dice tres cosas:

```java
protected abstract int getLayoutContenido();
protected abstract String getTituloPantalla();
protected abstract int getItemMenu();
```

Asi el menu es identico en las siete pantallas sin repetir el codigo siete veces.

## 3. El NavDrawer

Tres piezas:

- **`DrawerLayout`**: el contenedor. Su primer hijo es el contenido; el segundo, el panel
  que se desliza, marcado con `android:layout_gravity="start"`.
- **`NavigationView`**: el panel. Recibe `app:headerLayout` (la cabecera con el nombre) y
  `app:menu` (las opciones).
- **`ActionBarDrawerToggle`**: conecta el icono de las tres rayas de la Toolbar con el
  cajon, y anima el icono al abrirlo.

```java
ActionBarDrawerToggle palanca = new ActionBarDrawerToggle(
        this, cajon, barra, R.string.abrir_cajon, R.string.cerrar_cajon);

cajon.addDrawerListener(palanca);
palanca.syncState();
```

`syncState()` es obligatorio: sin el, el icono no aparece.

El menu esta agrupado en dos secciones con `<group android:checkableBehavior="single">`,
que es lo que hace que solo quede una opcion marcada a la vez.

Como cada sensor es una Activity distinta, al elegir una opcion se lanza un Intent:

```java
Intent viaje = new Intent(this, destino);
viaje.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
startActivity(viaje);
```

Los flags evitan que se apilen diez copias de la misma pantalla al navegar en circulos.

## 4. La animacion del SplashScreen

`SplashActivity` es la unica Activity exportada: es la que arranca la app. Combina dos
formas de animar.

**Animacion por XML** (`res/anim/girar.xml`), para el anillo que da vueltas:

```xml
<rotate
    android:duration="1600"
    android:fromDegrees="0"
    android:toDegrees="360"
    android:pivotX="50%"
    android:pivotY="50%"
    android:repeatCount="infinite" />
```

**Animacion por codigo** (`ViewPropertyAnimator`), para lo demas:

```java
punto.animate()
        .scaleX(1f).scaleY(1f)
        .setDuration(700)
        .setInterpolator(new OvershootInterpolator())
        .start();
```

El `OvershootInterpolator` hace que el circulo se pase de tamano y regrese, que es lo que
da la sensacion de rebote. Los textos entran despues con `setStartDelay`, para que las
tres cosas no aparezcan al mismo tiempo.

Al terminar, un `postDelayed` lanza `InicioActivity` y llama a `finish()`, para que el
boton de atras no regrese a la pantalla de carga.

Ojo: desde Android 12 el sistema pone **su propia** splash con el icono de la app antes
de que corra cualquier codigo. La animada de aqui aparece despues de esa.

## 5. Preguntas que pueden salir

**Por que `getDefaultSensor` puede devolver null**
Porque no todos los equipos traen todos los sensores. En este proyecto el emulador trae
acelerometro, giroscopio y magnetometro pero **no** podometro, y la app lo dice en
pantalla en vez de tronar.

**Diferencia entre acelerometro y giroscopio**
El acelerometro mide aceleracion lineal (incluida la gravedad) y sirve para saber como
esta inclinado el telefono en reposo. El giroscopio mide velocidad de giro y sirve para
movimientos rapidos, pero no sabe nada cuando el telefono esta quieto.

**Por que el podometro necesita permiso y el acelerometro no**
Porque cuenta como dato personal: con el numero de pasos se puede inferir cuanto se mueve
una persona. El acelerometro crudo no esta clasificado asi. Desde Android 10 el permiso
es `ACTIVITY_RECOGNITION` y se pide en tiempo de ejecucion.

**Por que declarar el permiso en el manifest no alcanza**
Desde Android 6 los permisos considerados peligrosos (ubicacion, camara, microfono,
contactos, actividad fisica) se piden **dos veces**: una en el manifest, en tiempo de
compilacion, y otra con un dialogo cuando se van a usar. El usuario puede negarlos y la
app tiene que seguir funcionando.

**Que es `<queries>` y por que hizo falta**
Desde Android 11 una app no puede ver que otras aplicaciones estan instaladas. Si se
llama a `resolveActivity()` para saber si hay camara, devuelve **null** aunque la camara
exista. Hay que declarar que intents interesan:

```xml
<queries>
    <intent>
        <action android:name="android.media.action.IMAGE_CAPTURE" />
    </intent>
</queries>
```

Sin esto la pantalla de camara decia que no habia aplicacion de camara, y si la habia.
Es un error silencioso: compila bien y falla solo al ejecutarse en Android 11 o mas.

**Por que la foto sale tan chica**
Porque `extras.get("data")` devuelve una **miniatura**, no la foto completa. Es suficiente
para mostrarla en pantalla. Para la original hay que pasarle al Intent un
`EXTRA_OUTPUT` con un `FileProvider` apuntando a donde guardarla.

**Por que el GPS no necesita internet**
Porque es un receptor que escucha satelites. Lo que si necesita internet es ver la
ubicacion sobre un mapa, porque los mosaicos del mapa se descargan.

**Que hace `FLAG_ACTIVITY_CLEAR_TOP`**
Si la Activity de destino ya esta en la pila, cierra todas las que estan encima en vez de
crear otra copia. Sin el, navegar entre sensores con el menu dejaria una pila enorme y el
boton de atras tardaria diez toques en salir.

## Como correrlo

Abrir la carpeta con **File > Open** en Android Studio, esperar el Gradle sync y ejecutar
en un emulador o en un dispositivo fisico.

En un emulador se pueden simular los sensores desde los **Extended Controls** (los tres
puntos de la barra lateral), en la seccion *Virtual sensors*, y la ubicacion en
*Location*. El podometro no se simula.
