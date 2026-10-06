import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../estilos/tema';
import { coloresZona, zonas } from '../datos/paquetes';

const prioridades = ['baja', 'normal', 'alta'];

export default function ModalPaquete({
  visible,
  entrega,
  sucursal,
  sugerencia,
  alGuardar,
  alEliminar,
  alCerrar,
}) {
  const [destinatario, setDestinatario] = useState('');
  const [direccion, setDireccion] = useState('');
  const [peso, setPeso] = useState('');
  const [zona, setZona] = useState(zonas[0]);
  const [prioridad, setPrioridad] = useState('normal');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [editarCoordenadas, setEditarCoordenadas] = useState(false);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    if (!visible) return;

    if (entrega) {
      setDestinatario(entrega.destinatario);
      setDireccion(entrega.direccion);
      setPeso(String(entrega.peso));
      setZona(entrega.zona);
      setPrioridad(entrega.prioridad);
      setLat(String(entrega.lat));
      setLon(String(entrega.lon));
    } else {
      const base = sugerencia || sucursal;
      setDestinatario('');
      setDireccion('');
      setPeso('');
      setZona(zonas[0]);
      setPrioridad('normal');
      setLat(base ? String(base.lat.toFixed(6)) : '');
      setLon(base ? String(base.lon.toFixed(6)) : '');
    }

    setEditarCoordenadas(false);
    setAviso('');
  }, [visible, entrega, sugerencia]);

  const guardar = () => {
    const p = parseFloat(peso);
    const la = parseFloat(lat);
    const lo = parseFloat(lon);

    if (!destinatario.trim()) {
      setAviso('Escribe el nombre del destinatario');
      return;
    }

    if (isNaN(p) || p <= 0) {
      setAviso('El peso debe ser mayor a cero');
      return;
    }

    if (isNaN(la) || isNaN(lo) || la < -90 || la > 90 || lo < -180 || lo > 180) {
      setAviso('Las coordenadas no son validas');
      return;
    }

    alGuardar({
      id: entrega ? entrega.id : 'p' + Date.now(),
      sucursalId: entrega ? entrega.sucursalId : sucursal.id,
      guia: entrega ? entrega.guia : 'MN-' + String(Date.now()).slice(-5),
      destinatario: destinatario.trim(),
      direccion: direccion.trim() || 'Sin direccion',
      zona: zona,
      peso: p,
      prioridad: prioridad,
      lat: la,
      lon: lo,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={alCerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.hoja}>
          <View style={estilos.barra} />

          <Text style={estilos.titulo}>{entrega ? 'Editar paquete' : 'Nuevo paquete'}</Text>
          {entrega && <Text style={estilos.guia}>Guia {entrega.guia}</Text>}

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={estilos.etiqueta}>Destinatario</Text>
            <TextInput
              style={estilos.campo}
              placeholder="Ej. Abarrotes La Esquina"
              placeholderTextColor={colores.textoSuave}
              value={destinatario}
              onChangeText={setDestinatario}
            />

            <Text style={estilos.etiqueta}>Direccion</Text>
            <TextInput
              style={estilos.campo}
              placeholder="Calle y numero"
              placeholderTextColor={colores.textoSuave}
              value={direccion}
              onChangeText={setDireccion}
            />

            <Text style={estilos.etiqueta}>Peso en kg</Text>
            <TextInput
              style={estilos.campo}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colores.textoSuave}
              value={peso}
              onChangeText={setPeso}
            />

            <Text style={estilos.etiqueta}>Zona</Text>
            <View style={estilos.fichas}>
              {zonas.map((z) => (
                <Pressable
                  key={z}
                  style={[
                    estilos.ficha,
                    zona === z && { backgroundColor: coloresZona[z], borderColor: coloresZona[z] },
                  ]}
                  onPress={() => setZona(z)}
                >
                  <Text style={[estilos.fichaTexto, zona === z && estilos.fichaTextoActivo]}>
                    {z}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={estilos.etiqueta}>Prioridad</Text>
            <View style={estilos.fichas}>
              {prioridades.map((p) => (
                <Pressable
                  key={p}
                  style={[estilos.ficha, prioridad === p && estilos.fichaActiva]}
                  onPress={() => setPrioridad(p)}
                >
                  <Text style={[estilos.fichaTexto, prioridad === p && estilos.fichaTextoActivo]}>
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={estilos.ubicacion}>
              <Ionicons name="location" size={16} color={colores.primario} />
              <Text style={estilos.ubicacionTexto}>
                {Number(lat).toFixed(5)}, {Number(lon).toFixed(5)}
              </Text>
            </View>

            <View style={estilos.filaSwitch}>
              <Text style={estilos.etiquetaSwitch}>Escribir coordenadas a mano</Text>
              <Switch value={editarCoordenadas} onValueChange={setEditarCoordenadas} />
            </View>

            {editarCoordenadas && (
              <View style={estilos.fila}>
                <View style={estilos.mitad}>
                  <Text style={estilos.etiqueta}>Latitud</Text>
                  <TextInput
                    style={estilos.campo}
                    keyboardType="numeric"
                    value={lat}
                    onChangeText={setLat}
                  />
                </View>

                <View style={estilos.mitad}>
                  <Text style={estilos.etiqueta}>Longitud</Text>
                  <TextInput
                    style={estilos.campo}
                    keyboardType="numeric"
                    value={lon}
                    onChangeText={setLon}
                  />
                </View>
              </View>
            )}

            {aviso !== '' && <Text style={estilos.aviso}>{aviso}</Text>}
          </ScrollView>

          <View style={estilos.acciones}>
            {entrega ? (
              <Pressable
                style={[estilos.botonSuave, { marginRight: 10 }]}
                onPress={() => alEliminar(entrega)}
              >
                <Text style={[estilos.botonSuaveTexto, { color: colores.peligro }]}>Eliminar</Text>
              </Pressable>
            ) : (
              <Pressable style={[estilos.botonSuave, { marginRight: 10 }]} onPress={alCerrar}>
                <Text style={estilos.botonSuaveTexto}>Cancelar</Text>
              </Pressable>
            )}

            <Pressable style={estilos.boton} onPress={guardar}>
              <Text style={estilos.botonTexto}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  hoja: {
    backgroundColor: colores.superficie,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingBottom: 26,
    paddingTop: 10,
    maxHeight: '90%',
  },
  barra: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colores.borde,
    alignSelf: 'center',
    marginBottom: 14,
  },
  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colores.texto,
  },
  guia: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
    marginBottom: 6,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoSuave,
    marginTop: 12,
    marginBottom: 6,
  },
  campo: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: colores.texto,
    backgroundColor: colores.fondo,
  },
  fichas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ficha: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colores.fondo,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: 7,
    marginBottom: 7,
  },
  fichaActiva: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  fichaTexto: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  fichaTextoActivo: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  ubicacion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.primarioSuave,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  ubicacionTexto: {
    fontSize: 13,
    color: colores.primario,
    fontWeight: '600',
    marginLeft: 8,
  },
  filaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  etiquetaSwitch: {
    fontSize: 14,
    color: colores.texto,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mitad: {
    width: '48%',
  },
  aviso: {
    color: colores.peligro,
    fontSize: 13,
    marginTop: 10,
  },
  acciones: {
    flexDirection: 'row',
    marginTop: 16,
  },
  botonSuave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colores.fondo,
    alignItems: 'center',
  },
  botonSuaveTexto: {
    color: colores.textoSuave,
    fontSize: 15,
    fontWeight: '600',
  },
  boton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colores.primario,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
