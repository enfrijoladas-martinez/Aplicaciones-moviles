package com.example.layouts;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button botonLinear=
                findViewById(R.id.botonLinear);

        botonLinear.setOnClickListener(v ->{
            Intent intent = new
                    Intent(MainActivity.this,
                    LinearActivity.class);
            startActivity(intent);
        } );

        Button botonRelative=
                findViewById(R.id.botonRelative);

        botonRelative.setOnClickListener(v ->{
            Intent intent = new
                    Intent(MainActivity.this,
                    RelativeActivity.class);
            startActivity(intent);
        } );

        Button botonFrame=
                findViewById(R.id.botonFrame);

        botonFrame.setOnClickListener(v ->{
            Intent intent = new
                    Intent(MainActivity.this,
                    FrameActivity.class);
            startActivity(intent);
        } );

        Button botonTable=
                findViewById(R.id.botonTable);

        botonTable.setOnClickListener(v ->{
            Intent intent = new
                    Intent(MainActivity.this,
                    TableActivity.class);
            startActivity(intent);
        } );

    }
}
