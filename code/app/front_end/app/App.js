import React, { useEffect, useState } from 'react';
import { Platform, Dimensions, StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatBot from './screens/ChatBot'
import Feed from './screens/Feed'
import styled, { ThemeProvider } from 'styled-components/native';
import { getTheme } from './utils/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

const w8 = SCREEN_WIDTH * 0.007;
const w16 = SCREEN_WIDTH * 0.015;
const w24 = SCREEN_WIDTH * 0.022;
const w28 = SCREEN_WIDTH * 0.026;
const w32 = SCREEN_WIDTH * 0.030;
const w48 = SCREEN_WIDTH * 0.044;
const w64 = SCREEN_WIDTH * 0.059;
const w92 = SCREEN_WIDTH * 0.086;
const w96 = SCREEN_WIDTH * 0.089;
const w160 = SCREEN_WIDTH * 0.148;

const theme = getTheme()

// Loading Component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size='large' />
    <Text>Loading...</Text>
  </View>
);

// Tab Navigator
// const Tab = createTabNavigator();

// Main Stack Navigator
const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <Container>
      <StatusBar translucent backgroundColor='transparent' />
      <Tab.Navigator
        initialRouteName='ChatBot'
        screenOptions={{
          tabBarShowIcon: true,
          tabBarShowLabel: false,
          swipeEnabled: false,
          tabBarStyle: {
            height: w160,
            backgroundColor: 'transparent',
            position: 'absolute',
            top: w92,
            left: 0,
            right: 0,
            paddingTop: 4
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#fbfbfb'
          }
        }}>
        <Tab.Screen
          name='ChatBot'
          component={ChatBot}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Icon source={focused ? require('./assets/chat-active-icon.png')
                : require('./assets/chat-icon.png')} />
            )
          }}
        />
        <Tab.Screen
          name='Feed'
          component={Feed}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Icon source={focused ? require('./assets/feed-active-icon.png')
                : require('./assets/feed-icon.png')} />
            )
          }}
        />
      </Tab.Navigator>
    </Container>
  )
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer
        theme={DefaultTheme}>
        <Stack.Navigator initialRouteName='ChatBot'>
          <Stack.Screen name='Root' component={TabNavigator} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

const Container = styled.View`
  flex: 1;
`

const Icon = styled.Image`
  width: ${w64}px;
  height: ${w64}px;
`

export default App;