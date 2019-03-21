import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import {
  Grid,
  List,
} from '@material-ui/core';
import { withSpotify } from '../../Spotify';
import SearchListItem from './SearchListItem';

const SearchList = (props) => {
  const { spotify, searchString } = props;

  const [items, setItems] = useState([]);

  useEffect(() => {
    const handleNewSearch = (songs) => {
      const newSongs = [];
      songs.forEach((song) => {
        const item = {
          album: song.album,
          artists: song.artists,
          id: song.id,
          name: song.name,
          uri: song.uri,
        };
        newSongs.push(item);
      });
      setItems(newSongs);
    };

    const unsubscribe = spotify.client.searchTracks(searchString)
      .then((data) => {
        console.log('[SearchList] Found songs', data);
        handleNewSearch(data.tracks.items);
      }, (err) => {
        console.log('[SearchList] Search error:', err);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log('[SearchList] Got string:', searchString);

  /* {items.map(item => (
    <SearchListItem
      album={item.album}
      artists={item.artists}
      id={item.id}
      name={item.name}
      uri={item.uri}
    />
  ))} */

  return (
    <Grid item>
      <List dense={false}>
        {console.log('hello', items)}
      </List>
    </Grid>
  );
};

export default compose(
  withSpotify,
)(SearchList);
