import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { Typography, withStyles } from '@material-ui/core';
import NowPlayingSmall from './NowPlayingSmall';

const styles = theme => ({
});

const NowPlaying = (props) => {
  const { classes } = props;

  return (
    <Fragment>
      <Typography variant="h6" className={classes.text}>
        Now playing
      </Typography>
      <NowPlayingSmall />
    </Fragment>
  );
};

export default compose(
  withStyles(styles),
)(NowPlaying);
