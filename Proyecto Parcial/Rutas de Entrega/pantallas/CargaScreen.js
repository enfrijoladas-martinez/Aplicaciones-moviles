import { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Barra from '../componentes/Barra';
import ModalPaquete from '../componentes/ModalPaquete';
import { colores, sombra } from '../estilos/tema';
import { haversine } from '../utilidades/geo';
import { coloresZona, zonas } from '../datos/paquetes';

const coloresPrioridad = {
  alta: colores.peligro,
  normal: colores.primario,
  baja: colores.textoSuave,
};

export default function CargaScreen({
  navigation,
  sucursal,
  paquetes,
  seleccionados,
  ajustes,
  alAlternar,
  alSeleccionarVarios,
  alGuardarPaquete,
  alEliminarPaquete,
  alConfirmar,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [zona, setZona] = useState('Todas');
  const [formulario, setFormulario] = useState(false);
  const [editando, setEditando] = useState(null);

  const conDistancia = paquetes.map((p) => ({ ...p, distancia: haversine(sucursal, p) }));

  const visibles = conDistancia
    .filter((p) => {
      const texto = busqueda.toLowerCase();
      const coincide =
        p.destinatario.toLowerCase().includes(texto) ||
        p.direccion.toLowerCase().includes(texto) ||
        p.guia.toLowerCase().includes(texto);
      return coincide && (zona === 'Todas' || p.zona === zona);
    })
    .sort((a, b) => a.distancia - b.distancia);

  const elegidos = conDistancia.filter((p) => seleccionados.indexOf(p.id) !== -1);
  const pesoElegido = elegidos.reduce((suma, p) => suma + p.peso, 0);
  const excedido = ajustes.usarCapacidad && pesoElegido > ajustes.capacidad;

  const idsVisibles = visibles.map((p) => p.id);
  const todosVisiblesElegidos =
    idsVisibles.length > 0 && idsVisibles.every((id) => seleccionados.indexOf(id) !== -1);

  const zonasDisponibles = ['Todas'].concat(
    zonas.filter((z) => paquetes.some((p) => p.zona === z))
  );

  const guardar = (paquete) => {
    alGuardarPaquete(paquete);
    setFormulario(false);
    setEditando(null);
  };

  const eliminar = (paquete) => {
    alEliminarPaquete(paquete);
    setFormulario(false);
    setEditando(null);
  };

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.resumen}>
        <View style={estilos.resumenFila}>
          <View>
            <Text style={estilos.resumenTitulo}>
              {elegidos.length} de {paquetes.length} seleccionados
            </Text>
            <Text style={[estilos.resumenPeso, excedido && { color: colores.peligro }]}>
              {pesoElegido} kg
              {ajustes.usarCapacidad ? ' de ' + ajustes.capacidad + ' kg' : ''}
            </Text>
          </View>

          <Pressable
            style={estilos.botonTodo}
            onPress={() => alSeleccionarVarios(idsVisibles, !todosVisiblesElegidos)}
          >
            <Ionicons
              name={todosVisiblesElegidos ? 'close-circle-outline' : 'checkmark-done-outline'}
              size={16}
              color={colores.primario}
            />
            <Text style={estilos.botonTodoTexto}>
              {todosVisiblesElegidos ? 'Quitar todo' : 'Seleccionar todo'}
            </Text>
          </Pressable>
        </View>

        {ajustes.usarCapacidad && (
          <View style={estilos.barraPeso}>
            <Barra
              proporcion={pesoElegido / ajustes.capacidad}
              color={excedido ? colores.peligro : colores.exito}
              grosor={7}
            />
          </View>
        )}

        {excedido && (
          <Text style={estilos.alertaPeso}>
            Te pasas por {pesoElegido - ajustes.capacidad} kg. La ruta se partira en varios viajes.
          </Text>
        )}
      </View>

      <View style={estilos.buscador}>
        <Ionicons name="search" size={18} color={colores.textoSuave} />
        <TextInput
          style={estilos.campo}
          placeholder="Buscar por cliente, direccion o guia..."
          placeholderTextColor={colores.textoSuave}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda !== '' && (
          <Pressable onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={colores.textoSuave} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.filtros}
        contentContainerStyle={estilos.filtrosContenido}
      >
        {zonasDisponibles.map((z) => (
          <Pressable
            key={z}
            style={[
              estilos.ficha,
              zona === z && estilos.fichaActiva,
              zona === z && z !== 'Todas' && { backgroundColor: coloresZona[z], borderColor: coloresZona[z] },
            ]}
            onPress={() => setZona(z)}
          >
            {z !== 'Todas' && (
              <View
                style={[
                  estilos.puntoZona,
                  { backgroundColor: zona === z ? '#FFFFFF' : coloresZona[z] },
                ]}
              />
            )}
            <Text style={[estilos.fichaTexto, zona === z && estilos.fichaTextoActivo]}>{z}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={visibles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const elegido = seleccionados.indexOf(item.id) !== -1;

          return (
            <Pressable
              style={[estilos.tarjeta, elegido && estilos.tarjetaElegida]}
              onPress={() => alAlternar(item.id)}
              onLongPress={() => {
                setEditando(item);
                setFormulario(true);
              }}
            >
              <View style={[estilos.casilla, elegido && estilos.casillaMarcada]}>
                {elegido && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
              </View>

              <View style={estilos.textos}>
                <View style={estilos.lineaTitulo}>
                  <Text style={estilos.destinatario} numberOfLines={1}>
                    {item.destinatario}
                  </Text>
                  <View
                    style={[estilos.punto, { backgroundColor: coloresZona[item.zona] }]}
                  />
                </View>

                <Text style={estilos.direccion} numberOfLines={1}>{item.direccion}</Text>

                <View style={estilos.chips}>
                  <Text style={estilos.guia}>{item.guia}</Text>

                  <View style={estilos.chip}>
                    <Ionicons name="cube-outline" size={11} color={colores.textoSuave} />
                    <Text style={estilos.chipTexto}>{item.peso} kg</Text>
                  </View>

                  <View style={estilos.chip}>
                    <Ionicons name="navigate-outline" size={11} color={colores.textoSuave} />
                    <Text style={estilos.chipTexto}>{item.distancia.toFixed(1)} km</Text>
                  </View>

                  {item.prioridad === 'alta' && (
                    <View style={[estilos.chip, { backgroundColor: '#FEE2E2' }]}>
                      <Text style={[estilos.chipTexto, { color: colores.peligro }]}>urgente</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={estilos.vacio}>
            <Ionicons name="cube-outline" size={42} color={colores.borde} />
            <Text style={estilos.vacioTexto}>No hay paquetes que coincidan</Text>
          </View>
        }
      />

      <View style={estilos.pie}>
        <Pressable
          style={estilos.botonAgregar}
          onPress={() => {
            setEditando(null);
            setFormulario(true);
          }}
        >
          <Ionicons name="add" size={22} color={colores.primario} />
        </Pressable>

        <Pressable
          style={[estilos.botonConfirmar, elegidos.length === 0 && estilos.botonInactivo]}
          disabled={elegidos.length === 0}
          onPress={() => {
            alConfirmar();
            navigation.navigate('Ruta');
          }}
        >
          <Ionicons name="checkmark-circle" size={19} color="#FFFFFF" />
          <Text style={estilos.botonConfirmarTexto}>
            Confirmar carga ({elegidos.length})
          </Text>
        </Pressable>
      </View>

      <ModalPaquete
        visible={formulario}
        entrega={editando}
        sucursal={sucursal}
        alGuardar={guardar}
        alEliminar={eliminar}
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
  resumen: {
    backgroundColor: colores.superficie,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 16,
    ...sombra,
  },
  resumenFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumenTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colores.texto,
  },
  resumenPeso: {
    fontSize: 13,
    color: colores.textoSuave,
    marginTop: 2,
  },
  botonTodo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.primarioSuave,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
  },
  botonTodoTexto: {
    color: colores.primario,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  barraPeso: {
    marginTop: 12,
  },
  alertaPeso: {
    fontSize: 12,
    color: colores.peligro,
    marginTop: 8,
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
    fontSize: 14,
    color: colores.texto,
  },
  filtros: {
    maxHeight: 54,
    marginTop: 12,
  },
  filtrosContenido: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  ficha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: 8,
  },
  fichaActiva: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  puntoZona: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  fichaTexto: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  fichaTextoActivo: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lista: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderRadius: 13,
    padding: 13,
    marginBottom: 9,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...sombra,
  },
  tarjetaElegida: {
    borderColor: colores.primario,
    backgroundColor: colores.primarioSuave,
  },
  casilla: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colores.borde,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  casillaMarcada: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  textos: {
    flex: 1,
  },
  lineaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinatario: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colores.texto,
  },
  punto: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginLeft: 8,
  },
  direccion: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 7,
  },
  guia: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colores.textoSuave,
    letterSpacing: 0.5,
    marginRight: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
    marginRight: 6,
  },
  chipTexto: {
    fontSize: 10,
    color: colores.textoSuave,
    marginLeft: 3,
  },
  vacio: {
    alignItems: 'center',
    marginTop: 40,
  },
  vacioTexto: {
    color: colores.textoSuave,
    fontSize: 14,
    marginTop: 10,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colores.superficie,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  botonAgregar: {
    width: 50,
    height: 50,
    borderRadius: 13,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  botonConfirmar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.primario,
    borderRadius: 13,
    paddingVertical: 15,
  },
  botonInactivo: {
    opacity: 0.4,
  },
  botonConfirmarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
