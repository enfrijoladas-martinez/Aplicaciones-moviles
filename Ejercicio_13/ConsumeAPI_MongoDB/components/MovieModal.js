import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MovieModal({ movie, visible, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.fondo}>
        <View style={styles.hoja}>

          <ScrollView>
            {movie && movie.poster ? (
              <Image style={styles.poster} source={{ uri: movie.poster }} />
            ) : (
              <View style={[styles.poster, styles.sinPoster]}>
                <Text style={styles.sinPosterTexto}>Sin imagen</Text>
              </View>
            )}

            <Text style={styles.titulo}>{movie ? movie.title : ''}</Text>

            <Text style={styles.etiqueta}>Sinopsis</Text>
            <Text style={styles.sinopsis}>
              {movie && movie.fullplot ? movie.fullplot : 'Sin descripcion disponible.'}
            </Text>
          </ScrollView>

          <Pressable style={styles.boton} onPress={onClose}>
            <Text style={styles.botonTexto}>Cerrar</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  hoja: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  poster: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  sinPoster: {
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinPosterTexto: {
    color: '#94a3b8',
  },
  titulo: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  etiqueta: {
    color: '#e11d48',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 6,
  },
  sinopsis: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  boton: {
    backgroundColor: '#e11d48',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
