package com.example.persistenciaandroid;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

public class MainActivity extends AppCompatActivity {

    private View punto;
    private TextView estadoTitulo;
    private TextView estadoDetalle;

    private Button agregar;
    private Button consultar;
    private Button actualizar;
    private Button eliminar;

    private String pestana = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        punto = findViewById(R.id.punto);
        estadoTitulo = findViewById(R.id.estadoTitulo);
        estadoDetalle = findViewById(R.id.estadoDetalle);

        agregar = findViewById(R.id.botonAgregar);
        consultar = findViewById(R.id.botonConsultar);
        actualizar = findViewById(R.id.botonActualizar);
        eliminar = findViewById(R.id.botonEliminar);

        agregar.setOnClickListener(v -> mostrar("agregar"));
        consultar.setOnClickListener(v -> mostrar("consultar"));
        actualizar.setOnClickListener(v -> mostrar("actualizar"));
        eliminar.setOnClickListener(v -> mostrar("eliminar"));

        findViewById(R.id.barraEstado).setOnClickListener(v -> probarConexion());

        if (savedInstanceState == null) {
            mostrar("agregar");
        }

        probarConexion();
    }

    public void avisarCambio() {
        probarConexion();
    }

    private void mostrar(String cual) {
        if (cual.equals(pestana)) {
            return;
        }

        pestana = cual;
        Fragment destino;

        switch (cual) {
            case "consultar":
                destino = new ConsultarFragment();
                break;
            case "actualizar":
                destino = new ActualizarFragment();
                break;
            case "eliminar":
                destino = new EliminarFragment();
                break;
            default:
                destino = new AgregarFragment();
                break;
        }

        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.contenedor, destino)
                .commit();

        pintarPestanas();
    }

    private void pintarPestanas() {
        pintar(agregar, "agregar");
        pintar(consultar, "consultar");
        pintar(actualizar, "actualizar");
        pintar(eliminar, "eliminar");
    }

    private void pintar(Button boton, String cual) {
        boolean activa = pestana.equals(cual);
        boton.setBackgroundColor(getColor(activa ? R.color.azul : R.color.gris_claro));
        boton.setTextColor(getColor(activa ? R.color.blanco : R.color.gris));
    }

    private void probarConexion() {
        estadoTitulo.setText("Probando conexion...");
        estadoTitulo.setTextColor(getColor(R.color.amarillo));
        estadoDetalle.setText(Supabase.URL_BASE);
        punto.setBackgroundColor(getColor(R.color.amarillo));

        Supabase.contar(new Supabase.Respuesta<Integer>() {
            @Override
            public void listo(Integer total) {
                estadoTitulo.setText("Conectado a Supabase");
                estadoTitulo.setTextColor(getColor(R.color.verde));
                estadoDetalle.setText("Tabla productos con " + total + " registros");
                punto.setBackgroundColor(getColor(R.color.verde));
            }

            @Override
            public void fallo(String mensaje) {
                estadoTitulo.setText("Sin conexion");
                estadoTitulo.setTextColor(getColor(R.color.rojo));
                estadoDetalle.setText(mensaje);
                punto.setBackgroundColor(Color.RED);
            }
        });
    }
}
