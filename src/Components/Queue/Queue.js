import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Typography,
  List,
  CircularProgress,
} from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import { QueueListItem } from '.';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  mobileRoot: {
    width: '90vw',
    height: '65vh',
  },
  desktopRoot: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: theme.palette.common.white,
  },
  list: {
    height: '100%',
    overflow: 'auto',
  },
});

const Queue = (props) => {
  const {
    classes, spotify,
  } = props;

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const update = () => {
    console.log('[Queue] Update', spotify.queue);
    setLoading(false);
    setTracks(spotify.queue);
  };

  useEffect(() => {
    // spotify.setParty(partyId);
    update();
    const subscribeQueue = spotify.addObserver(update, ['queue']);
    return () => {
      subscribeQueue();
    };
  }, []);

  return (
    <div className={isMobile ? classes.mobileRoot : classes.desktopRoot}>
      <Typography variant="h6" className={classes.text}>
        Queue
      </Typography>
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <List
          className={classes.list}
        >
          {tracks.map(track => (
            <QueueListItem
              key={track.id}
              name={track.name}
              artists={track.artists}
              album={track.album.name}
              albumUrl={track.album.images[2].url}
              id={track.id}
              liked={track.vote}
              trackRef={track.ref}
            />
          ))}
        </List>
      )}
    </div>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSpotify,
)(Queue);
