import React, { useEffect } from 'react';
import { ContextProvider } from './utils/Context';
import Main from './screens/Main'
import { ThemeProvider } from 'styled-components/native';
import { getTheme } from './utils/theme';
import * as Font from 'expo-font';

const theme = getTheme()

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
        <Main />
      </ContextProvider>
    </ThemeProvider>
  );
};

export default App;