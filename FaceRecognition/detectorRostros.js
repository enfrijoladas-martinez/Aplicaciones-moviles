import { toByteArray } from 'base64-js';
import jpeg from 'jpeg-js';
import 'tracking/build/tracking.js';
import 'tracking/build/data/face-min.js';

const tracking = globalThis.tracking;
const LADO_MAXIMO = 480;

function reducir(imagen) {
  const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));
  const ancho = Math.max(1, Math.round(imagen.width * escala));
  const alto = Math.max(1, Math.round(imagen.height * escala));

  if (escala === 1) {
    return { pixeles: imagen.data, ancho, alto };
  }

  const pixeles = new Uint8Array(ancho * alto * 4);

  for (let y = 0; y < alto; y += 1) {
    const origenY = Math.min(imagen.height - 1, Math.floor(y / escala));

    for (let x = 0; x < ancho; x += 1) {
      const origenX = Math.min(imagen.width - 1, Math.floor(x / escala));
      const origen = (origenY * imagen.width + origenX) * 4;
      const destino = (y * ancho + x) * 4;

      pixeles[destino] = imagen.data[origen];
      pixeles[destino + 1] = imagen.data[origen + 1];
      pixeles[destino + 2] = imagen.data[origen + 2];
      pixeles[destino + 3] = 255;
    }
  }

  return { pixeles, ancho, alto };
}

export function detectarRostros(base64) {
  const imagen = jpeg.decode(toByteArray(base64), { useTArray: true });
  const { pixeles, ancho, alto } = reducir(imagen);

  const encontrados = tracking.ViolaJones.detect(
    pixeles,
    ancho,
    alto,
    1,
    1.25,
    1.5,
    0.2,
    tracking.ViolaJones.classifiers.face
  );

  return {
    proporcion: imagen.width / imagen.height,
    rostros: encontrados.map((rostro) => ({
      x: rostro.x / ancho,
      y: rostro.y / alto,
      ancho: rostro.width / ancho,
      alto: rostro.height / alto,
    })),
  };
}
