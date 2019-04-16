import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Typography,
  List,
  CircularProgress,
} from '@material-ui/core';
import { withFirebase } from '../../Firebase';
import { QueueListItem } from '.';

const styles = theme => ({
  root: {},
  text: {
    color: theme.palette.common.white,
  },
});

const Queue = (props) => {
  const {
    classes, firebase, partyId,
  } = props;

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Compares two tracks based on number of upvotes.
   * If upvotes are equal the track added earliest
   * is the track selected by a .sort function.
   * @param {Object} track1
   * @param {Object} track2
   */
  const compare = (track1, track2) => {
    if (track1.likes > track2.likes) {
      return -1;
    }
    if (track1.likes < track2.likes) {
      return 1;
    }
    if (track1.timeStamp < track2.timeStamp) {
      return -1;
    }
    if (track1.timeStamp > track2.timeStamp) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    const handleQueueSongs = (queueSnap) => {
      const newTracks = [];
      queueSnap.forEach((queueDoc) => {
        const trackData = queueDoc.data();
        trackData.id = queueDoc.id;
        trackData.ref = queueDoc.ref;
        newTracks.push(trackData);
      });
      newTracks.sort(compare);
      setTracks(newTracks);
      setLoading(false);
      console.debug('[Queue][useEffect] New tracks', newTracks);
    };

    const unsubscribeParty = firebase.partyQueueRef(partyId)
      .onSnapshot(snap => handleQueueSongs(snap));

    return () => {
      unsubscribeParty();
    };
  }, []);

  const setLikes = (trackId, likes) => {
    const allTracks = tracks.filter(cTrack => cTrack.id !== trackId);
    const track = tracks.find(cTrack => cTrack.id === trackId);
    if (track) {
      track.likes = likes;
    } else {
      console.error(`Could not find track ${trackId} in queue`);
    }
    allTracks.push(track);
    allTracks.sort(compare);
    setTracks(allTracks);
  };

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
              songRef={track.ref}
              setLikes={setLikes}
            />
          ))}
        </List>
      )}
    </div>
  );
};

export default compose(
  withStyles(styles),
  withFirebase,
)(Queue);
