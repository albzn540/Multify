import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import NowPlayingSmall from './NowPlayingSmall';

const styles = () => ({
  root: {
    width: '100%',
  },
});

const NowPlaying = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography variant="h6">
        Now playing
      </Typography>
      <NowPlayingSmall />
    </div>
  );
};

export default compose(
  withStyles(styles),
)(NowPlaying);
