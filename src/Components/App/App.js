import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Firebase, { FirebaseContext } from '../../Firebase';
import Spotify, { SpotifyContext } from '../../Spotify';

import JoinParty from '../JoinParty';
import Landing from '../Landing';
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
const firebase = new Firebase();
const spotify = new Spotify(firebase);

const App = () => (
  <div>
    <CssBaseline />
    <Router history={history}>
      {/* Could put header here */}
      <MuiThemeProvider theme={theme}>
        <FirebaseContext.Provider value={firebase}>
          <SpotifyContext.Provider value={spotify}>
            <Route exact path="/" component={Landing} />
            <Route path="/redirectauth" component={RedirectAuth} />
            <Route path="/joinparty" component={JoinParty} />
          </SpotifyContext.Provider>
        </FirebaseContext.Provider>
      </MuiThemeProvider>
    </Router>
  </div>
);

export default App;
