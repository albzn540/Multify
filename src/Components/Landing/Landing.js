import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Button, Typography } from '@material-ui/core';
import * as oauth2 from 'simple-oauth2';
import { Link } from 'react-router-dom';
import SpotifyLogo from '../../Constants/SpotifyLogo';
import SpotifyButton from '../SpotifyButton';

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
});

const Landing = (props) => {
  const { classes } = props;

  const credentials = {
    client: {
      id: process.env.REACT_APP_SPOTIFY_ID,
      secret: process.env.REACT_APP_SPOTIFY_SECRET,
    },
    auth: {
      tokenHost: 'https://accounts.spotify.com',
      authorizePath: '/authorize',
      tokenPath: '/api/token',
    },
  };

  const auth = oauth2.create(credentials);

  const JoinPartyLink = props => <Link to="/joinparty" {...props} />

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Grid item>
        <SpotifyLogo
          className={classes.logo}
        />
      </Grid>
      <Grid item>
        <SpotifyButton
          id="create-party-button"
          value="Create a party"
          onClick={() => {
            window.location.assign(auth.authorizationCode.authorizeURL({
              redirect_uri: 'http://localhost:3000/auth/',
              scope: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
            }));
          }}
        />
        <SpotifyButton
          id="create-party-button"
          value="Join party"
          component={JoinPartyLink}
        />
      </Grid>
    </Grid >
  );
};

export default compose(
  withStyles(styles),
)(Landing);
