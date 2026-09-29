import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API_URL, HEADERS } from '../config';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState('');

  const enviar = async () => {
    if (!email.trim() || !password) {
      setAviso('Escribe tu correo y contrasena');
      return;
    }

    setCargando(true);
    setAviso('');

    const ruta = registrando ? '/register' : '/login';

    try {
      const respuesta = await fetch(API_URL + ruta, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setAviso(datos.error || 'No se pudo completar');
        return;
      }

      if (registrando) {
        // Tras registrarse no entramos directo: lo mandamos a iniciar sesion.
        setRegistrando(false);
        setPassword('');
        setAviso('Cuenta creada, ahora inicia sesion');
      } else {
        onLogin(datos.user);
      }
    } catch (e) {
      setAviso('No hay conexion con el servidor. Revisa API_URL en config.js');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.titulo}>Cineteca</Text>
      <Text style={styles.subtitulo}>
        {registrando ? 'Crea tu cuenta' : 'Inicia sesion para ver el catalogo'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#6b7280"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contrasena"
        placeholderTextColor="#6b7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {aviso !== '' && <Text style={styles.aviso}>{aviso}</Text>}

      <Pressable style={styles.boton} onPress={enviar} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.botonTexto}>
            {registrando ? 'Registrarme' : 'Entrar'}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => { setRegistrando(!registrando); setAviso(''); }}>
        <Text style={styles.cambiar}>
          {registrando ? 'Ya tengo cuenta' : 'No tengo cuenta, quiero registrarme'}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    padding: 28,
  },
  titulo: {
    color: '#f8fafc',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  aviso: {
    color: '#fbbf24',
    marginBottom: 10,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#e11d48',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  cambiar: {
    color: '#38bdf8',
    textAlign: 'center',
    marginTop: 18,
    fontSize: 14,
  },
});
