import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import {
  Grid,
  List,
} from '@material-ui/core';

import ListItem from './QueueListItem';
import { withFirebase } from '../../Firebase';

const QueueList = (props) => {
  const { firebase } = props;

  const [items, setItems] = useState([]);

  useEffect(() => {
    const handleNewSongs = (songs) => {
      const newItems = [];
      songs.forEach((song) => {
        console.log('[QueueList] Found song: ', song.data().spotifyUri);
        const item = {
          artist: song.data().artist,
          title: song.data().title,
          album: song.data().album,
          picture: song.data().picture,
          spotifyUri: song.data().spotifyUri,
        };
        newItems.push(item);
      });
      setItems(newItems);
    };

    const unsubscribe = firebase.db.collection('parties').doc('BAQcvjUE6ongzcsSw7fX').collection('songs')
      .onSnapshot(handleNewSongs);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Grid item>
      <List dense={false}>
        {items.map(item => (
          <ListItem
            artist={item.artist}
            title={item.title}
            album={item.album}
            picture={item.picture}
            spotifyUri={item.spotifyUri}
          />
        ))}
      </List>
    </Grid>
  );
};

export default compose(
  withFirebase,
)(QueueList);
