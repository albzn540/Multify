import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Firebase, { FirebaseContext } from '../../Firebase';
import Spotify, { SpotifyContext } from '../../Spotify';

import JoinParty from '../JoinParty';
import Landing from '../Landing';
import Login from '../Login';
import Search from '../Search';
import Queue from '../Queue';
import Navigation from '../Navigation';
import Party from '../Party';
import ShareParty from '../ShareParty';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1DB954',
    },
    secondary: {
      main: '#fff',
    },
    common: {
      green: '#1DB954',
      ligthBlack: '#191414',
      lightGrey: '#AAAAAA',
      grey: '#252525',
    },
    type: 'dark',
    background: {
      main: '#191414',
    },
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
            <Route path="/login" component={Login} />
            <Route path="/joinparty" component={JoinParty} />
            <Route path="/search" component={Search} />
            <Route path="/queue" component={Queue} />
            <Route path="/party/:partyId" component={Navigation} />
            <Route exact path="/party/:partyId" component={Party} />
            <Route path="/party/:partyId/share" component={ShareParty} />
          </SpotifyContext.Provider>
        </FirebaseContext.Provider>
      </MuiThemeProvider>
    </Router>
  </div>
);

export default App;
