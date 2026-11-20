# FaceRecognition

Actividad de Aplicaciones Moviles. React Native con Expo SDK 58.

**Alumno:** Elias Martinez Garcia
**Matricula:** 202260437

## 1. Deteccion de rostros con Viola-Jones

La app no manda la foto a ningun servidor: la analiza en el mismo telefono con el
algoritmo **Viola-Jones**, incluido en la libreria `tracking`.

Viola-Jones recorre la imagen con una ventana que va creciendo y en cada posicion
evalua **caracteristicas Haar**: restas entre zonas claras y oscuras (los ojos son mas
oscuros que las mejillas, el puente de la nariz es mas claro que los ojos). Las
evaluaciones se ordenan en una **cascada**: las primeras etapas descartan rapido las
zonas que claramente no son cara y solo las candidatas pasan a las etapas mas caras.

| Parametro | Valor | Significado |
|---|---|---|
| `initialScale` | 1 | Tamano inicial de la ventana |
| `scaleFactor` | 1.25 | Cuanto crece la ventana en cada pasada |
| `stepSize` | 1.5 | Cuanto se desplaza la ventana |
| `edgesDensity` | 0.2 | Descarta zonas casi lisas para ir mas rapido |

## 2. Flujo de la app

1. Pide permiso de **camara** (`useCameraPermissions`) y de **galeria**
   (`MediaLibrary.usePermissions`).
2. Muestra la camara frontal con un ovalo guia. El boton ⟲ cambia a la camara trasera.
3. Al tomar la foto se pide en `base64`.
4. `detectorRostros.js` decodifica el JPEG con `jpeg-js`, lo reduce a 480 px por lado
   para que el analisis sea rapido y corre Viola-Jones.
5. Cada rostro encontrado se dibuja como un recuadro verde sobre la foto. Las
   coordenadas se regresan como proporcion (0 a 1), asi el recuadro queda en su lugar
   sin importar el tamano de la pantalla.
6. El boton **Guardar** manda la foto a la galeria con `saveToLibraryAsync`.

## 3. Como correrla

```bash
npm install
npx expo start
```

Escanear el QR con Expo Go. Si el celular no esta en la misma red:
`npx expo start --tunnel`.
