import { Text, View } from 'react-native';

// Todo lo que se escribe ENTRE <DemoChildren> y </DemoChildren>
// llega aqui dentro de props.children.
export default function DemoChildren(props) {
  return (
    <View>
      <Text>Muestra Children:</Text>
      {props.children}
    </View>
  );
}
