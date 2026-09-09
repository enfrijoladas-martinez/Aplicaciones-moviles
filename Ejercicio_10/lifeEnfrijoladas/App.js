import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import DadosScreen from './screens/DadosScreen';
import IMCScreen from './screens/IMCScreen';
import PropinasScreen from './screens/PropinasScreen';
import TicTacToeScreen from './screens/TicTacToeScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [activeTab, setActiveTab] = useState('Herramientas');

  // Animación para el SplashScreen
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setIsLoading(false), 1000);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <MaterialIcons name="apps" size={80} color="#007AFF" />
          <Text style={styles.splashText}>Mi Aplicación Movil</Text>
        </Animated.View>
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dados': return <DadosScreen />;
      case 'IMC': return <IMCScreen />;
      case 'Propinas': return <PropinasScreen />;
      case 'TicTacToe': return <TicTacToeScreen />;
      default:
        return (
          <View style={styles.homeContainer}>
            <MaterialIcons name="touch-app" size={60} color="#007AFF" />
            <Text style={styles.homeTitle}>Bienvenido a HomeScreen</Text>
            <Text style={styles.homeSubtitle}>Selecciona una opción del menú o de las pestañas abajo</Text>
            
            <View style={styles.gridMenu}>
              <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('Dados')}>
                <MaterialIcons name="casino" size={40} color="#333" />
                <Text>Dados</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('IMC')}>
                <MaterialIcons name="fitness-center" size={40} color="#333" />
                <Text>IMC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('Propinas')}>
                <MaterialIcons name="attach-money" size={40} color="#333" />
                <Text>Propinas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('TicTacToe')}>
                <MaterialIcons name="grid-on" size={40} color="#333" />
                <Text>Tic Tac Toe</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con botón para abrir NavDrawer */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(!drawerOpen)}>
          <MaterialIcons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentScreen}</Text>
      </View>

      {/* NavDrawer Lateral */}
      {drawerOpen && (
        <View style={styles.drawer}>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { setCurrentScreen('Home'); setDrawerOpen(false); }}>
            <MaterialIcons name="home" size={20} color="#333" />
            <Text style={styles.drawerText}> Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { setCurrentScreen('Dados'); setDrawerOpen(false); }}>
            <MaterialIcons name="casino" size={20} color="#333" />
            <Text style={styles.drawerText}> Dados</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { setCurrentScreen('IMC'); setDrawerOpen(false); }}>
            <MaterialIcons name="fitness-center" size={20} color="#333" />
            <Text style={styles.drawerText}> IMC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { setCurrentScreen('Propinas'); setDrawerOpen(false); }}>
            <MaterialIcons name="attach-money" size={20} color="#333" />
            <Text style={styles.drawerText}> Propinas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { setCurrentScreen('TicTacToe'); setDrawerOpen(false); }}>
            <MaterialIcons name="grid-on" size={20} color="#333" />
            <Text style={styles.drawerText}> Tic Tac Toe</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Pantalla Activa */}
      <View style={styles.content}>{renderScreen()}</View>

      {/* TabNavigation (Mínimo 2 Pestañas) */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Herramientas' && styles.activeTab]}
          onPress={() => { setActiveTab('Herramientas'); setCurrentScreen('Home'); }}
        >
          <MaterialIcons name="build" size={24} color={activeTab === 'Herramientas' ? '#007AFF' : '#666'} />
          <Text style={{ color: activeTab === 'Herramientas' ? '#007AFF' : '#666' }}>Herramientas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Juegos' && styles.activeTab]}
          onPress={() => { setActiveTab('Juegos'); setCurrentScreen('TicTacToe'); }}
        >
          <MaterialIcons name="sports-esports" size={24} color={activeTab === 'Juegos' ? '#007AFF' : '#666'} />
          <Text style={{ color: activeTab === 'Juegos' ? '#007AFF' : '#666' }}>Juegos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', paddingTop: 30 },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  splashText: { fontSize: 24, fontWeight: 'bold', marginTop: 15, color: '#333' },
  header: { height: 50, backgroundColor: '#007AFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  drawer: { position: 'absolute', top: 80, left: 0, width: 200, backgroundColor: '#fff', elevation: 5, zIndex: 10, padding: 10 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  drawerText: { fontSize: 16, marginLeft: 10 },
  content: { flex: 1 },
  homeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  homeTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  homeSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 10 },
  gridMenu: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 15 },
  card: { width: 100, height: 100, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', margin: 10, borderRadius: 8, elevation: 2 },
  tabBar: { height: 60, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ccc' },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  activeTab: { borderTopWidth: 2, borderColor: '#007AFF' }
});