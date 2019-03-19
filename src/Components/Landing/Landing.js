import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid, Button, Typography } from '@material-ui/core';
import * as oauth2 from 'simple-oauth2';
import { Link } from 'react-router-dom';
import SpotifyLogo from '../../Constants/SpotifyLogo';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
  logo: {
    color: theme.palette.green.main,
    paddingBottom: '80px',
    fontSize: '160px',
  },
  button: {
    borderRadius: '50px',
    marginBottom: '10px',
  },
  buttonText: {
    color: theme.palette.textPrimary.main,
    fontWeight: '500',
    fontSize: '0.9375rem',
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
      spacing={16}
    >
      <Grid item>
        <SpotifyLogo
          className={classes.logo}
        />
      </Grid>
      <Grid item>
        <Button
          id="create-party-button"
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          fullWidth
          onClick={() => {
            window.location.assign(auth.authorizationCode.authorizeURL({
              redirect_uri: 'http://localhost:3000/auth/',
              scope: ['playlist-modify-public', 'user-modify-playback-state', 'user-read-email'],
            }));
          }}
        >
          <Typography
            className={classes.buttonText}
          >
            Create a party
          </Typography>
        </Button>
        <Button
          id="create-party-button"
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          fullWidth
          component={JoinPartyLink}
        >
          <Typography
            className={classes.buttonText}
          >
            Join a party
            </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
)(Landing);
