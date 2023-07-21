import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { RootSiblingParent } from 'react-native-root-siblings';
import { ContextProvider } from './utils/Context';
import { ThemeProvider } from 'styled-components/native';
import { getTheme } from './utils/theme';
import Main from './screens/Main';
import Loading from './screens/Loading';

SplashScreen.preventAutoHideAsync();

const theme = getTheme();

const App = () => (
	<ThemeProvider theme={theme}>
		<ContextProvider>
			<RootSiblingParent>
				<Loading />
				<Main />
			</RootSiblingParent>
		</ContextProvider>
	</ThemeProvider>
);

export default App;