import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Typography,
  List,
  CircularProgress,
} from '@material-ui/core';
import { withFirebase } from '../../Firebase';
import { SongListItem, SongItem } from '../SongItem';

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexGrow: '1',
    height: `calc(100% - ${theme.spacing.unit * 8}px)`,
    padding: theme.spacing.unit,
  },
  text: {
    color: theme.palette.common.white,
  },
});

const Queue = (props) => {
  const { classes, partyId, firebase } = props;

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleQueueSongs = (queueSnap) => {
      const newTracks = [];
      queueSnap.forEach((queueDoc) => {
        const trackData = queueDoc.data();
        trackData.id = queueDoc.id;
        trackData.ref = queueDoc.ref;
        trackData.likes = 0;
        newTracks.push(trackData);
      });
      setTracks(newTracks);
      setLoading(false);
    };

    const unsubscribeParty = firebase.partyQueueRef(partyId)
      .onSnapshot(snap => handleQueueSongs(snap));

    return () => {
      unsubscribeParty();
    };
  }, []);

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
    console.log(allTracks);
    setTracks(allTracks);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.text}>
        Now playing
      </Typography>

      <List>
        <SongItem
          key="Give you up"
          name="Give you up"
          artists={['Rick']}
          album="pW0ned"
          albumUrl="https://www.femalefirst.co.uk/image-library/square/1000/r/rick-astley-whenever-you-need-somebody-album-cover.jpg"
        />
      </List>

      <Typography variant="h6" className={classes.text}>
        Queue
      </Typography>
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <List>
          {tracks.map(track => (
            <SongListItem
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
