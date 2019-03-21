import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  List,
} from '@material-ui/core';
import { withSpotify } from '../../Spotify';
import SearchListItem from './SearchListItem';

const styles = () => ({
  root: {
    width: '100%',
    maxWidth: '50vh',
    position: 'relative',
    overflow: 'auto',
    maxHeight: '50vh',
  },
});

const SearchList = (props) => {
  const { tracks, addTrack, classes } = props;

  return (
    <Grid item>
      <List
        dense={false}
        className={classes.root}
      >
        {tracks.map(track => (
          <SearchListItem
            album={track.album}
            artists={track.artists}
            id={track.id}
            name={track.name}
            uri={track.uri}
            addTrack={addTrack}
          />
        ))}
      </List>
    </Grid>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(SearchList);
