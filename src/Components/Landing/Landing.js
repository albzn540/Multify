import React from 'react';
import { compose } from 'recompose';
import { withStyles, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import SpotifyLogo from '../../Constants/SpotifyLogo';
import SpotifyButton from '../SpotifyButton';
import { withSpotify } from '../../Spotify';
import Spotify from '../../Spotify/Spotify';

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
  const { classes, spotify } = props;

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
          onClick={() => spotify.authorizeWithSignIn()}
        />
        <SpotifyButton
          id="join-party-button"
          value="Join party"
          component={JoinPartyLink}
        />
      </Grid>
    </Grid >
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(Landing);
