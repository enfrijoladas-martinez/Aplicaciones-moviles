import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './Componentes/HomeScreen';
import ImcScreen from './Componentes/ImcScreen';
import CurrencyScreen from './Componentes/Currency';
import TipScreen from './Componentes/TipScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio' }}
        />

        <Stack.Screen
          name="IMC"
          component={ImcScreen}
          options={{ title: 'Calculadora IMC' }}
        />

        <Stack.Screen
          name="Currency"
          component={CurrencyScreen}
          options={{ title: 'Conversor de Divisas' }}
        />

        <Stack.Screen
          name="Tip"
          component={TipScreen}
          options={{ title: 'Cálculo de Propina' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}