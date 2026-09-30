import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, moneda, sombra } from '../estilos/tema';

export default function ClientesScreen({ clientes, citas, servicios }) {
  const [busqueda, setBusqueda] = useState('');
  const [abierto, setAbierto] = useState(null);

  const resumen = clientes.map((c) => {
    const suyas = citas.filter((x) => x.clienteId === c.id);
    const completadas = suyas.filter((x) => x.estado === 'completada');

    const gastado = completadas.reduce((suma, x) => {
      const s = servicios.find((y) => y.id === x.servicioId);
      return suma + (s ? s.precio : 0);
    }, 0);

    const conteo = {};
    suyas.forEach((x) => {
      conteo[x.servicioId] = (conteo[x.servicioId] || 0) + 1;
    });

    let favoritoId = null;
    Object.keys(conteo).forEach((id) => {
      if (favoritoId === null || conteo[id] > conteo[favoritoId]) favoritoId = id;
    });

    const favorito = servicios.find((s) => s.id === favoritoId);

    return {
      ...c,
      visitas: completadas.length,
      agendadas: suyas.filter((x) => x.estado === 'pendiente').length,
      gastado: gastado,
      promedio: completadas.length > 0 ? gastado / completadas.length : 0,
      favorito: favorito ? favorito.nombre : 'Sin historial',
    };
  });

  const visibles = resumen
    .filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => b.gastado - a.gastado);

  const totalClientes = clientes.length;
  const derrama = resumen.reduce((suma, c) => suma + c.gastado, 0);

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.resumen}>
        <View style={estilos.bloqueResumen}>
          <Text style={estilos.numeroResumen}>{totalClientes}</Text>
          <Text style={estilos.etiquetaResumen}>Clientes</Text>
        </View>

        <View style={estilos.divisor} />

        <View style={estilos.bloqueResumen}>
          <Text style={estilos.numeroResumen}>{moneda(derrama)}</Text>
          <Text style={estilos.etiquetaResumen}>Facturado</Text>
        </View>

        <View style={estilos.divisor} />

        <View style={estilos.bloqueResumen}>
          <Text style={estilos.numeroResumen}>
            {totalClientes > 0 ? moneda(derrama / totalClientes) : moneda(0)}
          </Text>
          <Text style={estilos.etiquetaResumen}>Promedio</Text>
        </View>
      </View>

      <View style={estilos.buscador}>
        <Ionicons name="search" size={18} color={colores.textoSuave} />
        <TextInput
          style={estilos.campo}
          placeholder="Buscar cliente..."
          placeholderTextColor={colores.textoSuave}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <FlatList
        data={visibles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={estilos.tarjeta}
            onPress={() => setAbierto(abierto === item.id ? null : item.id)}
          >
            <View style={estilos.encabezado}>
              <View style={estilos.avatar}>
                <Text style={estilos.inicial}>{item.nombre.charAt(0)}</Text>
              </View>

              <View style={estilos.textos}>
                <Text style={estilos.nombre}>{item.nombre}</Text>
                <Text style={estilos.telefono}>{item.telefono}</Text>
              </View>

              <View style={estilos.derecha}>
                <Text style={estilos.gastado}>{moneda(item.gastado)}</Text>
                <Text style={estilos.visitas}>{item.visitas} visitas</Text>
              </View>
            </View>

            {abierto === item.id && (
              <View style={estilos.detalle}>
                <Renglon etiqueta="Servicio frecuente" valor={item.favorito} />
                <Renglon etiqueta="Ticket promedio" valor={moneda(item.promedio)} />
                <Renglon
                  etiqueta="Citas por atender"
                  valor={String(item.agendadas)}
                />
              </View>
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={estilos.vacio}>
            <Ionicons name="people-outline" size={42} color={colores.borde} />
            <Text style={estilos.vacioTexto}>No hay clientes que coincidan</Text>
          </View>
        }
      />
    </View>
  );
}

function Renglon({ etiqueta, valor }) {
  return (
    <View style={estilos.renglon}>
      <Text style={estilos.renglonEtiqueta}>{etiqueta}</Text>
      <Text style={estilos.renglonValor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 16,
    ...sombra,
  },
  bloqueResumen: {
    flex: 1,
    alignItems: 'center',
  },
  divisor: {
    width: 1,
    height: 28,
    backgroundColor: colores.borde,
  },
  numeroResumen: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colores.texto,
  },
  etiquetaResumen: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 2,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  campo: {
    flex: 1,
    paddingVertical: 11,
    marginLeft: 8,
    fontSize: 15,
    color: colores.texto,
  },
  lista: {
    padding: 16,
    paddingBottom: 30,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    ...sombra,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.primario,
  },
  textos: {
    flex: 1,
    marginLeft: 12,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  telefono: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  derecha: {
    alignItems: 'flex-end',
  },
  gastado: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colores.primario,
  },
  visitas: {
    fontSize: 11,
    color: colores.textoSuave,
    marginTop: 2,
  },
  detalle: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  renglon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  renglonEtiqueta: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  renglonValor: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.texto,
  },
  vacio: {
    alignItems: 'center',
    marginTop: 50,
  },
  vacioTexto: {
    color: colores.textoSuave,
    fontSize: 14,
    marginTop: 10,
  },
});
