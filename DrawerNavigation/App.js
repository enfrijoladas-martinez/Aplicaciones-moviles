import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    // El drawer usa gestos, por eso toda la app va dentro de GestureHandlerRootView.
    // Sin esto el cajon no abre al deslizar.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Inicio"
          screenOptions={{
            drawerActiveTintColor: '#2563eb',
            drawerLabelStyle: { fontSize: 16 },
            headerStyle: { backgroundColor: '#2563eb' },
            headerTintColor: '#ffffff',
          }}
        >
          <Drawer.Screen name="Inicio" component={HomeScreen} />
          <Drawer.Screen name="Buscar" component={SearchScreen} />
          <Drawer.Screen name="Perfil" component={ProfileScreen} />
          <Drawer.Screen name="Ajustes" component={SettingsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
