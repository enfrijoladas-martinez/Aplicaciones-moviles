import { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../estilos/tema';
import { usuarios } from '../datos/usuarios';

export default function LoginScreen({ alEntrar }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [aviso, setAviso] = useState('');

  const sacudida = useRef(new Animated.Value(0)).current;

  const fallar = (mensaje) => {
    setAviso(mensaje);

    Animated.sequence([
      Animated.timing(sacudida, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(sacudida, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(sacudida, { toValue: 7, duration: 60, useNativeDriver: true }),
      Animated.timing(sacudida, { toValue: -7, duration: 60, useNativeDriver: true }),
      Animated.timing(sacudida, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const entrar = () => {
    if (!usuario.trim() || !clave) {
      fallar('Escribe tu usuario y contrasena');
      return;
    }

    const encontrado = usuarios.find(
      (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
    );

    if (!encontrado || encontrado.clave !== clave) {
      fallar('Usuario o contrasena incorrectos');
      return;
    }

    setAviso('');
    alEntrar(encontrado);
  };

  return (
    <KeyboardAvoidingView
      style={estilos.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
        <View style={estilos.logo}>
          <Ionicons name="navigate" size={38} color="#FFFFFF" />
        </View>

        <Text style={estilos.titulo}>RutaOptima</Text>
        <Text style={estilos.lema}>Acceso para repartidores</Text>

        <Animated.View style={[estilos.tarjeta, { transform: [{ translateX: sacudida }] }]}>
          <Text style={estilos.etiqueta}>Usuario</Text>
          <View style={estilos.campoFila}>
            <Ionicons name="person-outline" size={18} color={colores.textoSuave} />
            <TextInput
              style={estilos.campo}
              placeholder="tu usuario"
              placeholderTextColor={colores.textoSuave}
              autoCapitalize="none"
              value={usuario}
              onChangeText={setUsuario}
            />
          </View>

          <Text style={estilos.etiqueta}>Contrasena</Text>
          <View style={estilos.campoFila}>
            <Ionicons name="lock-closed-outline" size={18} color={colores.textoSuave} />
            <TextInput
              style={estilos.campo}
              placeholder="tu contrasena"
              placeholderTextColor={colores.textoSuave}
              secureTextEntry={!verClave}
              value={clave}
              onChangeText={setClave}
            />
            <Pressable onPress={() => setVerClave(!verClave)}>
              <Ionicons
                name={verClave ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colores.textoSuave}
              />
            </Pressable>
          </View>

          {aviso !== '' && (
            <View style={estilos.aviso}>
              <Ionicons name="alert-circle" size={15} color={colores.peligro} />
              <Text style={estilos.avisoTexto}>{aviso}</Text>
            </View>
          )}

          <Pressable style={estilos.boton} onPress={entrar}>
            <Text style={estilos.botonTexto}>Entrar</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </Animated.View>

        <View style={estilos.ayuda}>
          <Text style={estilos.ayudaTitulo}>Cuentas de prueba</Text>
          {usuarios.map((u) => (
            <Text key={u.id} style={estilos.ayudaTexto}>
              {u.usuario} / {u.clave} — {u.nombre}
            </Text>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.lienzo,
  },
  contenido: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 26,
  },
  logo: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor: colores.primario,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lema: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 28,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 18,
    padding: 22,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoSuave,
    marginBottom: 7,
    marginTop: 6,
  },
  campoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 11,
    paddingHorizontal: 12,
    backgroundColor: colores.fondo,
  },
  campo: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 9,
    fontSize: 15,
    color: colores.texto,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  avisoTexto: {
    color: colores.peligro,
    fontSize: 13,
    marginLeft: 6,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.primario,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  ayuda: {
    marginTop: 24,
    alignItems: 'center',
  },
  ayudaTitulo: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  ayudaTexto: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 2,
  },
});
