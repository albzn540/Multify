import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
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
    spotify, classes, location, history,
  } = props;

  useEffect(() => {
    const url = location.pathname + location.search;
    spotify.loginUser(url).then(() => {
      console.debug('[Login] Creating party...');
      spotify.createParty(`${spotify.spotifyUser.display_name}'s party`).then((partyData) => {
        const { data: { code } } = partyData;
        console.debug('[Login] Party created', partyData);
        spotify.getPartyId(code).then((partyId) => {
          history.replace({ pathname: `/party/${partyId}` });
        });
      });
    }).catch((e) => {
      console.log('[Login]', e);
    });
  }, []);

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
        <CircularProgress color="primary" />
      </Grid>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
  withRouter,
)(Login);
