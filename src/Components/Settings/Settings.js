import React from 'react';
import { compose } from 'recompose';
import { Typography, withStyles, Grid } from '@material-ui/core';
import SpotifyButton from '../SpotifyButton';
import { withSpotify } from '../../Spotify';
import Connect from '../Connect';
import UserPlaylists from '../UserPlaylists';

const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit * 2,
  },
});

const Settings = (props) => {
  const { classes, spotify } = props;

  const startParty = () => {
    spotify.startParty();
  };
  return (
    <div>
      <Typography variant="h4" className={classes.header}>Settings</Typography>
      <Grid container>
        <Grid item xs={12} md={6}>
          <SpotifyButton value="Start party" onClick={startParty} />
        </Grid>
      </Grid>
      <Connect />
      <Typography variant="h5">Fallback playlist</Typography>
      <UserPlaylists />
    </div>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(Settings);
