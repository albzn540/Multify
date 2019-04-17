import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
  List,
} from '@material-ui/core';
import { withSpotify } from '../../Spotify';
// import SearchListItem from './SearchListItem';
import Draggable from './Draggable';
// import Draggable2 from './Draggable2';

const styles = () => ({
  root: {
    overflow: 'auto',
    listStyleType: 'none',
  },
  item: {
    position: 'realtive',
  },
});

const SearchList = (props) => {
  const {
    tracks,
    classes,
    partyId,
    top,
    bottom,
    right,
    left,
    onDragStart,
  } = props;

  return (
    <Grid item>
      <List className={classes.root}>
        {tracks.map(track => (
          <Draggable
            key={track.id}
            album={track.album}
            artists={track.artists}
            id={track.id}
            name={track.name}
            uri={track.uri}
            partyId={partyId}
            top={top}
            bottom={bottom}
            right={right}
            left={left}
            onDragStart={onDragStart}
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
