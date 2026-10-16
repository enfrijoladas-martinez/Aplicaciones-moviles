package com.example.fragmentado;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

public class MainActivity extends AppCompatActivity {

    private TextView textoActivo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textoActivo = findViewById(R.id.textoActivo);

        Button botonPerfil = findViewById(R.id.botonPerfil);
        Button botonContador = findViewById(R.id.botonContador);
        Button botonColores = findViewById(R.id.botonColores);
        Button botonQuitar = findViewById(R.id.botonQuitar);

        botonPerfil.setOnClickListener(v ->
                mostrar(PerfilFragment.nuevo("Elias Martinez", "202260437", 8),
                        "PerfilFragment"));

        botonContador.setOnClickListener(v ->
                mostrar(ContadorFragment.nuevo(10, 5), "ContadorFragment"));

        botonColores.setOnClickListener(v ->
                mostrar(ColoresFragment.nuevo("Azul"), "ColoresFragment"));

        botonQuitar.setOnClickListener(v -> quitar());
    }

    private void mostrar(Fragment fragmento, String nombre) {
        FragmentTransaction transaccion = getSupportFragmentManager().beginTransaction();
        transaccion.replace(R.id.contenedorFragmentos, fragmento, nombre);
        transaccion.addToBackStack(nombre);
        transaccion.commit();

        textoActivo.setText("Fragmento activo: " + nombre);
    }

    private void quitar() {
        Fragment actual = getSupportFragmentManager()
                .findFragmentById(R.id.contenedorFragmentos);

        if (actual == null) {
            textoActivo.setText("No hay ningun fragmento que quitar");
            return;
        }

        FragmentTransaction transaccion = getSupportFragmentManager().beginTransaction();
        transaccion.remove(actual);
        transaccion.commit();

        getSupportFragmentManager().popBackStack();

        textoActivo.setText("Contenedor vacio");
    }
}
