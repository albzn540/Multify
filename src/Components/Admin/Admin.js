import React from 'react';
import { compose } from 'recompose';
import { Typography, withStyles } from '@material-ui/core';
import SpotifyButton from '../SpotifyButton';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
});

const Admin = (props) => {
  const { spotify } = props;

  const startParty = () => {
    spotify.startParty();
  };

  return (
    <div>
      <Typography variant="h4">Admin</Typography>
      <SpotifyButton value="Start party" onClick={startParty} />
    </div>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(Admin);
