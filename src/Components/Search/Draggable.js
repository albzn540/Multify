import React from 'react';
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@material-ui/core';
import { compose } from 'recompose';
import Add from '../../Constants/Icons/Add';
import { withSpotify } from '../../Spotify';

const styles = theme => ({
  listText: {
    color: theme.palette.secondary.main,
  },
  listSubText: {
    color: theme.palette.common.lightGrey,
  },
  listItem: {
    backgroundColor: theme.palette.common.grey,
  },
});

const Draggable = (props) => {
  const {
    album,
    artists,
    id,
    name,
    uri,
    classes,
    onDragStart,
    spotify,
    partyId,
  } = props;

  const track = {
    id,
    artists,
    uri,
    name,
    album,
  };

  return (
    <ListItem
      onDragStart={e => onDragStart(e, track)}
      draggable="true"
      className={classes.listItem}
      divider="true"
    >
      <ListItemText
        disableTypography
        primary={(
          <Typography
            className={classes.listText}
          >
            {name}
          </Typography>
        )}
        secondary={(
          <Typography
            className={classes.listSubText}
          >
            {`${album.name} -${artists.map(artist => ` ${artist.name}`)}`}
          </Typography>
          )}
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() => spotify.addTrack(track, partyId)}
        >
          <Add />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default compose(
  withStyles(styles),
  withSpotify,
)(Draggable);
