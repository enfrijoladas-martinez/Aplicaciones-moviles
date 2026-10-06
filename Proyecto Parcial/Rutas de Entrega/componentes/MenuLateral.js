import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../estilos/tema';

export default function MenuLateral({ usuario, sucursal, seleccionados, alCambiarSucursal, alSalir, ...props }) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        <View style={estilos.avatar}>
          <Text style={estilos.inicial}>{usuario.nombre.charAt(0)}</Text>
        </View>

        <Text style={estilos.nombre}>{usuario.nombre}</Text>
        <Text style={estilos.puesto}>
          {usuario.puesto} · {usuario.placas}
        </Text>

        <View style={estilos.sucursal}>
          <Ionicons name="business" size={14} color={colores.acento} />
          <Text style={estilos.sucursalTexto} numberOfLines={1}>
            {sucursal.nombre}
          </Text>
        </View>

        <View style={estilos.insignia}>
          <Ionicons name="cube" size={13} color="#FFFFFF" />
          <Text style={estilos.insigniaTexto}>{seleccionados} paquetes cargados</Text>
        </View>
      </View>

      <DrawerContentScrollView {...props} style={estilos.lista}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={estilos.pie}>
        <Pressable style={estilos.accion} onPress={alCambiarSucursal}>
          <Ionicons name="swap-horizontal-outline" size={19} color={colores.primario} />
          <Text style={estilos.accionTexto}>Cambiar de central</Text>
        </Pressable>

        <Pressable style={estilos.accion} onPress={alSalir}>
          <Ionicons name="log-out-outline" size={19} color={colores.peligro} />
          <Text style={[estilos.accionTexto, { color: colores.peligro }]}>Cerrar sesion</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.superficie,
  },
  encabezado: {
    backgroundColor: colores.primario,
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },
  inicial: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
  },
  nombre: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  puesto: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  sucursal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  sucursalTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 7,
    flex: 1,
  },
  insignia: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  insigniaTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },
  lista: {
    flex: 1,
  },
  pie: {
    borderTopWidth: 1,
    borderTopColor: colores.borde,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  accion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  accionTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.primario,
    marginLeft: 12,
  },
});
