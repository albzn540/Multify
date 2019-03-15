import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import Landing from '../Landing';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1DB954',
    },
    green: {
      main: '#1DB954',
    },
    whote: {
      main: '#FFFFFF',
    },
    black: {
      main: '#191414',
    },
    textPrimary: {
      main: '#FFFFFF',
    },
  },
});

const history = createBrowserHistory();

const App = () => (
  <div>
    {/* <Router history={history}> */}
    <MuiThemeProvider theme={theme}>
      <Landing theme={theme} />
    </MuiThemeProvider>
    {/* </Router> */}
  </div>
);

export default App;
