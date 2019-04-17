import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Typography,
  List,
  CircularProgress,
} from '@material-ui/core';
import { QueueListItem } from '.';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  root: {},
  text: {
    color: theme.palette.common.white,
  },
});

const Queue = (props) => {
  const {
    classes, spotify, partyId,
  } = props;

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const update = () => {
    console.log('[Queue] Update', spotify.queue);
    setLoading(false);
    setTracks(spotify.queue);
  };

  useEffect(() => {
    spotify.setParty(partyId);
    const subscribeQueue = spotify.addObserver(update, ['queue']);
    return () => {
      subscribeQueue();
    };
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.text}>
        Queue
      </Typography>
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <List>
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
  withStyles(styles),
  withSpotify,
)(Queue);
