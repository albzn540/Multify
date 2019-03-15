import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Landing from '../Landing';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    green: {
      main: '#1DB954',
    },
    whote: {
      main: '#FFFFFF',
    },
    black: {
      main: '#191414',
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
