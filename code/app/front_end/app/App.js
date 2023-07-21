import React, { useEffect } from 'react';
import * as Font from 'expo-font';
import { RootSiblingParent } from 'react-native-root-siblings';
import { ContextProvider } from './utils/Context';
import { ThemeProvider } from 'styled-components/native';
import { getTheme } from './utils/theme';
import Main from './screens/Main'

const theme = getTheme();

const loadFonts = async () => {
	await Font.loadAsync({
		'HandWriting': require('./assets/fonts/nanum_handwriting.ttf')
	});
};

const App = () => {
	useEffect(() => {
		loadFonts();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<ContextProvider>
				<RootSiblingParent>
					<Main />
				</RootSiblingParent>
			</ContextProvider>
		</ThemeProvider>
	);
};

export default App;