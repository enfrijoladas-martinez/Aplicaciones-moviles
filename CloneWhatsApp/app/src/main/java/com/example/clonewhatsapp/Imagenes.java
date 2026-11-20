package com.example.clonewhatsapp;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.LruCache;
import android.widget.ImageView;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class Imagenes {

    private static final ExecutorService HILOS = Executors.newFixedThreadPool(3);
    private static final Handler PRINCIPAL = new Handler(Looper.getMainLooper());

    private static final LruCache<String, Bitmap> MEMORIA =
            new LruCache<String, Bitmap>((int) (Runtime.getRuntime().maxMemory() / 1024 / 8)) {
                @Override
                protected int sizeOf(String llave, Bitmap imagen) {
                    return imagen.getByteCount() / 1024;
                }
            };

    public static void cargar(ImageView vista, String url, int respaldo) {
        vista.setTag(R.id.etiqueta_url, url);

        if (url == null || url.isEmpty() || "null".equals(url)) {
            vista.setImageResource(respaldo);
            return;
        }

        Bitmap guardada = MEMORIA.get(url);

        if (guardada != null) {
            vista.setImageBitmap(guardada);
            return;
        }

        vista.setImageResource(respaldo);

        HILOS.execute(() -> {
            Bitmap imagen = descargar(url);

            if (imagen == null) {
                return;
            }

            MEMORIA.put(url, imagen);

            PRINCIPAL.post(() -> {
                if (url.equals(vista.getTag(R.id.etiqueta_url))) {
                    vista.setImageBitmap(imagen);
                }
            });
        });
    }

    private static Bitmap descargar(String url) {
        Request pedido = new Request.Builder().url(url).build();

        try (Response respuesta = Supabase.cliente().newCall(pedido).execute()) {
            ResponseBody cuerpo = respuesta.body();

            if (!respuesta.isSuccessful() || cuerpo == null) {
                return null;
            }

            byte[] datos = cuerpo.bytes();

            BitmapFactory.Options medidas = new BitmapFactory.Options();
            medidas.inJustDecodeBounds = true;
            BitmapFactory.decodeByteArray(datos, 0, datos.length, medidas);

            BitmapFactory.Options opciones = new BitmapFactory.Options();
            opciones.inSampleSize = muestreo(medidas, 1080);

            return BitmapFactory.decodeByteArray(datos, 0, datos.length, opciones);
        } catch (Exception error) {
            return null;
        }
    }

    public static byte[] comprimir(Context contexto, Uri origen, int maximo) throws Exception {
        BitmapFactory.Options medidas = new BitmapFactory.Options();
        medidas.inJustDecodeBounds = true;

        try (InputStream flujo = contexto.getContentResolver().openInputStream(origen)) {
            BitmapFactory.decodeStream(flujo, null, medidas);
        }

        BitmapFactory.Options opciones = new BitmapFactory.Options();
        opciones.inSampleSize = muestreo(medidas, maximo);

        Bitmap imagen;

        try (InputStream flujo = contexto.getContentResolver().openInputStream(origen)) {
            imagen = BitmapFactory.decodeStream(flujo, null, opciones);
        }

        if (imagen == null) {
            throw new Exception("No se pudo leer la imagen");
        }

        int ancho = imagen.getWidth();
        int alto = imagen.getHeight();
        float escala = Math.min(1f, (float) maximo / Math.max(ancho, alto));

        if (escala < 1f) {
            imagen = Bitmap.createScaledBitmap(imagen,
                    Math.round(ancho * escala), Math.round(alto * escala), true);
        }

        ByteArrayOutputStream salida = new ByteArrayOutputStream();
        imagen.compress(Bitmap.CompressFormat.JPEG, 80, salida);
        return salida.toByteArray();
    }

    private static int muestreo(BitmapFactory.Options medidas, int maximo) {
        int muestra = 1;
        int lado = Math.max(medidas.outWidth, medidas.outHeight);

        while (lado / (muestra * 2) >= maximo) {
            muestra *= 2;
        }

        return muestra;
    }
}
