import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  List,
} from '@material-ui/core';
import { withSpotify } from '../../Spotify';
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
    partyId,
    onDragStart,
  } = props;

  return (
    <List
      dense={false}
      className={classes.root}
      style={{ maxHeight: 780, overflow: 'auto' }}
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
