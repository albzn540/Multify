import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import Landing from '../Landing';
import JoinParty from '../JoinParty';
import CssBaseline from '@material-ui/core/CssBaseline';

import Spotify, { SpotifyContext } from '../../Spotify';
import RedirectAuth from '../../RedirectAuth/RedirectAuth';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1DB954',
    },
    green: {
      main: '#1DB954',
    },
    white: {
      main: '#FFFFFF',
    },
    black: {
      main: '#191414',
    },
    textPrimary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#191414',
    }
  },
  typography: { useNextVariants: true },
});

const history = createBrowserHistory();
const spotify = new Spotify();

const App = () => (
  <div>
    <CssBaseline />
    <Router history={history}>
      {/* Could put header here */}
      <MuiThemeProvider theme={theme}>
        <SpotifyContext.Provider value={spotify}>
          <Route exact path="/" component={Landing} />
          <Route path="/redirectauth" component={RedirectAuth} />
          <Route path="/joinparty" component={JoinParty} />
        </SpotifyContext.Provider>
      </MuiThemeProvider>
    </Router>
  </div>
);

export default App;
