package com.example.clonewhatsapp;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import java.nio.charset.StandardCharsets;
import java.security.KeyStore;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

public class Cifrado {

    private static final String ALMACEN = "AndroidKeyStore";
    private static final String ALIAS = "clave_sesion_chat";
    private static final String ALGORITMO = "AES/GCM/NoPadding";

    private static SecretKey clave() throws Exception {
        KeyStore almacen = KeyStore.getInstance(ALMACEN);
        almacen.load(null);

        if (almacen.containsAlias(ALIAS)) {
            KeyStore.SecretKeyEntry entrada =
                    (KeyStore.SecretKeyEntry) almacen.getEntry(ALIAS, null);
            return entrada.getSecretKey();
        }

        KeyGenerator generador = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ALMACEN);
        generador.init(new KeyGenParameterSpec.Builder(ALIAS,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build());

        return generador.generateKey();
    }

    public static String cifrar(String texto) {
        if (texto == null || texto.isEmpty()) {
            return "";
        }

        try {
            Cipher cifrador = Cipher.getInstance(ALGORITMO);
            cifrador.init(Cipher.ENCRYPT_MODE, clave());

            byte[] datos = cifrador.doFinal(texto.getBytes(StandardCharsets.UTF_8));

            return Base64.encodeToString(cifrador.getIV(), Base64.NO_WRAP)
                    + ":" + Base64.encodeToString(datos, Base64.NO_WRAP);
        } catch (Exception error) {
            return "";
        }
    }

    public static String descifrar(String guardado) {
        if (guardado == null || !guardado.contains(":")) {
            return "";
        }

        try {
            String[] partes = guardado.split(":");
            byte[] iv = Base64.decode(partes[0], Base64.NO_WRAP);
            byte[] datos = Base64.decode(partes[1], Base64.NO_WRAP);

            Cipher cifrador = Cipher.getInstance(ALGORITMO);
            cifrador.init(Cipher.DECRYPT_MODE, clave(), new GCMParameterSpec(128, iv));

            return new String(cifrador.doFinal(datos), StandardCharsets.UTF_8);
        } catch (Exception error) {
            return "";
        }
    }
}
