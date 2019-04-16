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
import Party, { RedirectParty } from '../Party';
import { SearchPage } from '../Search';

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
      lightBlack: '#191414',
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
            {/* Rerouting thingys */}
            <Route exact path="/" component={Landing} />
            <Route exact path="/party" component={RedirectParty} />
            <Route path="/party/:partyId" component={Party} />
            <Route path="/search/:partyId" component={SearchPage} />

            {/* Does not require a party */}
            <Route path="/login" component={Login} />
            <Route path="/joinparty" component={JoinParty} />
          </SpotifyContext.Provider>
        </FirebaseContext.Provider>
      </MuiThemeProvider>
    </Router>
  </div>
);

export default App;
