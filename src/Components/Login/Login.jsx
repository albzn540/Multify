import React, { useState } from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { withSpotify } from '../../Spotify';
import { withFirebase } from '../../Firebase';
import SpotifyLogo from '../../Constants/SpotifyLogo';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
  logo: {
    color: theme.palette.green.main,
    paddingBottom: '80px',
    fontSize: '260px',
  },
  text: {
    color: theme.palette.green.main,
  },
});

const Login = (props) => {
  const {
    spotify, firebase, classes, location
  } = props;

  const [isLoggedIn, setLoggedIn] = useState(false);

  if (!spotify.spotifyUser && location.search === '') {
    // No user authenticated
    spotify.authorizeWithSpotify();
  } else if (!spotify.spotifyUser) {
    // Log in user
    const url = location.pathname + location.search;
    spotify.authenticateSpotifyUser(url).then(() => {
      setLoggedIn(true);
    }).catch((error) => {
      console.log(error);
    });
  }

  const text = () => {
    if (isLoggedIn) {
      return (
        <Typography variant="h3" className={classes.text}>
          LOGGED IN MA MAN
        </Typography>
      );
    } else {
      return (
        <Typography variant="h3" className={classes.text}>
          Logging in...
        </Typography>
      );
    }
  };

  return (
    <Grid
      container
      direction="column"
      className={classes.root}
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <SpotifyLogo className={classes.logo} />
      </Grid>

      <Grid item>
        {text()}
      </Grid>

    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
  withFirebase,
)(Login);
