import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { Typography, withStyles, Grid } from '@material-ui/core';
import UserPlaylists from '../UserPlaylists';

const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit * 2,
  },
});

const FallbackPlaylist = (props) => {
  const { classes } = props;

  return (
    <Fragment>
      <Typography variant="h4" className={classes.header}>Fallback Playlist</Typography>
      <Grid container justify="center">
        <UserPlaylists />
      </Grid>
    </Fragment>
  );
};

export default compose(
  withStyles(styles),
)(FallbackPlaylist);
