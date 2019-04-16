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

const styles = () => ({
  root: {
    width: '95%',
  },
});

const SearchList = (props) => {
  const {
    tracks,
    classes,
    onDragStart,
    partyId,
  } = props;

  return (
    <List
      dense={false}
      className={classes.root}
    >
      {tracks.map(track => (
        <Draggable
          key={track.id}
          album={track.album}
          artists={track.artists}
          id={track.id}
          name={track.name}
          uri={track.uri}
          onDragStart={onDragStart}
          partyId={partyId}
        />
      ))}
    </List>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(SearchList);
