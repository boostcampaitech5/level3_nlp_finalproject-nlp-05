import React, { useEffect, useContext } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Context } from '../utils/Context'
import Login from './Login'
import TabNavigator from '../components/TabNavigator';

const Stack = createNativeStackNavigator();

const Main = () => {
	const { isLogin } = useContext(Context);

	return (
		<>
			{isLogin ? (
					<NavigationContainer
						theme={DefaultTheme}>
						<Stack.Navigator initialRouteName='ChatBot'>
							<Stack.Screen name='Root' component={TabNavigator} options={{headerShown: false}} />
						</Stack.Navigator>
					</NavigationContainer>
				) : <Login />
			}
		</>
	);
};

export default Main;