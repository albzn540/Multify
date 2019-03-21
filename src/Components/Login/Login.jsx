import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { withSpotify } from '../../Spotify';
import SpotifyLogo from '../../Constants/SpotifyLogo';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.main,
  },
  logo: {
    color: theme.palette.primary.main,
    paddingBottom: '80px',
    fontSize: '260px',
  },
  text: {
    color: theme.palette.primary.main,
  },
});

const Login = (props) => {
  const {
    spotify, classes, location
  } = props;

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const url = location.pathname + location.search;
    spotify.loginUser(url).then((user) => {
      console.log('[Login] Logged in!', user);
      setLoggedIn(true);
      setName(user.displayName);
    }).catch((e) => {
      console.log('[Login]', e);
    });
  }, []);

  const text = () => {
    if (isLoggedIn) {
      return (
        <Typography variant="h3" className={classes.text}>
          Hi, {name}!
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
)(Login);
