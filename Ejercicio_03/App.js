import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import ImagenFondo from './componentes/ImagenFondo';
import DemoFlatList from './componentes/DemoFlatList';
import DemoSectionList from './componentes/DemoSectionList';

export default function App() {
  const [vista, setVista] = useState('imagen');

  return (
    <View style={styles.container}>

      <View style={styles.menu}>
        <Button title="Imagen" onPress={() => setVista('imagen')} />
        <Button title="FlatList" onPress={() => setVista('flatlist')} />
        <Button title="SectionList" onPress={() => setVista('sectionlist')} />
      </View>

      <View style={styles.contenido}>
        {vista === 'imagen' && <ImagenFondo />}
        {vista === 'flatlist' && <DemoFlatList />}
        {vista === 'sectionlist' && <DemoSectionList />}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18e415',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  contenido: {
    flex: 1,
  },
});
