package com.example.ultimacarta;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.view.View;

public class CartaView extends View {

    private static final int BLANCO = 0xFFFFFFFF;
    private static final int SOMBRA = 0x33000000;
    private static final int REVERSO_A = 0xFF23204A;
    private static final int REVERSO_B = 0xFF3B2F7A;
    private static final int DORADO = 0xFFF5C451;

    private final Paint pincel = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint texto = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF caja = new RectF();
    private final Path trazo = new Path();

    private Carta carta;
    private ColorCarta colorComodin;
    private boolean bocaAbajo = false;
    private boolean apagada = false;

    public CartaView(Context contexto) {
        super(contexto);
        iniciar();
    }

    public CartaView(Context contexto, AttributeSet atributos) {
        super(contexto, atributos);
        iniciar();
    }

    private void iniciar() {
        texto.setTextAlign(Paint.Align.CENTER);
        texto.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
    }

    public void mostrar(Carta carta, ColorCarta colorComodin) {
        this.carta = carta;
        this.colorComodin = colorComodin;
        this.bocaAbajo = false;
        invalidate();
    }

    public void mostrarReverso() {
        this.carta = null;
        this.bocaAbajo = true;
        invalidate();
    }

    public Carta getCarta() {
        return carta;
    }

    public void setApagada(boolean apagada) {
        this.apagada = apagada;
        setAlpha(apagada ? 0.45f : 1f);
    }

    public boolean estaApagada() {
        return apagada;
    }

    @Override
    protected void onMeasure(int anchoMedida, int altoMedida) {
        int ancho = MeasureSpec.getSize(anchoMedida);
        int alto = MeasureSpec.getSize(altoMedida);

        if (MeasureSpec.getMode(altoMedida) != MeasureSpec.EXACTLY) {
            alto = Math.round(ancho * 1.5f);
        }

        setMeasuredDimension(ancho, alto);
    }

    @Override
    protected void onDraw(Canvas lienzo) {
        float ancho = getWidth();
        float alto = getHeight();
        float radio = ancho * 0.12f;
        float margen = ancho * 0.04f;

        pincel.setShader(null);
        pincel.setStyle(Paint.Style.FILL);
        pincel.setColor(SOMBRA);
        caja.set(margen, margen * 1.6f, ancho - margen * 0.4f, alto - margen * 0.2f);
        lienzo.drawRoundRect(caja, radio, radio, pincel);

        caja.set(margen * 0.4f, margen * 0.4f, ancho - margen, alto - margen);
        pincel.setColor(BLANCO);
        lienzo.drawRoundRect(caja, radio, radio, pincel);

        float borde = ancho * 0.06f;
        caja.inset(borde, borde);

        if (bocaAbajo || carta == null) {
            dibujarReverso(lienzo, radio * 0.7f);
            return;
        }

        int fondo = carta.color.argb;
        pincel.setColor(fondo);
        lienzo.drawRoundRect(caja, radio * 0.7f, radio * 0.7f, pincel);

        dibujarFranja(lienzo);

        float centroX = caja.centerX();
        float centroY = caja.centerY();
        float circulo = caja.width() * 0.36f;

        pincel.setColor(BLANCO);
        lienzo.drawCircle(centroX, centroY, circulo, pincel);

        if (carta.esComodin()) {
            dibujarRueda(lienzo, centroX, centroY, circulo * 0.82f);
        }

        int tinta = carta.esComodin()
                ? (colorComodin != null && colorComodin != ColorCarta.NEGRO ? colorComodin.argb : 0xFF1F2333)
                : fondo;

        dibujarSimbolo(lienzo, centroX, centroY, circulo, tinta, true);

        float esquina = caja.width() * 0.2f;
        dibujarSimboloChico(lienzo, caja.left + esquina, caja.top + esquina * 1.1f, esquina);

        lienzo.save();
        lienzo.rotate(180, caja.right - esquina, caja.bottom - esquina * 1.1f);
        dibujarSimboloChico(lienzo, caja.right - esquina, caja.bottom - esquina * 1.1f, esquina);
        lienzo.restore();

        if (carta.esComodin() && colorComodin != null && colorComodin != ColorCarta.NEGRO) {
            pincel.setStyle(Paint.Style.STROKE);
            pincel.setStrokeWidth(ancho * 0.05f);
            pincel.setColor(colorComodin.argb);
            lienzo.drawRoundRect(caja, radio * 0.7f, radio * 0.7f, pincel);
            pincel.setStyle(Paint.Style.FILL);
        }
    }

    private void dibujarFranja(Canvas lienzo) {
        lienzo.save();
        lienzo.clipRect(caja);
        pincel.setColor(0x26FFFFFF);
        trazo.reset();
        trazo.moveTo(caja.left, caja.bottom - caja.height() * 0.25f);
        trazo.lineTo(caja.right, caja.top + caja.height() * 0.15f);
        trazo.lineTo(caja.right, caja.top + caja.height() * 0.40f);
        trazo.lineTo(caja.left, caja.bottom);
        trazo.close();
        lienzo.drawPath(trazo, pincel);
        lienzo.restore();
    }

    private void dibujarRueda(Canvas lienzo, float x, float y, float radio) {
        RectF arco = new RectF(x - radio, y - radio, x + radio, y + radio);

        for (int i = 0; i < 4; i++) {
            pincel.setColor(ColorCarta.JUGABLES[i].argb);
            lienzo.drawArc(arco, -90 + i * 90, 90, true, pincel);
        }

        pincel.setColor(BLANCO);
        lienzo.drawCircle(x, y, radio * 0.55f, pincel);
    }

    private void dibujarSimbolo(Canvas lienzo, float x, float y, float circulo, int tinta, boolean grande) {
        switch (carta.tipo) {
            case SALTO:
                dibujarSalto(lienzo, x, y, circulo * 0.55f, tinta);
                break;
            case REVERSA:
                dibujarReversa(lienzo, x, y, circulo * 0.6f, tinta);
                break;
            case COMODIN:
                pincel.setColor(tinta);
                lienzo.drawCircle(x, y, circulo * 0.18f, pincel);
                break;
            default:
                String letra = carta.tipo == TipoCarta.NUMERO ? String.valueOf(carta.numero)
                        : carta.tipo == TipoCarta.MAS_DOS ? "+2" : "+4";
                float tamano = carta.tipo == TipoCarta.NUMERO ? circulo * 1.15f : circulo * 0.72f;
                texto.setTextSize(carta.tipo == TipoCarta.MAS_CUATRO ? tamano * 0.85f : tamano);
                texto.setColor(tinta);
                lienzo.drawText(letra, x, y - (texto.descent() + texto.ascent()) / 2, texto);
                break;
        }
    }

    private void dibujarSimboloChico(Canvas lienzo, float x, float y, float tamano) {
        texto.setColor(BLANCO);

        switch (carta.tipo) {
            case SALTO:
                dibujarSalto(lienzo, x, y, tamano * 0.42f, BLANCO);
                return;
            case REVERSA:
                dibujarReversa(lienzo, x, y, tamano * 0.5f, BLANCO);
                return;
            case COMODIN:
                pincel.setColor(BLANCO);
                lienzo.drawCircle(x, y, tamano * 0.22f, pincel);
                return;
            default:
                String letra = carta.tipo == TipoCarta.NUMERO ? String.valueOf(carta.numero)
                        : carta.tipo == TipoCarta.MAS_DOS ? "+2" : "+4";
                texto.setTextSize(tamano * 0.95f);
                lienzo.drawText(letra, x, y - (texto.descent() + texto.ascent()) / 2, texto);
        }
    }

    private void dibujarSalto(Canvas lienzo, float x, float y, float radio, int tinta) {
        pincel.setStyle(Paint.Style.STROKE);
        pincel.setStrokeWidth(radio * 0.32f);
        pincel.setStrokeCap(Paint.Cap.ROUND);
        pincel.setColor(tinta);
        lienzo.drawCircle(x, y, radio, pincel);

        float d = radio * 0.7f;
        lienzo.drawLine(x - d, y + d, x + d, y - d, pincel);
        pincel.setStyle(Paint.Style.FILL);
    }

    private void dibujarReversa(Canvas lienzo, float x, float y, float tamano, int tinta) {
        pincel.setColor(tinta);
        pincel.setStyle(Paint.Style.STROKE);
        pincel.setStrokeWidth(tamano * 0.24f);
        pincel.setStrokeCap(Paint.Cap.ROUND);

        float separacion = tamano * 0.35f;
        float largo = tamano * 0.8f;

        lienzo.drawLine(x - largo, y - separacion, x + largo * 0.6f, y - separacion, pincel);
        lienzo.drawLine(x + largo, y + separacion, x - largo * 0.6f, y + separacion, pincel);

        pincel.setStyle(Paint.Style.FILL);
        float punta = tamano * 0.42f;

        trazo.reset();
        trazo.moveTo(x + largo + punta * 0.2f, y - separacion);
        trazo.lineTo(x + largo - punta * 0.8f, y - separacion - punta);
        trazo.lineTo(x + largo - punta * 0.8f, y - separacion + punta);
        trazo.close();
        lienzo.drawPath(trazo, pincel);

        trazo.reset();
        trazo.moveTo(x - largo - punta * 0.2f, y + separacion);
        trazo.lineTo(x - largo + punta * 0.8f, y + separacion - punta);
        trazo.lineTo(x - largo + punta * 0.8f, y + separacion + punta);
        trazo.close();
        lienzo.drawPath(trazo, pincel);
    }

    private void dibujarReverso(Canvas lienzo, float radio) {
        pincel.setShader(new LinearGradient(caja.left, caja.top, caja.right, caja.bottom,
                REVERSO_A, REVERSO_B, Shader.TileMode.CLAMP));
        lienzo.drawRoundRect(caja, radio, radio, pincel);
        pincel.setShader(null);

        pincel.setStyle(Paint.Style.STROKE);
        pincel.setStrokeWidth(caja.width() * 0.03f);
        pincel.setColor(0x55F5C451);

        RectF interior = new RectF(caja);
        interior.inset(caja.width() * 0.1f, caja.width() * 0.1f);
        lienzo.drawRoundRect(interior, radio * 0.6f, radio * 0.6f, pincel);
        pincel.setStyle(Paint.Style.FILL);

        float x = caja.centerX();
        float y = caja.centerY();
        float lado = caja.width() * 0.22f;

        lienzo.save();
        lienzo.rotate(45, x, y);
        for (int i = 0; i < 4; i++) {
            pincel.setColor(ColorCarta.JUGABLES[i].argb);
            float dx = (i % 2 == 0 ? -1 : 1) * lado * 0.55f;
            float dy = (i < 2 ? -1 : 1) * lado * 0.55f;
            lienzo.drawRect(x + dx - lado / 2, y + dy - lado / 2, x + dx + lado / 2, y + dy + lado / 2, pincel);
        }
        lienzo.restore();

        texto.setColor(DORADO);
        texto.setTextSize(caja.width() * 0.13f);
        lienzo.drawText("ULTIMA", x, caja.bottom - caja.height() * 0.1f, texto);
    }
}
