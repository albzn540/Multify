import React from 'react';
import { compose } from 'recompose';
import {
  Grid,
  List,
} from '@material-ui/core';
import { withSpotify } from '../../Spotify';
import SearchListItem from './SearchListItem';

const SearchList = (props) => {
  const { tracks } = props;

  return (
    <Grid item>
      <List dense={false}>
        {tracks.map(track => (
          <SearchListItem
            album={track.album}
            artists={track.artists}
            id={track.id}
            name={track.name}
            uri={track.uri}
          />
        ))}
      </List>
    </Grid>
  );
};

export default compose(
  withSpotify,
)(SearchList);
