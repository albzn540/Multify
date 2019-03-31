import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import { withStyles, Typography, List } from '@material-ui/core';
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

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const unsibscribeParty = firebase.partyQueueRef(partyId).onSnapshot((snap) => {
      const newSongs = [];
      snap.forEach(songDoc => newSongs.push(songDoc.data()));
      setSongs(songs.concat(newSongs));
    });

    return () => {
      unsibscribeParty();
    };
  }, []);

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

      <List>
        {songs.map(song => (
          <SongListItem
            key={song.name}
            name={song.name}
            artists={song.artists}
            album={song.album.name}
            albumUrl={song.album.images[2].url}
          />
        ))}
      </List>
    </div>
  );
};

export default compose(
  withStyles(styles),
  withFirebase,
)(Queue);
