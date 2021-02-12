import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';

import './App.css';
import Application from './Components/Application';
import UserProvider from './providers/UserProvider';

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#4f6698',
      contrastText: '#dee2ea',
    },
    text: {
      primary: '#7b87a0',
    },
  },
});

function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Application />
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
