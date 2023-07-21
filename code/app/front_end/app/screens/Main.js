import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from '../components/TabNavigator';

const Stack = createNativeStackNavigator();

const Main = () => (
	<NavigationContainer>
		<Stack.Navigator initialRouteName='ChatBot'>
			<Stack.Screen name='Root' component={TabNavigator} options={{headerShown: false}} />
		</Stack.Navigator>
	</NavigationContainer>
);

export default Main;