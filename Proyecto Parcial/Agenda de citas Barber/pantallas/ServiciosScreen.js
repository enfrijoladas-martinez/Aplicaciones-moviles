import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Barra from '../componentes/Barra';
import ModalServicio from '../componentes/ModalServicio';
import { colores, moneda, sombra } from '../estilos/tema';

export default function ServiciosScreen({ servicios, citas, alGuardarServicio }) {
  const [formulario, setFormulario] = useState(false);
  const [editando, setEditando] = useState(null);

  const resumen = servicios.map((s) => {
    const suyas = citas.filter((c) => c.servicioId === s.id && c.estado !== 'cancelada');
    const completadas = suyas.filter((c) => c.estado === 'completada');

    return {
      ...s,
      solicitudes: suyas.length,
      ingreso: completadas.length * s.precio,
      porHora: Math.round((s.precio / s.duracion) * 60),
    };
  });

  const maximo = resumen.reduce((mayor, s) => Math.max(mayor, s.solicitudes), 1);
  const ingresoTotal = resumen.reduce((suma, s) => suma + s.ingreso, 0);

  const guardar = (servicio) => {
    alGuardarServicio(servicio);
    setFormulario(false);
    setEditando(null);
  };

  return (
    <View style={estilos.pantalla}>
      <FlatList
        data={resumen.sort((a, b) => b.solicitudes - a.solicitudes)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={estilos.cabecera}>
            <Text style={estilos.cabeceraEtiqueta}>Ingreso por servicios</Text>
            <Text style={estilos.cabeceraValor}>{moneda(ingresoTotal)}</Text>
            <Text style={estilos.cabeceraNota}>
              {servicios.length} servicios en el catalogo
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={estilos.tarjeta}
            onPress={() => {
              setEditando(item);
              setFormulario(true);
            }}
          >
            <View style={estilos.encabezado}>
              <View style={estilos.icono}>
                <Ionicons name={item.icono} size={20} color={colores.primario} />
              </View>

              <View style={estilos.textos}>
                <Text style={estilos.nombre}>{item.nombre}</Text>
                <Text style={estilos.detalle}>
                  {item.duracion} min · {moneda(item.porHora)} por hora
                </Text>
              </View>

              <Text style={estilos.precio}>{moneda(item.precio)}</Text>
            </View>

            <Barra proporcion={item.solicitudes / maximo} color={colores.primario} />

            <View style={estilos.pie}>
              <Text style={estilos.solicitudes}>{item.solicitudes} veces agendado</Text>
              <Text style={estilos.ingreso}>{moneda(item.ingreso)} generados</Text>
            </View>
          </Pressable>
        )}
      />

      <Pressable
        style={estilos.flotante}
        onPress={() => {
          setEditando(null);
          setFormulario(true);
        }}
      >
        <Ionicons name="add" size={28} color={colores.superficie} />
      </Pressable>

      <ModalServicio
        visible={formulario}
        servicio={editando}
        alGuardar={guardar}
        alCerrar={() => {
          setFormulario(false);
          setEditando(null);
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    padding: 16,
    paddingBottom: 90,
  },
  cabecera: {
    backgroundColor: colores.primario,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  cabeceraEtiqueta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  cabeceraValor: {
    color: colores.superficie,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cabeceraNota: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 14,
    marginBottom: 11,
    ...sombra,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icono: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    marginHorizontal: 12,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  detalle: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.primario,
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  solicitudes: {
    fontSize: 12,
    color: colores.textoSuave,
  },
  ingreso: {
    fontSize: 12,
    fontWeight: '600',
    color: colores.exito,
  },
  flotante: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colores.primario,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colores.primario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
