import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { isMobile } from 'react-device-detect';
import NowPlayingSmall from './NowPlayingSmall';

const styles = () => ({
  desktopRoot: {
    width: '100%',
  },
  mobileRoot: {
    width: '90vw',
  },
});

const NowPlaying = (props) => {
  const { classes } = props;
  return (
    <div className={isMobile ? classes.mobileRoot : classes.desktopRoot}>
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
