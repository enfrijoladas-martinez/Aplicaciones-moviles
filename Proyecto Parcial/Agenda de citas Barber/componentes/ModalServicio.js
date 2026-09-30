import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../estilos/tema';

const iconos = [
  'cut-outline',
  'man-outline',
  'color-palette-outline',
  'sparkles-outline',
  'hand-left-outline',
  'water-outline',
  'flower-outline',
  'happy-outline',
];

export default function ModalServicio({ visible, servicio, alGuardar, alCerrar }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [icono, setIcono] = useState(iconos[0]);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    if (!visible) return;

    if (servicio) {
      setNombre(servicio.nombre);
      setPrecio(String(servicio.precio));
      setDuracion(String(servicio.duracion));
      setIcono(servicio.icono);
    } else {
      setNombre('');
      setPrecio('');
      setDuracion('');
      setIcono(iconos[0]);
    }

    setAviso('');
  }, [visible, servicio]);

  const guardar = () => {
    const p = parseFloat(precio);
    const d = parseInt(duracion, 10);

    if (!nombre.trim()) {
      setAviso('Escribe el nombre del servicio');
      return;
    }

    if (isNaN(p) || p <= 0) {
      setAviso('El precio debe ser mayor a cero');
      return;
    }

    if (isNaN(d) || d < 10) {
      setAviso('La duracion minima es de 10 minutos');
      return;
    }

    alGuardar({
      id: servicio ? servicio.id : 's' + Date.now(),
      nombre: nombre.trim(),
      precio: p,
      duracion: d,
      icono: icono,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={alCerrar}>
      <View style={estilos.fondo}>
        <View style={estilos.hoja}>
          <View style={estilos.barra} />

          <Text style={estilos.titulo}>
            {servicio ? 'Editar servicio' : 'Nuevo servicio'}
          </Text>

          <Text style={estilos.etiqueta}>Nombre</Text>
          <TextInput
            style={estilos.campo}
            placeholder="Ej. Corte de cabello"
            placeholderTextColor={colores.textoSuave}
            value={nombre}
            onChangeText={setNombre}
          />

          <View style={estilos.fila}>
            <View style={estilos.mitad}>
              <Text style={estilos.etiqueta}>Precio</Text>
              <TextInput
                style={estilos.campo}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colores.textoSuave}
                value={precio}
                onChangeText={setPrecio}
              />
            </View>

            <View style={estilos.mitad}>
              <Text style={estilos.etiqueta}>Minutos</Text>
              <TextInput
                style={estilos.campo}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={colores.textoSuave}
                value={duracion}
                onChangeText={setDuracion}
              />
            </View>
          </View>

          <Text style={estilos.etiqueta}>Icono</Text>
          <View style={estilos.iconos}>
            {iconos.map((i) => (
              <Pressable
                key={i}
                style={[estilos.cuadro, icono === i && estilos.cuadroActivo]}
                onPress={() => setIcono(i)}
              >
                <Ionicons
                  name={i}
                  size={20}
                  color={icono === i ? colores.superficie : colores.textoSuave}
                />
              </Pressable>
            ))}
          </View>

          {aviso !== '' && <Text style={estilos.aviso}>{aviso}</Text>}

          <View style={estilos.acciones}>
            <Pressable style={estilos.botonSuave} onPress={alCerrar}>
              <Text style={estilos.botonSuaveTexto}>Cancelar</Text>
            </Pressable>

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
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
  },
  hoja: {
    backgroundColor: colores.superficie,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingBottom: 26,
    paddingTop: 10,
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
    marginBottom: 8,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoSuave,
    marginTop: 10,
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
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mitad: {
    width: '48%',
  },
  iconos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cuadro: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colores.fondo,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  cuadroActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  aviso: {
    color: colores.peligro,
    fontSize: 13,
    marginTop: 8,
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
    marginRight: 10,
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
    color: colores.superficie,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
