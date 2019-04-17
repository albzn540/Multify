import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import NowPlayingSmall from './NowPlayingSmall';


const NowPlaying = () => (
  <Fragment>
    <Typography variant="h6">
      Now playing
    </Typography>
    <NowPlayingSmall />
  </Fragment>
);

export default NowPlaying;
