import React from 'react';
import { ContextProvider } from './utils/Context';
import Main from './screens/Main'
import { ThemeProvider } from 'styled-components/native';
import { getTheme } from './utils/theme';

const theme = getTheme()

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ContextProvider>
        <Main />
      </ContextProvider>
    </ThemeProvider>
  );
};

export default App;