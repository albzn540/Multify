import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import Landing from '../Landing';
import Auth from '../../Auth';
import JoinParty from '../JoinParty';
import CssBaseline from '@material-ui/core/CssBaseline';

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
    background: {
      default: '#191414',
    }
  },
  typography: { useNextVariants: true },
});

const history = createBrowserHistory();

const App = () => (
  <div>
    <CssBaseline />
    <Router history={history}>
      {/* Could put header here */}
      <MuiThemeProvider theme={theme}>
        <Route exact path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        <Route path="/joinparty" component={JoinParty} />
      </MuiThemeProvider>
    </Router>
  </div>
);

export default App;
