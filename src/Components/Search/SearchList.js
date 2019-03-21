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
        // TODO
        newSongs.push(song);
      });
      setItems(newSongs);
    };

    const unsubscribe = spotify.client.searchTracks(searchString)
      .then((data) => {
        console.log('Here are the songs', data);
        handleNewSearch(data);
      }, (err) => {
        console.log('[SearchList] Search error:', err);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log('[SearchList] got:', searchString);

  return (
    <Grid item>
      <List dense={false}>
        {items.map(item => (
          <SearchListItem />
        ))}
      </List>
    </Grid>
  );
};

export default compose(
  withSpotify,
)(SearchList);
