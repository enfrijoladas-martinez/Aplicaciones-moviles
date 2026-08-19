import MyInputText from './components/DemoInputText';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <MyInputText />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
