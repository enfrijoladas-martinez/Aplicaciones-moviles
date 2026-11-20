package com.example.clonewhatsapp;

import android.app.Application;
import android.content.Context;

public class App extends Application {

    private static Context contexto;

    @Override
    public void onCreate() {
        super.onCreate();
        contexto = getApplicationContext();
    }

    public static Context contexto() {
        return contexto;
    }
}
