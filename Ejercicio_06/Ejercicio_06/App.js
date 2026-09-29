import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './TabNavigation/Componentes/HomeScreen';
import ProfileScreen from './TabNavigation/Componentes/ProfileScreen';
import SearchScreen from './TabNavigation/Componentes/SearchScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>

        <Tab.Screen
          name="Inicio"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Buscar"
          component={SearchScreen}
        />

        <Tab.Screen
          name="Perfil"
          component={ProfileScreen}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}